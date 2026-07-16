# Isolated installer smoke test for Windows and GitHub Actions.

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Write-Pass {
    param([string]$Message)
    Write-Host "PASS $Message" -ForegroundColor Green
}

function Assert-Equal {
    param($Actual, $Expected, [string]$Label)
    if ($Actual -ne $Expected) {
        throw "$Label expected $Expected, got $Actual"
    }
}

function Get-Sha256Hex {
    param([string]$Path)
    $stream = [System.IO.File]::OpenRead($Path)
    try {
        $hasher = [System.Security.Cryptography.SHA256]::Create()
        try {
            return (($hasher.ComputeHash($stream) | ForEach-Object { $_.ToString('X2') }) -join '')
        } finally {
            $hasher.Dispose()
        }
    } finally {
        $stream.Dispose()
    }
}

function Assert-FileContentMatches {
    param([string]$ActualPath, [string]$ExpectedPath, [string]$Label)
    if (-not (Test-Path -LiteralPath $ActualPath -PathType Leaf)) {
        throw "$Label is missing: $ActualPath"
    }
    if (-not (Test-Path -LiteralPath $ExpectedPath -PathType Leaf)) {
        throw "$Label source is missing: $ExpectedPath"
    }
    $actualHash = Get-Sha256Hex -Path $ActualPath
    $expectedHash = Get-Sha256Hex -Path $ExpectedPath
    Assert-Equal $actualHash $expectedHash "$Label content hash"
}

function Assert-OwnershipMetadata {
    param(
        [string]$Path,
        [string]$ExpectedRepo,
        [string]$ExpectedComponent,
        [string]$ExpectedName,
        [string]$ExpectedTarget,
        [string]$Label,
        [string]$ExpectedId,
        [string]$ExpectedAdapter
    )
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "$Label ownership metadata is missing: $Path"
    }
    try {
        $metadata = Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
    } catch {
        throw "$Label ownership metadata is invalid JSON: $Path ($($_.Exception.Message))"
    }
    Assert-Equal $metadata.source "local-checkout" "$Label metadata source"
    Assert-Equal $metadata.repo $ExpectedRepo "$Label metadata repo"
    Assert-Equal $metadata.branch "main" "$Label metadata branch"
    Assert-Equal $metadata.component $ExpectedComponent "$Label metadata component"
    Assert-Equal $metadata.name $ExpectedName "$Label metadata name"
    Assert-Equal $metadata.target $ExpectedTarget "$Label metadata target"
    if ($ExpectedComponent -eq "agent") {
        Assert-Equal $metadata.id $ExpectedId "$Label metadata id"
        Assert-Equal $metadata.adapter $ExpectedAdapter "$Label metadata adapter"
    } else {
        if ($metadata.contentSha256 -notmatch '\A[0-9a-f]{64}\z') {
            throw "$Label metadata contentSha256 is not a lowercase SHA-256"
        }
    }
}

function Write-Utf8NoBom {
    param([string]$Path, [string]$Text)
    [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Set-MetadataString {
    param([string]$Path, [string]$Field, [string]$Value)
    $metadata = Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
    $property = $metadata.PSObject.Properties | Where-Object { $_.Name -ceq $Field } | Select-Object -First 1
    if ($property) {
        $property.Value = $Value
    } else {
        $metadata | Add-Member -NotePropertyName $Field -NotePropertyValue $Value
    }
    Write-Utf8NoBom -Path $Path -Text (($metadata | ConvertTo-Json -Depth 5) + "`n")
}

function Get-CanonicalSingleFileSkillSha256 {
    param([string]$Path, [string]$RelativePath)
    $utf8 = [System.Text.UTF8Encoding]::new($false)
    $fileBytes = [System.IO.File]::ReadAllBytes($Path)
    $stream = [System.IO.MemoryStream]::new()
    try {
        foreach ($bytes in @(
            $utf8.GetBytes('autoverse-skill-content-v1'),
            [byte[]]@(0),
            $utf8.GetBytes($RelativePath.Replace('\', '/')),
            [byte[]]@(0),
            [System.Text.Encoding]::ASCII.GetBytes($fileBytes.Length.ToString([System.Globalization.CultureInfo]::InvariantCulture)),
            [byte[]]@(0),
            $fileBytes,
            [byte[]]@(0)
        )) {
            $stream.Write($bytes, 0, $bytes.Length)
        }
        $hasher = [System.Security.Cryptography.SHA256]::Create()
        try {
            return (($hasher.ComputeHash($stream.ToArray()) | ForEach-Object { $_.ToString('x2') }) -join '')
        } finally {
            $hasher.Dispose()
        }
    } finally {
        $stream.Dispose()
    }
}

function Assert-NoAtomicSkillArtifacts {
    param([string]$DestinationRoot, [string]$Label)
    $leftovers = @(Get-ChildItem -Force -LiteralPath $DestinationRoot -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -like '.autoverse-stage-*' -or
        $_.Name -like '.autoverse-backup-*' -or
        $_.Name -like '.autoverse-failed-*' -or
        $_.Name -like '.autoverse-cleanup-*'
    })
    if ($leftovers.Count -gt 0) {
        throw "$Label left atomic Skill artifacts: $($leftovers.Name -join ', ')"
    }
}

function Invoke-InstallerStep {
    param([string]$Label, [string[]]$InstallerArgs)
    $output = @(
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $script:Installer @InstallerArgs 2>&1 |
            ForEach-Object { $_.ToString() }
    )
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        $tail = @($output | Select-Object -Last 12) -join [Environment]::NewLine
        throw "$Label failed with exit code $exitCode$([Environment]::NewLine)$tail"
    }
    Write-Pass $Label
    return [pscustomobject]@{ Output = $output; ExitCode = $exitCode }
}

function Invoke-ExpectedFailure {
    param([string]$Label, [string]$ExpectedMessage, [string[]]$InstallerArgs)
    $output = @(
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $script:Installer @InstallerArgs 2>&1 |
            ForEach-Object { $_.ToString() }
    )
    $exitCode = $LASTEXITCODE
    $text = $output -join [Environment]::NewLine
    if ($exitCode -eq 0) { throw "$Label unexpectedly succeeded" }
    if ($text -notmatch [regex]::Escape($ExpectedMessage)) {
        throw "$Label failed without the expected message '$ExpectedMessage':$([Environment]::NewLine)$text"
    }
    Write-Pass $Label
}

function Assert-SafeSmokeRoot {
    param([string]$Path)
    $tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath()).TrimEnd(
        [System.IO.Path]::DirectorySeparatorChar,
        [System.IO.Path]::AltDirectorySeparatorChar
    )
    $resolved = [System.IO.Path]::GetFullPath($Path).TrimEnd(
        [System.IO.Path]::DirectorySeparatorChar,
        [System.IO.Path]::AltDirectorySeparatorChar
    )
    if (-not [string]::Equals([System.IO.Path]::GetDirectoryName($resolved), $tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to use smoke root outside the direct temp directory: $resolved"
    }
    if (-not [System.IO.Path]::GetFileName($resolved).StartsWith("autoverse-install-smoke-", [System.StringComparison]::Ordinal)) {
        throw "Refusing to use an unexpected smoke root: $resolved"
    }
    return $resolved
}

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$script:Installer = Join-Path $repoRoot "scripts\install.ps1"
$expectedRepo = "HsinPu/Autoverse-Ai-Agent-Skills"
$expectedSkills = (Get-Content -Raw -LiteralPath (Join-Path $repoRoot "skills.json") | ConvertFrom-Json).skills.Count
$expectedAgents = (Get-Content -Raw -LiteralPath (Join-Path $repoRoot "agents.json") | ConvertFrom-Json).agents.Count
$smokeRoot = Assert-SafeSmokeRoot -Path (Join-Path ([System.IO.Path]::GetTempPath()) "autoverse-install-smoke-$([Guid]::NewGuid().ToString('N'))")
$projectRoot = Join-Path $smokeRoot "project"
$originalEnvironment = @{}
foreach ($name in @(
    "USERPROFILE", "HOME", "CODEX_HOME", "XDG_CONFIG_HOME", "OPENCODE_CONFIG_DIR", "LOCALAPPDATA",
    "AUTOVERSE_INSTALLER_TEST_MODE", "AUTOVERSE_INSTALLER_TEST_ACK", "AUTOVERSE_INSTALLER_TEST_FAULT"
)) {
    $originalEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, "Process")
}

try {
    New-Item -ItemType Directory -Path $projectRoot | Out-Null
    $env:USERPROFILE = Join-Path $smokeRoot "home"
    $env:HOME = $env:USERPROFILE
    $env:CODEX_HOME = Join-Path $env:USERPROFILE ".codex"
    $env:XDG_CONFIG_HOME = Join-Path $env:USERPROFILE ".config"
    $env:OPENCODE_CONFIG_DIR = Join-Path $env:XDG_CONFIG_HOME "opencode"
    $env:LOCALAPPDATA = Join-Path $smokeRoot "localappdata"
    New-Item -ItemType Directory -Force -Path $env:USERPROFILE, $env:LOCALAPPDATA | Out-Null

    Invoke-ExpectedFailure -Label "PowerShell strict repository coordinate" -ExpectedMessage "Invalid GitHub repository" -InstallerArgs @(
        "-Target", "codex", "-Type", "skill", "-Name", "terminal-ops", "-Repo", "owner/repo/extra", "-SourceDir", $repoRoot, "-DryRun"
    )
    Invoke-ExpectedFailure -Label "PowerShell strict branch name" -ExpectedMessage "Invalid branch" -InstallerArgs @(
        "-Target", "codex", "-Type", "skill", "-Name", "terminal-ops", "-Branch", "main branch", "-SourceDir", $repoRoot, "-DryRun"
    )

    $canonicalDigestExpected = "3bb91f7d0ae1482c6e89f568675d98fc1c8b4e6e8bbb35314de43996a96a37b4"
    $canonicalSourceRoot = Join-Path $smokeRoot "canonical-digest-source"
    $canonicalSkillRoot = Join-Path $canonicalSourceRoot "skills\canonical-digest-fixture"
    $canonicalNestedRoot = Join-Path $canonicalSkillRoot "nested"
    $canonicalDestinationRoot = Join-Path $smokeRoot "canonical-digest-destination"
    New-Item -ItemType Directory -Force -Path $canonicalNestedRoot | Out-Null
    Write-Utf8NoBom -Path (Join-Path $canonicalSkillRoot "SKILL.md") -Text "---`nname: canonical-digest-fixture`ndescription: Canonical digest fixture.`nlicense: Apache-2.0`n---`n"
    Write-Utf8NoBom -Path (Join-Path $canonicalNestedRoot "plain.txt") -Text "alpha`n"
    $canonicalNonAsciiName = ([char]0x8cc7).ToString() + ([char]0x6599).ToString() + ".txt"
    $canonicalNonAsciiContent = ([char]0x8de8).ToString() + ([char]0x5e73).ToString() + ([char]0x53f0).ToString() + "`n"
    Write-Utf8NoBom -Path (Join-Path $canonicalNestedRoot $canonicalNonAsciiName) -Text $canonicalNonAsciiContent
    [System.IO.File]::WriteAllBytes(
        (Join-Path $canonicalSkillRoot "binary.dat"),
        [byte[]]@(0, 1, 2, 10, 13, 255, 128, 65)
    )
    Invoke-InstallerStep -Label "canonical cross-platform Skill digest fixture" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "canonical-digest-fixture", "-SourceDir", $canonicalSourceRoot, "-InstallDir", $canonicalDestinationRoot
    ) | Out-Null
    $canonicalMetadata = Get-Content -Raw -LiteralPath (Join-Path $canonicalDestinationRoot "canonical-digest-fixture\.skill-meta.json") | ConvertFrom-Json
    Assert-Equal $canonicalMetadata.contentSha256 $canonicalDigestExpected "canonical nested/binary/non-ASCII Skill digest"
    Write-Pass "canonical nested, binary, and non-ASCII Skill digest"

    Invoke-InstallerStep -Label "project all Skills install" -InstallerArgs @(
        "-Target", "project", "-Type", "skill", "-SourceDir", $repoRoot, "-InstallDir", $projectRoot
    ) | Out-Null
    Invoke-InstallerStep -Label "project all Agents install" -InstallerArgs @(
        "-Target", "project", "-Type", "agent", "-SourceDir", $repoRoot, "-InstallDir", $projectRoot
    ) | Out-Null

    $projectSkillProfiles = @(
        @{ Name = "agents"; Root = ".agents\skills" },
        @{ Name = "claude"; Root = ".claude\skills" }
    )
    foreach ($profile in $projectSkillProfiles) {
        $relativeRoot = $profile.Root
        $root = Join-Path $projectRoot $relativeRoot
        $skillCount = @(Get-ChildItem -LiteralPath $root -Directory | Where-Object {
            Test-Path -LiteralPath (Join-Path $_.FullName "SKILL.md") -PathType Leaf
        }).Count
        $metadataCount = @(Get-ChildItem -LiteralPath $root -Recurse -File -Filter ".skill-meta.json").Count
        Assert-Equal $skillCount $expectedSkills "$relativeRoot Skill count"
        Assert-Equal $metadataCount $expectedSkills "$relativeRoot Skill metadata count"
        $representativeSkillRoot = Join-Path $root "terminal-ops"
        Assert-FileContentMatches `
            -ActualPath (Join-Path $representativeSkillRoot "SKILL.md") `
            -ExpectedPath (Join-Path $repoRoot "skills\terminal-ops\SKILL.md") `
            -Label "$($profile.Name) project Skill"
        Assert-OwnershipMetadata `
            -Path (Join-Path $representativeSkillRoot ".skill-meta.json") `
            -ExpectedRepo $expectedRepo `
            -ExpectedComponent "skill" `
            -ExpectedName "terminal-ops" `
            -ExpectedTarget "project" `
            -Label "$($profile.Name) project Skill"
    }

    $agentProfiles = @(
        @{ Name = "codex"; Root = ".codex\agents"; Pattern = "*.toml"; Adapter = "codex"; Suffix = ".toml" },
        @{ Name = "claude"; Root = ".claude\agents"; Pattern = "*.md"; Adapter = "claude"; Suffix = ".md" },
        @{ Name = "cursor"; Root = ".cursor\agents"; Pattern = "*.md"; Adapter = "cursor"; Suffix = ".md" },
        @{ Name = "copilot"; Root = ".github\agents"; Pattern = "*.agent.md"; Adapter = "copilot"; Suffix = ".agent.md" },
        @{ Name = "opencode"; Root = ".opencode\agents"; Pattern = "*.md"; Adapter = "opencode"; Suffix = ".md" }
    )
    foreach ($profile in $agentProfiles) {
        $root = Join-Path $projectRoot $profile.Root
        Assert-Equal @(Get-ChildItem -LiteralPath $root -File -Filter $profile.Pattern).Count $expectedAgents "$($profile.Name) Agent count"
        Assert-Equal @(Get-ChildItem -LiteralPath $root -File -Filter "*.autoverse.json").Count $expectedAgents "$($profile.Name) Agent metadata count"
        $representativeAgentPath = Join-Path $root ("code-reviewer" + $profile.Suffix)
        Assert-FileContentMatches `
            -ActualPath $representativeAgentPath `
            -ExpectedPath (Join-Path $repoRoot ("adapters\" + $profile.Adapter + "\code-reviewer" + $profile.Suffix)) `
            -Label "$($profile.Name) project Agent"
        Assert-OwnershipMetadata `
            -Path ($representativeAgentPath + ".autoverse.json") `
            -ExpectedRepo $expectedRepo `
            -ExpectedComponent "agent" `
            -ExpectedName "code-reviewer" `
            -ExpectedTarget "project" `
            -ExpectedId "code-reviewer" `
            -ExpectedAdapter $profile.Adapter `
            -Label "$($profile.Name) project Agent"
    }
    Write-Pass "project profile counts, ownership metadata, and adapter content"

    $skillUpdate = Invoke-InstallerStep -Label "project Skill update" -InstallerArgs @(
        "-Target", "project", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $projectRoot
    )
    Assert-Equal @($skillUpdate.Output | Where-Object { $_ -match '^OK\s+update Skill ' }).Count 2 "project Skill update count"

    $agentUpdate = Invoke-InstallerStep -Label "project Agent update" -InstallerArgs @(
        "-Target", "project", "-Type", "agent", "-Name", "code-reviewer", "-SourceDir", $repoRoot, "-InstallDir", $projectRoot
    )
    Assert-Equal @($agentUpdate.Output | Where-Object { $_ -match '^OK\s+update Agent ' }).Count 5 "project Agent update count"

    $repairFile = Join-Path $projectRoot ".codex\agents\code-reviewer.toml"
    Remove-Item -Force -LiteralPath $repairFile
    $repair = Invoke-InstallerStep -Label "project Agent repair" -InstallerArgs @(
        "-Target", "project", "-Type", "agent", "-Name", "code-reviewer", "-SourceDir", $repoRoot, "-InstallDir", $projectRoot
    )
    Assert-Equal @($repair.Output | Where-Object { $_ -match '^OK\s+repair Agent ' }).Count 1 "project Agent repair count"
    Assert-Equal @($repair.Output | Where-Object { $_ -match '^OK\s+update Agent ' }).Count 4 "project unaffected Agent update count"
    if (-not (Test-Path -LiteralPath $repairFile -PathType Leaf)) { throw "Repair did not restore $repairFile" }

    $globalProfiles = @(
        @{
            Label = "Codex"; RequestedTarget = "codex"; OwnershipTarget = "codex"
            SkillName = "todo-first"; SkillRoot = Join-Path $env:CODEX_HOME "skills"
            AgentName = "accessibility-expert"; AgentRoot = Join-Path $env:CODEX_HOME "agents"
            Adapter = "codex"; Suffix = ".toml"
        },
        @{
            Label = "Claude"; RequestedTarget = "claude"; OwnershipTarget = "claude"
            SkillName = "frontend-code-review"; SkillRoot = Join-Path $env:USERPROFILE ".claude\skills"
            AgentName = "accounting-controller"; AgentRoot = Join-Path $env:USERPROFILE ".claude\agents"
            Adapter = "claude"; Suffix = ".md"
        },
        @{
            Label = "Cursor"; RequestedTarget = "cursor"; OwnershipTarget = "cursor"
            SkillName = "agent-creator-design"; SkillRoot = Join-Path $env:USERPROFILE ".cursor\skills"
            AgentName = "agent-harness-optimizer"; AgentRoot = Join-Path $env:USERPROFILE ".cursor\agents"
            Adapter = "cursor"; Suffix = ".md"
        },
        @{
            Label = "VS Code alias"; RequestedTarget = "vscode"; OwnershipTarget = "copilot"
            SkillName = "ask-questions-if-underspecified"; SkillRoot = Join-Path $env:USERPROFILE ".copilot\skills"
            AgentName = "ai-engineer"; AgentRoot = Join-Path $env:USERPROFILE ".copilot\agents"
            Adapter = "copilot"; Suffix = ".agent.md"
        },
        @{
            Label = "Copilot"; RequestedTarget = "copilot"; OwnershipTarget = "copilot"
            SkillName = "answer-writing"; SkillRoot = Join-Path $env:USERPROFILE ".copilot\skills"
            AgentName = "ai-safety-evaluator"; AgentRoot = Join-Path $env:USERPROFILE ".copilot\agents"
            Adapter = "copilot"; Suffix = ".agent.md"
        },
        @{
            Label = "OpenCode"; RequestedTarget = "opencode"; OwnershipTarget = "opencode"
            SkillName = "code-refactoring"; SkillRoot = Join-Path $env:OPENCODE_CONFIG_DIR "skills"
            AgentName = "analytics-engineer"; AgentRoot = Join-Path $env:OPENCODE_CONFIG_DIR "agents"
            Adapter = "opencode"; Suffix = ".md"
        }
    )
    foreach ($profile in $globalProfiles) {
        $skillInstall = Invoke-InstallerStep -Label "$($profile.Label) global Skill install" -InstallerArgs @(
            "-Target", $profile.RequestedTarget, "-Type", "skill", "-Name", $profile.SkillName, "-SourceDir", $repoRoot
        )
        Assert-Equal @($skillInstall.Output | Where-Object { $_ -match '^OK\s+install Skill ' }).Count 1 "$($profile.Label) Skill install count"
        $globalSkillRoot = Join-Path $profile.SkillRoot $profile.SkillName
        Assert-FileContentMatches `
            -ActualPath (Join-Path $globalSkillRoot "SKILL.md") `
            -ExpectedPath (Join-Path $repoRoot ("skills\" + $profile.SkillName + "\SKILL.md")) `
            -Label "$($profile.Label) global Skill"
        Assert-OwnershipMetadata `
            -Path (Join-Path $globalSkillRoot ".skill-meta.json") `
            -ExpectedRepo $expectedRepo `
            -ExpectedComponent "skill" `
            -ExpectedName $profile.SkillName `
            -ExpectedTarget $profile.OwnershipTarget `
            -Label "$($profile.Label) global Skill"
        $skillUpdate = Invoke-InstallerStep -Label "$($profile.Label) global Skill update" -InstallerArgs @(
            "-Target", $profile.RequestedTarget, "-Type", "skill", "-Name", $profile.SkillName, "-SourceDir", $repoRoot
        )
        Assert-Equal @($skillUpdate.Output | Where-Object { $_ -match '^OK\s+update Skill ' }).Count 1 "$($profile.Label) Skill update count"
        Assert-FileContentMatches `
            -ActualPath (Join-Path $globalSkillRoot "SKILL.md") `
            -ExpectedPath (Join-Path $repoRoot ("skills\" + $profile.SkillName + "\SKILL.md")) `
            -Label "$($profile.Label) updated global Skill"
        Assert-OwnershipMetadata `
            -Path (Join-Path $globalSkillRoot ".skill-meta.json") `
            -ExpectedRepo $expectedRepo `
            -ExpectedComponent "skill" `
            -ExpectedName $profile.SkillName `
            -ExpectedTarget $profile.OwnershipTarget `
            -Label "$($profile.Label) updated global Skill"

        $agentInstall = Invoke-InstallerStep -Label "$($profile.Label) global Agent install" -InstallerArgs @(
            "-Target", $profile.RequestedTarget, "-Type", "agent", "-Name", $profile.AgentName, "-SourceDir", $repoRoot
        )
        Assert-Equal @($agentInstall.Output | Where-Object { $_ -match '^OK\s+install Agent ' }).Count 1 "$($profile.Label) Agent install count"
        $globalAgentPath = Join-Path $profile.AgentRoot ($profile.AgentName + $profile.Suffix)
        Assert-FileContentMatches `
            -ActualPath $globalAgentPath `
            -ExpectedPath (Join-Path $repoRoot ("adapters\" + $profile.Adapter + "\" + $profile.AgentName + $profile.Suffix)) `
            -Label "$($profile.Label) global Agent"
        Assert-OwnershipMetadata `
            -Path ($globalAgentPath + ".autoverse.json") `
            -ExpectedRepo $expectedRepo `
            -ExpectedComponent "agent" `
            -ExpectedName $profile.AgentName `
            -ExpectedTarget $profile.OwnershipTarget `
            -ExpectedId $profile.AgentName `
            -ExpectedAdapter $profile.Adapter `
            -Label "$($profile.Label) global Agent"
        $agentUpdate = Invoke-InstallerStep -Label "$($profile.Label) global Agent update" -InstallerArgs @(
            "-Target", $profile.RequestedTarget, "-Type", "agent", "-Name", $profile.AgentName, "-SourceDir", $repoRoot
        )
        Assert-Equal @($agentUpdate.Output | Where-Object { $_ -match '^OK\s+update Agent ' }).Count 1 "$($profile.Label) Agent update count"
        Assert-FileContentMatches `
            -ActualPath $globalAgentPath `
            -ExpectedPath (Join-Path $repoRoot ("adapters\" + $profile.Adapter + "\" + $profile.AgentName + $profile.Suffix)) `
            -Label "$($profile.Label) updated global Agent"
        Assert-OwnershipMetadata `
            -Path ($globalAgentPath + ".autoverse.json") `
            -ExpectedRepo $expectedRepo `
            -ExpectedComponent "agent" `
            -ExpectedName $profile.AgentName `
            -ExpectedTarget $profile.OwnershipTarget `
            -ExpectedId $profile.AgentName `
            -ExpectedAdapter $profile.Adapter `
            -Label "$($profile.Label) updated global Agent"
    }
    Write-Pass "global Skill and Agent install/update matrix"

    $skillCollisionRoot = Join-Path $smokeRoot "project-skill-collision"
    $foreignSkillParent = Join-Path $skillCollisionRoot ".claude\skills"
    New-Item -ItemType Directory -Force -Path $foreignSkillParent | Out-Null
    $foreignSkill = Join-Path $foreignSkillParent "python-development"
    New-Item -ItemType Directory -Path $foreignSkill | Out-Null
    $foreignSkillFile = Join-Path $foreignSkill "SKILL.md"
    $foreignSkillMeta = Join-Path $foreignSkill ".skill-meta.json"
    [System.IO.File]::WriteAllText($foreignSkillFile, "FOREIGN SKILL SENTINEL - AUTOVERSE MUST NOT REPLACE THIS FILE`n", [System.Text.UTF8Encoding]::new($false))
    $foreignSkillHash = Get-Sha256Hex -Path $foreignSkillFile
    Invoke-ExpectedFailure -Label "project Skill ownership collision" -ExpectedMessage "no matching Autoverse metadata" -InstallerArgs @(
        "-Target", "project", "-Type", "skill", "-Name", "python-development", "-SourceDir", $repoRoot, "-InstallDir", $skillCollisionRoot
    )
    Assert-Equal (Get-Sha256Hex -Path $foreignSkillFile) $foreignSkillHash "foreign Skill sentinel hash"
    if (Test-Path -LiteralPath $foreignSkillMeta) {
        throw "Skill collision added ownership metadata to the foreign sentinel"
    }
    if (Test-Path -LiteralPath (Join-Path $skillCollisionRoot ".agents\skills\python-development")) {
        throw "Skill collision left a partial first-profile install"
    }

    $agentCollisionRoot = Join-Path $smokeRoot "project-agent-collision"
    $foreignAgentParent = Join-Path $agentCollisionRoot ".opencode\agents"
    New-Item -ItemType Directory -Force -Path $foreignAgentParent | Out-Null
    $foreignAgent = Join-Path $foreignAgentParent "code-reviewer.md"
    $foreignAgentMeta = $foreignAgent + ".autoverse.json"
    [System.IO.File]::WriteAllText($foreignAgent, "FOREIGN AGENT SENTINEL - AUTOVERSE MUST NOT REPLACE THIS FILE`n", [System.Text.UTF8Encoding]::new($false))
    $foreignAgentHash = Get-Sha256Hex -Path $foreignAgent
    Invoke-ExpectedFailure -Label "project Agent ownership collision" -ExpectedMessage "no matching Autoverse metadata" -InstallerArgs @(
        "-Target", "project", "-Type", "agent", "-Name", "code-reviewer", "-SourceDir", $repoRoot, "-InstallDir", $agentCollisionRoot
    )
    Assert-Equal (Get-Sha256Hex -Path $foreignAgent) $foreignAgentHash "foreign Agent sentinel hash"
    if (Test-Path -LiteralPath $foreignAgentMeta) {
        throw "Agent collision added ownership metadata to the foreign sentinel"
    }
    foreach ($partial in @(
        ".codex\agents\code-reviewer.toml",
        ".claude\agents\code-reviewer.md",
        ".cursor\agents\code-reviewer.md",
        ".github\agents\code-reviewer.agent.md"
    )) {
        $partialPath = Join-Path $agentCollisionRoot $partial
        if ((Test-Path -LiteralPath $partialPath) -or (Test-Path -LiteralPath ($partialPath + ".autoverse.json"))) {
            throw "Agent collision left a partial profile install: $partial"
        }
    }

    $skillOwnershipRoot = Join-Path $smokeRoot "skill-ownership-matrix"
    Invoke-InstallerStep -Label "Skill ownership matrix baseline install" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot
    ) | Out-Null
    $ownedSkillRoot = Join-Path $skillOwnershipRoot "terminal-ops"
    $ownedSkillFile = Join-Path $ownedSkillRoot "SKILL.md"
    $ownedSkillMeta = Join-Path $ownedSkillRoot ".skill-meta.json"
    $ownedSkillBaselineMeta = Get-Content -Raw -LiteralPath $ownedSkillMeta
    $ownedSkillBaselineHash = Get-Sha256Hex -Path $ownedSkillFile
    $skillMetadataCases = @(
        @{ Label = "repo mismatch"; Field = "repo"; Value = "foreign/repository"; Expected = "installed from" },
        @{ Label = "component mismatch"; Field = "component"; Value = "agent"; Expected = "ownership metadata does not match" },
        @{ Label = "name mismatch"; Field = "name"; Value = "python-development"; Expected = "ownership metadata does not match" },
        @{ Label = "target mismatch"; Field = "target"; Value = "codex"; Expected = "ownership metadata does not match" }
    )
    foreach ($case in $skillMetadataCases) {
        Write-Utf8NoBom -Path $ownedSkillMeta -Text $ownedSkillBaselineMeta
        Set-MetadataString -Path $ownedSkillMeta -Field $case.Field -Value $case.Value
        Invoke-ExpectedFailure -Label ("Skill ownership " + $case.Label) -ExpectedMessage $case.Expected -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot
        )
        Assert-Equal (Get-Sha256Hex -Path $ownedSkillFile) $ownedSkillBaselineHash ("Skill ownership " + $case.Label + " content hash")
    }

    Write-Utf8NoBom -Path $ownedSkillMeta -Text "{`n"
    Invoke-ExpectedFailure -Label "Skill malformed ownership metadata" -ExpectedMessage "Existing Autoverse metadata is invalid" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot
    )
    Assert-Equal (Get-Sha256Hex -Path $ownedSkillFile) $ownedSkillBaselineHash "Skill malformed metadata content hash"

    Write-Utf8NoBom -Path $ownedSkillMeta -Text $ownedSkillBaselineMeta
    Set-MetadataString -Path $ownedSkillMeta -Field "repo" -Value "foreign/repository"
    $forcedSkill = Invoke-InstallerStep -Label "Skill explicit force replacement" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot, "-Force"
    )
    Assert-Equal @($forcedSkill.Output | Where-Object { $_ -match '^OK\s+force-replace Skill ' }).Count 1 "Skill force replacement count"
    Assert-OwnershipMetadata -Path $ownedSkillMeta -ExpectedRepo $expectedRepo -ExpectedComponent "skill" -ExpectedName "terminal-ops" -ExpectedTarget "claude" -Label "forced Skill"

    $expectedTerminalOpsDigest = Get-CanonicalSingleFileSkillSha256 `
        -Path (Join-Path $repoRoot "skills\terminal-ops\SKILL.md") `
        -RelativePath "SKILL.md"
    $forcedMetadata = Get-Content -Raw -LiteralPath $ownedSkillMeta | ConvertFrom-Json
    Assert-Equal $forcedMetadata.contentSha256 $expectedTerminalOpsDigest "Skill canonical content digest"

    $localDriftFile = Join-Path $ownedSkillRoot "LOCAL-DRIFT.txt"
    Write-Utf8NoBom -Path $localDriftFile -Text "local customization that must not be overwritten`n"
    $driftFileHash = Get-Sha256Hex -Path $localDriftFile
    $driftSkillHash = Get-Sha256Hex -Path $ownedSkillFile
    $driftMetadataText = Get-Content -Raw -LiteralPath $ownedSkillMeta
    Invoke-ExpectedFailure -Label "Skill local content drift refusal" -ExpectedMessage "installed Skill content has changed since the last Autoverse install" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot
    )
    Assert-Equal (Get-Sha256Hex -Path $localDriftFile) $driftFileHash "drift refusal local file hash"
    Assert-Equal (Get-Sha256Hex -Path $ownedSkillFile) $driftSkillHash "drift refusal Skill hash"
    Assert-Equal (Get-Content -Raw -LiteralPath $ownedSkillMeta) $driftMetadataText "drift refusal metadata"
    Assert-NoAtomicSkillArtifacts -DestinationRoot $skillOwnershipRoot -Label "drift refusal"

    $forcedDriftReset = Invoke-InstallerStep -Label "Skill local drift force reset" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot, "-Force"
    )
    Assert-Equal @($forcedDriftReset.Output | Where-Object { $_ -match '^OK\s+force-replace Skill ' }).Count 1 "Skill drift force replacement count"
    if (Test-Path -LiteralPath $localDriftFile) { throw "Skill force reset preserved the local drift file" }
    $resetMetadata = Get-Content -Raw -LiteralPath $ownedSkillMeta | ConvertFrom-Json
    Assert-Equal $resetMetadata.contentSha256 $expectedTerminalOpsDigest "force reset content digest"
    Assert-NoAtomicSkillArtifacts -DestinationRoot $skillOwnershipRoot -Label "force reset"

    $rollbackSentinel = Join-Path $ownedSkillRoot "ROLLBACK-SENTINEL.txt"
    Write-Utf8NoBom -Path $rollbackSentinel -Text "the original directory must return after an injected commit failure`n"
    $rollbackSentinelHash = Get-Sha256Hex -Path $rollbackSentinel
    $rollbackSkillHash = Get-Sha256Hex -Path $ownedSkillFile
    $rollbackMetadataText = Get-Content -Raw -LiteralPath $ownedSkillMeta
    $faultEnvironmentNames = @(
        "AUTOVERSE_INSTALLER_TEST_MODE",
        "AUTOVERSE_INSTALLER_TEST_ACK",
        "AUTOVERSE_INSTALLER_TEST_FAULT"
    )
    $savedFaultEnvironment = @{}
    foreach ($name in $faultEnvironmentNames) {
        $savedFaultEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, "Process")
    }
    try {
        $env:AUTOVERSE_INSTALLER_TEST_MODE = "skill-atomic-swap"
        $env:AUTOVERSE_INSTALLER_TEST_ACK = "invalid-acknowledgement"
        $env:AUTOVERSE_INSTALLER_TEST_FAULT = "after-backup"
        Invoke-ExpectedFailure -Label "Skill fault injection strict gate" -ExpectedMessage "Invalid test-only Skill fault injection configuration" -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot, "-Force"
        )
        Assert-NoAtomicSkillArtifacts -DestinationRoot $skillOwnershipRoot -Label "invalid fault gate"

        $env:AUTOVERSE_INSTALLER_TEST_ACK = "I_UNDERSTAND_THIS_IS_TEST_ONLY"
        Invoke-ExpectedFailure -Label "Skill atomic rollback after backup" -ExpectedMessage "Injected test-only failure after Skill backup" -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot, "-Force"
        )

        Assert-Equal (Get-Sha256Hex -Path $rollbackSentinel) $rollbackSentinelHash "atomic rollback sentinel hash before race"
        Assert-Equal (Get-Sha256Hex -Path $ownedSkillFile) $rollbackSkillHash "atomic rollback Skill hash before race"
        Assert-Equal (Get-Content -Raw -LiteralPath $ownedSkillMeta) $rollbackMetadataText "atomic rollback metadata before race"

        $env:AUTOVERSE_INSTALLER_TEST_FAULT = "after-recheck-target-replaced"
        Invoke-ExpectedFailure -Label "Skill final-check replacement preserves foreign backup" -ExpectedMessage "Manual recovery required" -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot, "-Force"
        )
        if (Test-Path -LiteralPath $ownedSkillRoot) {
            throw "Skill final-check replacement unexpectedly recreated the destination"
        }
        $replacementBackups = @(Get-ChildItem -Force -LiteralPath $skillOwnershipRoot -Directory | Where-Object {
            $_.Name -like '.autoverse-backup-terminal-ops-*'
        })
        $replacementOriginals = @(Get-ChildItem -Force -LiteralPath $skillOwnershipRoot -Directory | Where-Object {
            $_.Name -like '.autoverse-failed-terminal-ops-*'
        })
        Assert-Equal $replacementBackups.Count 1 "Skill final-check replacement foreign backup count"
        Assert-Equal $replacementOriginals.Count 1 "Skill final-check replacement original count"
        $replacementBackup = $replacementBackups[0].FullName
        $replacementOriginal = $replacementOriginals[0].FullName
        if (-not (Test-Path -LiteralPath (Join-Path $replacementBackup "AUTOVERSE-REPLACEMENT-NEWCOMER.txt") -PathType Leaf)) {
            throw "Skill final-check replacement deleted the foreign directory"
        }
        Assert-Equal (Get-Sha256Hex -Path (Join-Path $replacementOriginal "ROLLBACK-SENTINEL.txt")) $rollbackSentinelHash "Skill final-check replacement original sentinel hash"
        Assert-Equal (Get-Sha256Hex -Path (Join-Path $replacementOriginal "SKILL.md")) $rollbackSkillHash "Skill final-check replacement original Skill hash"
        Assert-Equal (Get-Content -Raw -LiteralPath (Join-Path $replacementOriginal ".skill-meta.json")) $rollbackMetadataText "Skill final-check replacement original metadata"
        Remove-Item -Recurse -Force -LiteralPath $replacementBackup
        [System.IO.Directory]::Move($replacementOriginal, $ownedSkillRoot)
        Assert-NoAtomicSkillArtifacts -DestinationRoot $skillOwnershipRoot -Label "final-check replacement recovery"

        $env:AUTOVERSE_INSTALLER_TEST_FAULT = "after-recheck-destination-appears"
        Invoke-ExpectedFailure -Label "Skill destination race preserves newcomer" -ExpectedMessage "Manual recovery required" -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $skillOwnershipRoot, "-Force"
        )
        $newcomerSentinel = Join-Path $ownedSkillRoot "AUTOVERSE-NEWCOMER.txt"
        if (-not (Test-Path -LiteralPath $newcomerSentinel -PathType Leaf)) {
            throw "Skill destination race removed the newcomer sentinel"
        }
        $raceBackups = @(Get-ChildItem -Force -LiteralPath $skillOwnershipRoot -Directory | Where-Object {
            $_.Name -like '.autoverse-backup-terminal-ops-*'
        })
        Assert-Equal $raceBackups.Count 1 "Skill destination race retained backup count"
        $raceBackup = $raceBackups[0].FullName
        Assert-Equal (Get-Sha256Hex -Path (Join-Path $raceBackup "ROLLBACK-SENTINEL.txt")) $rollbackSentinelHash "Skill destination race backup sentinel hash"
        Assert-Equal (Get-Sha256Hex -Path (Join-Path $raceBackup "SKILL.md")) $rollbackSkillHash "Skill destination race backup Skill hash"
        Assert-Equal (Get-Content -Raw -LiteralPath (Join-Path $raceBackup ".skill-meta.json")) $rollbackMetadataText "Skill destination race backup metadata"

        Remove-Item -Recurse -Force -LiteralPath $ownedSkillRoot
        [System.IO.Directory]::Move($raceBackup, $ownedSkillRoot)

        $freshPostMoveRoot = Join-Path $smokeRoot "fresh-post-move-fault"
        New-Item -ItemType Directory -Path $freshPostMoveRoot | Out-Null
        $env:AUTOVERSE_INSTALLER_TEST_FAULT = "fresh-post-move-fail"
        Invoke-ExpectedFailure -Label "fresh Skill post-move failure cleans only transaction" -ExpectedMessage "Injected test-only failure after fresh Skill stage move" -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $freshPostMoveRoot
        )
        if (Test-Path -LiteralPath (Join-Path $freshPostMoveRoot "terminal-ops")) {
            throw "fresh Skill post-move failure left the transaction at its destination"
        }
        Assert-NoAtomicSkillArtifacts -DestinationRoot $freshPostMoveRoot -Label "fresh post-move failure"

        $stageCollisionRoot = Join-Path $smokeRoot "stage-collision-fault"
        New-Item -ItemType Directory -Path $stageCollisionRoot | Out-Null
        $env:AUTOVERSE_INSTALLER_TEST_FAULT = "stage-path-collision"
        Invoke-ExpectedFailure -Label "Skill stage collision preserves newcomer" -ExpectedMessage "refusing to clean an unrecognized or changed atomic Skill stage" -InstallerArgs @(
            "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $stageCollisionRoot
        )
        if (Test-Path -LiteralPath (Join-Path $stageCollisionRoot "terminal-ops")) {
            throw "Skill stage collision unexpectedly installed the Skill"
        }
        $collisionStages = @(Get-ChildItem -Force -LiteralPath $stageCollisionRoot -Directory | Where-Object {
            $_.Name -like '.autoverse-stage-terminal-ops-*'
        })
        Assert-Equal $collisionStages.Count 1 "Skill stage collision retained newcomer count"
        $collisionStage = $collisionStages[0].FullName
        if (-not (Test-Path -LiteralPath (Join-Path $collisionStage "AUTOVERSE-STAGE-NEWCOMER.txt") -PathType Leaf)) {
            throw "Skill stage collision deleted the newcomer sentinel"
        }
        Remove-Item -Recurse -Force -LiteralPath $collisionStage
        Assert-NoAtomicSkillArtifacts -DestinationRoot $stageCollisionRoot -Label "stage collision manual recovery"
    } finally {
        foreach ($name in $faultEnvironmentNames) {
            if ($null -eq $savedFaultEnvironment[$name]) {
                Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
            } else {
                Set-Item -LiteralPath "Env:$name" -Value $savedFaultEnvironment[$name]
            }
        }
    }
    Assert-Equal (Get-Sha256Hex -Path $rollbackSentinel) $rollbackSentinelHash "atomic rollback sentinel hash"
    Assert-Equal (Get-Sha256Hex -Path $ownedSkillFile) $rollbackSkillHash "atomic rollback Skill hash"
    Assert-Equal (Get-Content -Raw -LiteralPath $ownedSkillMeta) $rollbackMetadataText "atomic rollback metadata"
    Assert-NoAtomicSkillArtifacts -DestinationRoot $skillOwnershipRoot -Label "atomic rollback"
    Write-Pass "Skill digest, local drift refusal, force reset, and atomic rollback"

    $legacySkillRoot = Join-Path $smokeRoot "legacy-skill-migration"
    New-Item -ItemType Directory -Force -Path $legacySkillRoot | Out-Null
    Copy-Item -Recurse -LiteralPath (Join-Path $repoRoot "skills\terminal-ops") -Destination $legacySkillRoot
    $legacySkillMeta = Join-Path $legacySkillRoot "terminal-ops\.skill-meta.json"
    $legacyTimestamp = (Get-Date).ToUniversalTime().ToString("o")
    $legacyMetadata = @{
        source = "local-checkout"; repo = $expectedRepo; branch = "main"; name = "terminal-ops"; agent = "claude"
        installedAt = $legacyTimestamp; updatedAt = $legacyTimestamp
    } | ConvertTo-Json -Depth 3
    Write-Utf8NoBom -Path $legacySkillMeta -Text ($legacyMetadata + "`n")
    $legacyMigration = Invoke-InstallerStep -Label "legacy Skill metadata migration" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "terminal-ops", "-SourceDir", $repoRoot, "-InstallDir", $legacySkillRoot
    )
    Assert-Equal @($legacyMigration.Output | Where-Object { $_ -match '^OK\s+migrate-update Skill ' }).Count 1 "legacy Skill migration count"
    Assert-OwnershipMetadata -Path $legacySkillMeta -ExpectedRepo $expectedRepo -ExpectedComponent "skill" -ExpectedName "terminal-ops" -ExpectedTarget "claude" -Label "legacy migrated Skill"

    $licenseMigrationRoot = Join-Path $smokeRoot "legacy-license-migration"
    New-Item -ItemType Directory -Force -Path $licenseMigrationRoot | Out-Null
    $repoReadySource = Join-Path $repoRoot "skills\repo-ready"
    Copy-Item -Recurse -LiteralPath $repoReadySource -Destination $licenseMigrationRoot
    $legacyRepoReadyRoot = Join-Path $licenseMigrationRoot "repo-ready"
    $legacyRepoReadyFile = Join-Path $legacyRepoReadyRoot "SKILL.md"
    $currentRepoReadyText = Get-Content -Raw -LiteralPath (Join-Path $repoReadySource "SKILL.md")
    $repoReadyFrontmatter = [regex]::Match($currentRepoReadyText, '\A---\r?\n[\s\S]*?\r?\n---(?<body>[\s\S]*)\z')
    if (-not $repoReadyFrontmatter.Success) { throw "repo-ready source frontmatter fixture is invalid" }
    $legacyRepoReadyText = @(
        "---",
        "name: repo-ready",
        "description: Legacy repo-ready migration fixture.",
        "source: `"$expectedRepo`"",
        "license: MIT",
        "---"
    ) -join "`n"
    $legacyRepoReadyText += $repoReadyFrontmatter.Groups['body'].Value
    Write-Utf8NoBom -Path $legacyRepoReadyFile -Text $legacyRepoReadyText
    $legacyRepoReadyMeta = Join-Path $legacyRepoReadyRoot ".skill-meta.json"
    $legacyRepoReadyMetadata = @{
        source = "local-checkout"; repo = $expectedRepo; branch = "main"; name = "repo-ready"; agent = "claude"
        installedAt = $legacyTimestamp; updatedAt = $legacyTimestamp
    } | ConvertTo-Json -Depth 3
    Write-Utf8NoBom -Path $legacyRepoReadyMeta -Text ($legacyRepoReadyMetadata + "`n")
    $licenseMigration = Invoke-InstallerStep -Label "legacy Skill nested previous-license migration" -InstallerArgs @(
        "-Target", "claude", "-Type", "skill", "-Name", "repo-ready", "-SourceDir", $repoRoot, "-InstallDir", $licenseMigrationRoot
    )
    Assert-Equal @($licenseMigration.Output | Where-Object { $_ -match '^OK\s+migrate-update Skill ' }).Count 1 "legacy nested previous-license migration count"
    Assert-FileContentMatches -ActualPath $legacyRepoReadyFile -ExpectedPath (Join-Path $repoReadySource "SKILL.md") -Label "nested previous-license migrated Skill"
    Assert-OwnershipMetadata -Path $legacyRepoReadyMeta -ExpectedRepo $expectedRepo -ExpectedComponent "skill" -ExpectedName "repo-ready" -ExpectedTarget "claude" -Label "nested previous-license migrated Skill"
    Assert-NoAtomicSkillArtifacts -DestinationRoot $licenseMigrationRoot -Label "nested previous-license migration"

    $agentOwnershipRoot = Join-Path $smokeRoot "agent-ownership-matrix"
    Invoke-InstallerStep -Label "Agent ownership matrix baseline install" -InstallerArgs @(
        "-Target", "claude", "-Type", "agent", "-Name", "code-reviewer", "-SourceDir", $repoRoot, "-InstallDir", $agentOwnershipRoot
    ) | Out-Null
    $ownedAgentFile = Join-Path $agentOwnershipRoot "code-reviewer.md"
    $ownedAgentMeta = $ownedAgentFile + ".autoverse.json"
    $ownedAgentBaselineMeta = Get-Content -Raw -LiteralPath $ownedAgentMeta
    $ownedAgentBaselineHash = Get-Sha256Hex -Path $ownedAgentFile
    foreach ($case in @(
        @{ Label = "id mismatch"; Field = "id"; Value = "debugger" },
        @{ Label = "adapter mismatch"; Field = "adapter"; Value = "codex" }
    )) {
        Write-Utf8NoBom -Path $ownedAgentMeta -Text $ownedAgentBaselineMeta
        Set-MetadataString -Path $ownedAgentMeta -Field $case.Field -Value $case.Value
        Invoke-ExpectedFailure -Label ("Agent ownership " + $case.Label) -ExpectedMessage "ownership metadata does not match" -InstallerArgs @(
            "-Target", "claude", "-Type", "agent", "-Name", "code-reviewer", "-SourceDir", $repoRoot, "-InstallDir", $agentOwnershipRoot
        )
        Assert-Equal (Get-Sha256Hex -Path $ownedAgentFile) $ownedAgentBaselineHash ("Agent ownership " + $case.Label + " content hash")
    }
    Write-Pass "ownership metadata mismatch, malformed, force, and legacy migration matrix"

    Invoke-InstallerStep -Label "Codex auto-delegation install" -InstallerArgs @(
        "-Target", "codex", "-Type", "agent", "-Name", "debugger", "-SourceDir", $repoRoot, "-EnableAutoDelegation"
    ) | Out-Null
    $codexUpdate = Invoke-InstallerStep -Label "Codex auto-delegation update" -InstallerArgs @(
        "-Target", "codex", "-Type", "agent", "-Name", "debugger", "-SourceDir", $repoRoot, "-EnableAutoDelegation"
    )
    Assert-Equal @($codexUpdate.Output | Where-Object { $_ -match '^OK\s+update Agent ' }).Count 1 "Codex Agent update count"
    $configPath = Join-Path $env:CODEX_HOME "config.toml"
    $configText = Get-Content -Raw -LiteralPath $configPath
    Assert-Equal ([regex]::Matches($configText, '(?m)^# AUTOVERSE_AUTO_DELEGATION_START\s*$').Count) 1 "Codex auto-delegation block count"
    if (-not (Test-Path -LiteralPath (Join-Path $env:CODEX_HOME "agents\debugger.toml") -PathType Leaf)) {
        throw "Codex Agent was not installed in the isolated CODEX_HOME"
    }

    Write-Host "PowerShell installer smoke passed: $expectedSkills Skills, $expectedAgents Agents."
} finally {
    if (Test-Path -LiteralPath $smokeRoot) {
        $safeRoot = Assert-SafeSmokeRoot -Path $smokeRoot
        $item = Get-Item -Force -LiteralPath $safeRoot
        if (($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
            throw "Refusing to clean a reparse-point smoke root: $safeRoot"
        }
        Remove-Item -Recurse -Force -LiteralPath $safeRoot
    }
    foreach ($name in $originalEnvironment.Keys) {
        if ($null -eq $originalEnvironment[$name]) {
            Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
        } else {
            Set-Item -LiteralPath "Env:$name" -Value $originalEnvironment[$name]
        }
    }
}
