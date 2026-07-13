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

function Assert-FileContentMatches {
    param([string]$ActualPath, [string]$ExpectedPath, [string]$Label)
    if (-not (Test-Path -LiteralPath $ActualPath -PathType Leaf)) {
        throw "$Label is missing: $ActualPath"
    }
    if (-not (Test-Path -LiteralPath $ExpectedPath -PathType Leaf)) {
        throw "$Label source is missing: $ExpectedPath"
    }
    $actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $ActualPath).Hash
    $expectedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $ExpectedPath).Hash
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
foreach ($name in @("USERPROFILE", "HOME", "CODEX_HOME", "XDG_CONFIG_HOME", "OPENCODE_CONFIG_DIR", "LOCALAPPDATA")) {
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
    $foreignSkillHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $foreignSkillFile).Hash
    Invoke-ExpectedFailure -Label "project Skill ownership collision" -ExpectedMessage "no matching Autoverse metadata" -InstallerArgs @(
        "-Target", "project", "-Type", "skill", "-Name", "python-development", "-SourceDir", $repoRoot, "-InstallDir", $skillCollisionRoot
    )
    Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $foreignSkillFile).Hash $foreignSkillHash "foreign Skill sentinel hash"
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
    $foreignAgentHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $foreignAgent).Hash
    Invoke-ExpectedFailure -Label "project Agent ownership collision" -ExpectedMessage "no matching Autoverse metadata" -InstallerArgs @(
        "-Target", "project", "-Type", "agent", "-Name", "code-reviewer", "-SourceDir", $repoRoot, "-InstallDir", $agentCollisionRoot
    )
    Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $foreignAgent).Hash $foreignAgentHash "foreign Agent sentinel hash"
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
