# Autoverse AI Agent Skills installer for Windows.

param(
    [Alias("Agent")]
    [string]$Target,
    [ValidateSet("skill", "agent")]
    [string]$Type = "skill",
    [Alias("Skill")]
    [string]$Name,
    [string]$Branch = "main",
    [string]$Repo = "HsinPu/Autoverse-Ai-Agent-Skills",
    [string]$SourceDir,
    [string]$InstallDir,
    [switch]$EnableAutoDelegation,
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

try { [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new() } catch {}

function Write-Info { param([string]$Message) Write-Host "==> $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message) Write-Host "OK  $Message" -ForegroundColor Green }
function Write-Fail { param([string]$Message) Write-Host "Error: $Message" -ForegroundColor Red }

function Show-Usage {
    Write-Host @"
Autoverse AI Agent Skills installer

Usage:
  .\scripts\install.ps1 -Target <target> [-Type skill] [-Name <skill>] [-InstallDir path] [-DryRun] [-Force]
  .\scripts\install.ps1 -Target <target> -Type agent [-Name <role>] [-InstallDir path] [-EnableAutoDelegation] [-DryRun] [-Force]

Compatibility aliases:
  -Agent is an alias for -Target; -Skill is an alias for -Name.
  -SourceDir installs from a local checkout; otherwise the requested GitHub repo and branch are downloaded.
  -InstallDir is a direct destination for tool targets and the project root for the 'project' target.
  Omit -Name with -Type agent to install every available Agent.

Skill targets:
  codex, claude, cursor, vscode, copilot, opencode, project

Agent targets:
  codex, claude, cursor, vscode, copilot, opencode, project

Examples:
  .\scripts\install.ps1 -Target codex -Name python-development
  .\scripts\install.ps1 -Agent codex -Skill python-development
  .\scripts\install.ps1 -Target codex -Type agent -Name code-reviewer
  .\scripts\install.ps1 -Target codex -Type agent -EnableAutoDelegation
  .\scripts\install.ps1 -Target opencode -Type agent
  .\scripts\install.ps1 -Target project -Type agent -Name debugger -DryRun

Safety:
  Existing components are updated only when repo, component, name, and target metadata all match.
  Agent updates additionally require matching id and adapter metadata.
  Full Agent installs also install the subagent-architecture Skill.
  'project' installs cross-tool files below the current directory (or -InstallDir project root).
  'vscode' is an alias for 'copilot' and uses the same ownership metadata.
  Global auto-delegation is opt-in and never overwrites conflicting user instructions.
  Unknown same-named content is blocked unless -Force is provided.
"@
}

function Get-HomeDir {
    if ($env:USERPROFILE) { return $env:USERPROFILE }
    return [Environment]::GetFolderPath("UserProfile")
}

function Get-CodexHome {
    if ($env:CODEX_HOME) { return $env:CODEX_HOME }
    return Join-Path (Get-HomeDir) ".codex"
}

function Get-CodexSkillRoot {
    param(
        [string]$SkillName,
        [string]$RepoName,
        [string]$IncomingSkillFile
    )
    $homeDir = Get-HomeDir
    $canonicalRoot = Join-Path (Get-CodexHome) "skills"
    if (-not $SkillName) { return $canonicalRoot }

    $alternateRoots = @(Join-Path $homeDir ".agents\skills")
    $defaultLegacyRoot = Join-Path $homeDir ".codex\skills"
    if ([System.IO.Path]::GetFullPath($canonicalRoot) -ine [System.IO.Path]::GetFullPath($defaultLegacyRoot)) {
        $alternateRoots += $defaultLegacyRoot
    }
    $alternateRoots = @($alternateRoots | Where-Object {
        [System.IO.Path]::GetFullPath($_) -ine [System.IO.Path]::GetFullPath($canonicalRoot)
    } | Sort-Object -Unique)

    $canonicalTarget = Join-Path $canonicalRoot $SkillName
    $existingAlternateRoots = @($alternateRoots | Where-Object { Test-Path -LiteralPath (Join-Path $_ $SkillName) })
    if (Test-Path -LiteralPath $canonicalTarget) {
        if ($existingAlternateRoots.Count -gt 0) {
            throw "Codex Skill '$SkillName' exists in both canonical root '$canonicalRoot' and alternate root(s): $($existingAlternateRoots -join ', '). Remove or reconcile the duplicate before installing."
        }
        return $canonicalRoot
    }
    if ($existingAlternateRoots.Count -gt 1) {
        throw "Codex Skill '$SkillName' has multiple alternate copies: $($existingAlternateRoots -join ', '). Remove or reconcile the duplicate before installing."
    }

    $ownedAlternateRoots = @()
    foreach ($alternateRoot in $existingAlternateRoots) {
        $alternateTarget = Join-Path $alternateRoot $SkillName
        $metaPath = Join-Path $alternateTarget ".skill-meta.json"
        try {
            $plan = Get-InstallAction -TargetPath $alternateTarget -MetaPath $metaPath -Label $SkillName -RepoName $RepoName -ExpectedComponent "skill" -ExpectedName $SkillName -ExpectedTarget "codex" -LegacyIdentityPath (Join-Path $alternateTarget "SKILL.md") -IncomingIdentityPath $IncomingSkillFile
            if ($plan.Action -in @("update", "repair", "migrate-update")) {
                $ownedAlternateRoots += $alternateRoot
            }
        } catch {
            # Alternate content without matching ownership is never an update destination.
        }
    }
    if ($ownedAlternateRoots.Count -eq 1) { return $ownedAlternateRoots[0] }
    if ($existingAlternateRoots.Count -gt 0) {
        throw "Codex Skill '$SkillName' already exists in alternate root '$($existingAlternateRoots[0])' without matching Autoverse ownership. Refusing to create a duplicate in canonical root '$canonicalRoot'."
    }
    return $canonicalRoot
}

function Get-ConfigHome {
    return $(if ($env:XDG_CONFIG_HOME) { $env:XDG_CONFIG_HOME } else { Join-Path (Get-HomeDir) ".config" })
}

function Get-OpenCodeConfigRoot {
    if ($env:OPENCODE_CONFIG_DIR) { return $env:OPENCODE_CONFIG_DIR }
    return Join-Path (Get-ConfigHome) "opencode"
}

function Resolve-TargetName {
    param([string]$TargetName, [string]$ComponentType)
    $normalized = $TargetName.Trim().ToLowerInvariant()
    $supported = @("codex", "claude", "cursor", "vscode", "copilot", "opencode", "project")
    if ($supported -notcontains $normalized) { throw "Unsupported $ComponentType target: $TargetName" }
    if ($normalized -eq "vscode") { return "copilot" }
    return $normalized
}

function Resolve-InstallPath {
    param([string]$TargetName, [string]$ComponentType, [string]$ComponentName, [string]$RepoName, [string]$IncomingSkillFile)
    $homeDir = Get-HomeDir
    $codexHome = Get-CodexHome
    $openCodeRoot = Get-OpenCodeConfigRoot

    if ($ComponentType -eq "agent") {
        switch ($TargetName.ToLowerInvariant()) {
            "codex" { return Join-Path $codexHome "agents" }
            "claude" { return Join-Path $homeDir ".claude\agents" }
            "cursor" { return Join-Path $homeDir ".cursor\agents" }
            "copilot" { return Join-Path $homeDir ".copilot\agents" }
            "opencode" { return Join-Path $openCodeRoot "agents" }
            default { throw "Unsupported Agent target: $TargetName" }
        }
    }

    switch ($TargetName.ToLowerInvariant()) {
        "claude" { return Join-Path $homeDir ".claude\skills" }
        "cursor" { return Join-Path $homeDir ".cursor\skills" }
        "codex" { return Get-CodexSkillRoot -SkillName $ComponentName -RepoName $RepoName -IncomingSkillFile $IncomingSkillFile }
        "copilot" { return Join-Path $homeDir ".copilot\skills" }
        "opencode" { return Join-Path $openCodeRoot "skills" }
        default { throw "Unsupported Skill target: $TargetName" }
    }
}

function Get-ProjectRoot {
    param([string]$RequestedRoot)
    if ($RequestedRoot) { return [System.IO.Path]::GetFullPath($RequestedRoot) }
    return (Get-Location).Path
}

function Get-SkillInstallProfiles {
    param([string]$TargetName, [string]$ComponentName, [string]$RequestedInstallDir, [string]$RepoName, [string]$IncomingSkillFile)
    if ($TargetName -eq "project") {
        $root = Get-ProjectRoot -RequestedRoot $RequestedInstallDir
        return @(
            @{ DestinationRoot = Join-Path $root ".agents\skills"; TargetName = "project"; LegacyTargets = @("codex-project") },
            @{ DestinationRoot = Join-Path $root ".claude\skills"; TargetName = "project"; LegacyTargets = @("claude-project") }
        )
    }
    $destinationRoot = if ($RequestedInstallDir) {
        [System.IO.Path]::GetFullPath($RequestedInstallDir)
    } else {
        Resolve-InstallPath -TargetName $TargetName -ComponentType "skill" -ComponentName $ComponentName -RepoName $RepoName -IncomingSkillFile $IncomingSkillFile
    }
    $legacyTargets = if ($TargetName -eq "copilot") { @("vscode") } else { @() }
    return ,@{ DestinationRoot = $destinationRoot; TargetName = $TargetName; LegacyTargets = $legacyTargets }
}

function Get-AgentInstallProfiles {
    param([string]$TargetName, [string]$RequestedInstallDir)
    if ($TargetName -eq "project") {
        $root = Get-ProjectRoot -RequestedRoot $RequestedInstallDir
        return @(
            @{ DestinationRoot = Join-Path $root ".codex\agents"; TargetName = "project"; Platform = "codex"; OutputSuffix = ".toml"; LegacyTargets = @("codex-project") },
            @{ DestinationRoot = Join-Path $root ".claude\agents"; TargetName = "project"; Platform = "claude"; OutputSuffix = ".md"; LegacyTargets = @("claude-project") },
            @{ DestinationRoot = Join-Path $root ".cursor\agents"; TargetName = "project"; Platform = "cursor"; OutputSuffix = ".md"; LegacyTargets = @("cursor-project") },
            @{ DestinationRoot = Join-Path $root ".github\agents"; TargetName = "project"; Platform = "copilot"; OutputSuffix = ".agent.md"; LegacyTargets = @("copilot-project", "vscode-project", "vscode") },
            @{ DestinationRoot = Join-Path $root ".opencode\agents"; TargetName = "project"; Platform = "opencode"; OutputSuffix = ".md"; LegacyTargets = @("opencode-project") }
        )
    }

    switch ($TargetName) {
        "codex" { $platform = "codex"; $outputSuffix = ".toml" }
        "claude" { $platform = "claude"; $outputSuffix = ".md" }
        "cursor" { $platform = "cursor"; $outputSuffix = ".md" }
        "copilot" { $platform = "copilot"; $outputSuffix = ".agent.md" }
        "opencode" { $platform = "opencode"; $outputSuffix = ".md" }
        default { throw "Unsupported Agent target: $TargetName" }
    }
    $destinationRoot = if ($RequestedInstallDir) {
        [System.IO.Path]::GetFullPath($RequestedInstallDir)
    } else {
        Resolve-InstallPath -TargetName $TargetName -ComponentType "agent"
    }
    $legacyTargets = if ($TargetName -eq "copilot") { @("vscode") } else { @() }
    return ,@{ DestinationRoot = $destinationRoot; TargetName = $TargetName; Platform = $platform; OutputSuffix = $outputSuffix; LegacyTargets = $legacyTargets }
}

function Test-ComponentName {
    param([string]$ComponentType, [string]$ComponentName)
    if ($ComponentType -eq "agent") {
        if (-not $ComponentName) { return }
        if ($ComponentName -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
            throw "Invalid Agent Name '$ComponentName'. Expected a lowercase hyphen-case role."
        }
        return
    }
    if (-not $ComponentName) { return }
    if ($ComponentName -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
        throw "Invalid Skill Name '$ComponentName'. Expected a lowercase hyphen-case catalog name."
    }
}

function Invoke-DownloadArchive {
    param([string]$RepoName, [string]$BranchName, [string]$Destination)
    Write-Info "Downloading $RepoName@$BranchName"
    Invoke-WebRequest -Uri "https://codeload.github.com/$RepoName/zip/refs/heads/$BranchName" -OutFile $Destination
}

function Get-ArchiveRoot {
    param([string]$ExtractDir)
    $roots = @(Get-ChildItem -Path $ExtractDir -Directory)
    if ($roots.Count -ne 1) { throw "Could not find a single extracted repository root in $ExtractDir" }
    return $roots[0].FullName
}

function Get-SkillSources {
    param([string]$RepoRoot, [string]$SkillName)
    $skillsRoot = Join-Path $RepoRoot "skills"
    if ($SkillName) {
        $skillPath = Join-Path $skillsRoot $SkillName
        if (-not (Test-Path (Join-Path $skillPath "SKILL.md"))) { $skillPath = Join-Path $RepoRoot $SkillName }
        if (-not (Test-Path (Join-Path $skillPath "SKILL.md"))) { throw "Skill not found in archive: $SkillName" }
        return @(Get-Item $skillPath)
    }
    $scanRoot = if (Test-Path $skillsRoot) { $skillsRoot } else { $RepoRoot }
    $skills = @(Get-ChildItem -Path $scanRoot -Directory |
        Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") } |
        Sort-Object Name)
    if ($skills.Count -eq 0) { throw "No Skill folders with SKILL.md were found in archive." }
    return $skills
}

function Get-AgentSources {
    param([string]$RepoRoot, [string]$Platform, [string]$OutputSuffix, [string]$AgentId)
    if ($Platform -notin @("codex", "claude", "cursor", "copilot", "opencode")) {
        throw "Unsupported Agent adapter platform: $Platform"
    }
    if (-not $OutputSuffix -or -not $OutputSuffix.StartsWith(".")) {
        throw "Invalid Agent output suffix for ${Platform}: $OutputSuffix"
    }
    $adapterRoot = Join-Path $RepoRoot "adapters\$Platform"

    if ($AgentId) {
        $sourcePath = Join-Path $adapterRoot "$AgentId$OutputSuffix"
        if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
            throw "Agent adapter not found in archive: $AgentId ($Platform)"
        }
        return ,@{
            Source = Get-Item -LiteralPath $sourcePath
            Id = $AgentId
            RuntimeName = $AgentId
            Platform = $Platform
            OutputSuffix = $OutputSuffix
        }
    }

    if (-not (Test-Path -LiteralPath $adapterRoot -PathType Container)) {
        throw "Agent adapter directory not found in archive: adapters/$Platform"
    }
    $sources = @(
        Get-ChildItem -LiteralPath $adapterRoot -File -Filter "*$OutputSuffix" |
            Sort-Object Name |
            ForEach-Object {
                $role = $_.Name.Substring(0, $_.Name.Length - $OutputSuffix.Length)
                @{
                    Source = $_
                    Id = $role
                    RuntimeName = $role
                    Platform = $Platform
                    OutputSuffix = $OutputSuffix
                }
            }
    )
    if ($sources.Count -eq 0) { throw "No Agent adapters were found for $Platform." }
    return $sources
}

function Test-TargetWithinRoot {
    param([string]$TargetPath, [string]$RootPath)
    $fullTarget = [System.IO.Path]::GetFullPath($TargetPath)
    $fullRoot = [System.IO.Path]::GetFullPath($RootPath).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
    return $fullTarget.StartsWith($fullRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
}

function Read-StrictUtf8Text {
    param([string]$Path, [string]$Label = "file", [switch]$AllowBom)
    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $offset = 0
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        if (-not $AllowBom) {
            throw "Refusing to rewrite BOM-prefixed $Label at $Path. Remove the BOM or merge the change manually."
        }
        $offset = 3
    }
    try {
        return [System.Text.UTF8Encoding]::new($false, $true).GetString($bytes, $offset, $bytes.Length - $offset)
    } catch [System.Text.DecoderFallbackException] {
        throw "Refusing to rewrite $Label at $Path because it is not valid UTF-8."
    }
}

function Get-ExistingMeta {
    param([string]$MetaPath)
    if (-not (Test-Path -LiteralPath $MetaPath -PathType Leaf)) { return $null }
    $metaItem = Get-Item -Force -LiteralPath $MetaPath
    if (($metaItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
        throw "Refusing to read linked Autoverse metadata: $MetaPath"
    }
    try {
        $text = Read-StrictUtf8Text -Path $MetaPath -Label "Autoverse metadata" -AllowBom
        $null = Assert-StrictJsonText -Text $text -Path $MetaPath
        $metadata = ConvertFrom-Json -InputObject $text
        if ($metadata -isnot [System.Management.Automation.PSCustomObject]) {
            throw "metadata root is not a JSON object"
        }
        foreach ($propertyName in @('source', 'repo', 'branch', 'component', 'name', 'target', 'agent', 'id', 'adapter', 'installedAt', 'updatedAt')) {
            $property = $metadata.PSObject.Properties | Where-Object { $_.Name -ceq $propertyName } | Select-Object -First 1
            if ($property -and $property.Value -isnot [string]) {
                throw "metadata property '$propertyName' is not a string"
            }
        }
        return $metadata
    } catch {
        if ($Force) { return $null }
        throw "Existing Autoverse metadata is invalid: $MetaPath ($($_.Exception.Message))"
    }
}

function Get-SkillFrontmatterValue {
    param([string]$SkillFile, [string]$FieldName)
    if (-not (Test-Path -LiteralPath $SkillFile -PathType Leaf)) { return $null }
    $text = Get-Content -Raw -LiteralPath $SkillFile
    $frontmatter = [regex]::Match($text, '\A---\r?\n(?<body>[\s\S]*?)\r?\n---')
    if (-not $frontmatter.Success) { return $null }
    $field = [regex]::Match($frontmatter.Groups['body'].Value, '(?m)^' + [regex]::Escape($FieldName) + ':\s*(?<value>.+?)\s*$')
    if (-not $field.Success) { return $null }
    return $field.Groups['value'].Value.Trim().Trim('"').Trim("'")
}

function Test-LegacySkillOwnership {
    param(
        [object]$ExistingMeta,
        [string]$ExistingSkillFile,
        [string]$IncomingSkillFile,
        [string]$RepoName,
        [string]$ExpectedName,
        [string]$ExpectedTarget
    )
    if (-not $ExistingMeta -or $ExistingMeta.repo -ne $RepoName) { return $false }
    if ($ExistingMeta.PSObject.Properties['component'] -or $ExistingMeta.PSObject.Properties['target']) { return $false }
    if ($ExistingMeta.name -ne $ExpectedName -or $ExistingMeta.agent -ne $ExpectedTarget) { return $false }
    $existingName = Get-SkillFrontmatterValue -SkillFile $ExistingSkillFile -FieldName 'name'
    $existingSource = Get-SkillFrontmatterValue -SkillFile $ExistingSkillFile -FieldName 'source'
    $existingLicense = Get-SkillFrontmatterValue -SkillFile $ExistingSkillFile -FieldName 'license'
    $incomingName = Get-SkillFrontmatterValue -SkillFile $IncomingSkillFile -FieldName 'name'
    $incomingSource = Get-SkillFrontmatterValue -SkillFile $IncomingSkillFile -FieldName 'source'
    $incomingReferenceSource = Get-SkillFrontmatterValue -SkillFile $IncomingSkillFile -FieldName 'reference-source'
    $incomingLicense = Get-SkillFrontmatterValue -SkillFile $IncomingSkillFile -FieldName 'license'
    $incomingPreviousLicense = Get-SkillFrontmatterValue -SkillFile $IncomingSkillFile -FieldName 'previous-license'
    $sourceMatches = $existingSource -eq $incomingSource -or ($incomingReferenceSource -and $existingSource -eq $incomingReferenceSource)
    $licenseMatches = $existingLicense -eq $incomingLicense -or ($incomingPreviousLicense -and $existingLicense -eq $incomingPreviousLicense)
    return $existingName -eq $ExpectedName `
        -and $incomingName -eq $ExpectedName `
        -and $existingSource `
        -and $sourceMatches `
        -and $existingLicense `
        -and $licenseMatches
}

function Get-InstallAction {
    param(
        [string]$TargetPath,
        [string]$MetaPath,
        [string]$Label,
        [string]$RepoName,
        [string]$ExpectedComponent,
        [string]$ExpectedName,
        [string]$ExpectedTarget,
        [string]$ExpectedId,
        [string]$ExpectedAdapter,
        [string[]]$LegacyTargets,
        [string]$LegacyIdentityPath,
        [string]$IncomingIdentityPath
    )
    $targetExists = Test-Path -LiteralPath $TargetPath
    $metaExists = Test-Path -LiteralPath $MetaPath -PathType Leaf
    if (-not $targetExists -and -not $metaExists) { return @{ Action = "install"; ExistingMeta = $null } }
    $existingMeta = Get-ExistingMeta -MetaPath $MetaPath
    $ownershipMatches = $existingMeta `
        -and $existingMeta.repo -eq $RepoName `
        -and $existingMeta.component -eq $ExpectedComponent `
        -and $existingMeta.name -eq $ExpectedName `
        -and $existingMeta.target -eq $ExpectedTarget
    if ($ExpectedComponent -eq 'agent') {
        $ownershipMatches = $ownershipMatches `
            -and $ExpectedId `
            -and $existingMeta.id -eq $ExpectedId `
            -and $ExpectedAdapter `
            -and $existingMeta.adapter -eq $ExpectedAdapter
    }
    if ($ownershipMatches) {
        $ownedAction = if ($targetExists) { "update" } else { "repair" }
        return @{ Action = $ownedAction; ExistingMeta = $existingMeta }
    }
    $legacyTargetMatches = $existingMeta `
        -and $existingMeta.repo -eq $RepoName `
        -and $existingMeta.component -eq $ExpectedComponent `
        -and $existingMeta.name -eq $ExpectedName `
        -and $LegacyTargets `
        -and $LegacyTargets -contains $existingMeta.target
    if ($ExpectedComponent -eq 'agent') {
        $legacyTargetMatches = $legacyTargetMatches `
            -and $ExpectedId `
            -and $existingMeta.id -eq $ExpectedId `
            -and $ExpectedAdapter `
            -and $existingMeta.adapter -eq $ExpectedAdapter
    }
    if ($legacyTargetMatches) {
        return @{ Action = "migrate-update"; ExistingMeta = $existingMeta }
    }
    if ($ExpectedComponent -eq 'skill' -and (Test-LegacySkillOwnership -ExistingMeta $existingMeta -ExistingSkillFile $LegacyIdentityPath -IncomingSkillFile $IncomingIdentityPath -RepoName $RepoName -ExpectedName $ExpectedName -ExpectedTarget $ExpectedTarget)) {
        return @{ Action = "migrate-update"; ExistingMeta = $existingMeta }
    }
    if ($Force) { return @{ Action = "force-replace"; ExistingMeta = $existingMeta } }
    if ($existingMeta -and $existingMeta.repo -and $existingMeta.repo -ne $RepoName) {
        throw "Refusing to replace '$Label' because it was installed from '$($existingMeta.repo)', not '$RepoName'. Use -Force to overwrite intentionally."
    }
    if ($existingMeta -and $existingMeta.repo -eq $RepoName) {
        $agentIdentity = if ($ExpectedComponent -eq 'agent') { ", id='$ExpectedId', and adapter='$ExpectedAdapter'" } else { "" }
        throw "Refusing to replace '$Label' because its ownership metadata does not match component='$ExpectedComponent', name='$ExpectedName', target='$ExpectedTarget'$agentIdentity. Use -Force to overwrite intentionally."
    }
    throw "Refusing to replace '$Label' because it has no matching Autoverse metadata. Use -Force to overwrite intentionally."
}

function Install-Skill {
    param([System.IO.DirectoryInfo]$Source, [string]$DestinationRoot, [string]$TargetName, [string[]]$LegacyTargets, [string]$RepoName, [string]$BranchName)
    $targetPath = Join-Path $DestinationRoot $Source.Name
    if (-not (Test-TargetWithinRoot -TargetPath $targetPath -RootPath $DestinationRoot)) { throw "Refusing to write outside install directory: $targetPath" }
    $metaPath = Join-Path $targetPath ".skill-meta.json"
    $plan = Get-InstallAction -TargetPath $targetPath -MetaPath $metaPath -Label $Source.Name -RepoName $RepoName -ExpectedComponent "skill" -ExpectedName $Source.Name -ExpectedTarget $TargetName -LegacyTargets $LegacyTargets -LegacyIdentityPath (Join-Path $targetPath "SKILL.md") -IncomingIdentityPath (Join-Path $Source.FullName "SKILL.md")
    if ($DryRun) { Write-Host "DRY-RUN $($plan.Action) Skill $($Source.Name) -> $targetPath"; return }

    New-Item -ItemType Directory -Force -Path $DestinationRoot | Out-Null
    if (Test-Path -LiteralPath $targetPath) { Remove-Item -Recurse -Force -LiteralPath $targetPath }
    Copy-Item -Recurse -Force -LiteralPath $Source.FullName -Destination $targetPath
    $now = (Get-Date).ToUniversalTime().ToString("o")
    $installedAt = if ($plan.ExistingMeta -and $plan.ExistingMeta.installedAt) { $plan.ExistingMeta.installedAt } else { $now }
    @{
        source = $script:SourceKind; repo = $RepoName; branch = $BranchName; component = "skill"
        name = $Source.Name; target = $TargetName; installedAt = $installedAt; updatedAt = $now
    } | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $metaPath -Encoding UTF8
    Write-Success "$($plan.Action) Skill $($Source.Name) -> $targetPath"
}

function Test-SkillInstall {
    param([System.IO.DirectoryInfo]$Source, [string]$DestinationRoot, [string]$TargetName, [string[]]$LegacyTargets, [string]$RepoName)
    $targetPath = Join-Path $DestinationRoot $Source.Name
    if (-not (Test-TargetWithinRoot -TargetPath $targetPath -RootPath $DestinationRoot)) { throw "Refusing to write outside install directory: $targetPath" }
    $metaPath = Join-Path $targetPath ".skill-meta.json"
    Get-InstallAction -TargetPath $targetPath -MetaPath $metaPath -Label $Source.Name -RepoName $RepoName -ExpectedComponent "skill" -ExpectedName $Source.Name -ExpectedTarget $TargetName -LegacyTargets $LegacyTargets -LegacyIdentityPath (Join-Path $targetPath "SKILL.md") -IncomingIdentityPath (Join-Path $Source.FullName "SKILL.md") | Out-Null
}

function Install-AtomicFile {
    param([string]$SourcePath, [string]$DestinationPath, [string]$Label)
    $parent = Split-Path -Parent $DestinationPath
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    $tempPath = Join-Path $parent (".autoverse-" + [Guid]::NewGuid().ToString('N') + ".tmp")
    $backupPath = Join-Path $parent (".autoverse-replaced-" + [Guid]::NewGuid().ToString('N') + ".bak")
    try {
        Copy-Item -LiteralPath $SourcePath -Destination $tempPath
        Assert-RegularInstallLeaf -Path $DestinationPath -Label $Label
        if (Test-Path -LiteralPath $DestinationPath -PathType Leaf) {
            [System.IO.File]::Replace($tempPath, $DestinationPath, $backupPath, $true)
            Remove-Item -Force -LiteralPath $backupPath -ErrorAction SilentlyContinue
        } else {
            [System.IO.File]::Move($tempPath, $DestinationPath)
        }
    } finally {
        if (Test-Path -LiteralPath $tempPath) { Remove-Item -Force -LiteralPath $tempPath }
    }
}

function Write-AtomicUtf8Text {
    param([string]$DestinationPath, [string]$Text, [string]$Label)
    $parent = Split-Path -Parent $DestinationPath
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    $tempPath = Join-Path $parent (".autoverse-" + [Guid]::NewGuid().ToString('N') + ".tmp")
    $backupPath = Join-Path $parent (".autoverse-replaced-" + [Guid]::NewGuid().ToString('N') + ".bak")
    try {
        [System.IO.File]::WriteAllText($tempPath, $Text, [System.Text.UTF8Encoding]::new($false))
        Assert-RegularInstallLeaf -Path $DestinationPath -Label $Label
        if (Test-Path -LiteralPath $DestinationPath -PathType Leaf) {
            [System.IO.File]::Replace($tempPath, $DestinationPath, $backupPath, $true)
            Remove-Item -Force -LiteralPath $backupPath -ErrorAction SilentlyContinue
        } else {
            [System.IO.File]::Move($tempPath, $DestinationPath)
        }
    } finally {
        if (Test-Path -LiteralPath $tempPath) { Remove-Item -Force -LiteralPath $tempPath }
    }
}

function Install-AgentProfile {
    param([System.IO.FileInfo]$Source, [string]$RuntimeName, [string]$AgentId, [string]$Platform, [string]$OutputSuffix, [string]$DestinationRoot, [string]$TargetName, [string[]]$LegacyTargets, [string]$RepoName, [string]$BranchName)
    $targetPath = Join-Path $DestinationRoot ($RuntimeName + $OutputSuffix)
    if (-not (Test-TargetWithinRoot -TargetPath $targetPath -RootPath $DestinationRoot)) { throw "Refusing to write outside install directory: $targetPath" }
    $metaPath = "$targetPath.autoverse.json"
    Assert-RegularInstallLeaf -Path $targetPath -Label "Agent"
    Assert-RegularInstallLeaf -Path $metaPath -Label "Agent metadata"
    $plan = Get-InstallAction -TargetPath $targetPath -MetaPath $metaPath -Label $AgentId -RepoName $RepoName -ExpectedComponent "agent" -ExpectedName $RuntimeName -ExpectedTarget $TargetName -ExpectedId $AgentId -ExpectedAdapter $Platform -LegacyTargets $LegacyTargets
    if ($DryRun) { Write-Host "DRY-RUN $($plan.Action) Agent $AgentId -> $targetPath"; return }

    $now = (Get-Date).ToUniversalTime().ToString("o")
    $installedAt = if ($plan.ExistingMeta -and $plan.ExistingMeta.installedAt) { $plan.ExistingMeta.installedAt } else { $now }
    $metadataText = @{
        source = $script:SourceKind; repo = $RepoName; branch = $BranchName; component = "agent"
        id = $AgentId; name = $RuntimeName; adapter = $Platform; target = $TargetName
        installedAt = $installedAt; updatedAt = $now
    } | ConvertTo-Json -Depth 3
    if (Test-Path -LiteralPath $targetPath -PathType Leaf) {
        Install-AtomicFile -SourcePath $Source.FullName -DestinationPath $targetPath -Label "Agent"
        Write-AtomicUtf8Text -DestinationPath $metaPath -Text ($metadataText + "`n") -Label "Agent metadata"
    } else {
        Write-AtomicUtf8Text -DestinationPath $metaPath -Text ($metadataText + "`n") -Label "Agent metadata"
        Install-AtomicFile -SourcePath $Source.FullName -DestinationPath $targetPath -Label "Agent"
    }
    Write-Success "$($plan.Action) Agent $AgentId -> $targetPath"
}

function Test-AgentProfileInstall {
    param([System.IO.FileInfo]$Source, [string]$RuntimeName, [string]$AgentId, [string]$Platform, [string]$OutputSuffix, [string]$DestinationRoot, [string]$TargetName, [string[]]$LegacyTargets, [string]$RepoName)
    $targetPath = Join-Path $DestinationRoot ($RuntimeName + $OutputSuffix)
    if (-not (Test-TargetWithinRoot -TargetPath $targetPath -RootPath $DestinationRoot)) { throw "Refusing to write outside install directory: $targetPath" }
    $metaPath = "$targetPath.autoverse.json"
    Assert-RegularInstallLeaf -Path $targetPath -Label "Agent"
    Assert-RegularInstallLeaf -Path $metaPath -Label "Agent metadata"
    Get-InstallAction -TargetPath $targetPath -MetaPath $metaPath -Label $AgentId -RepoName $RepoName -ExpectedComponent "agent" -ExpectedName $RuntimeName -ExpectedTarget $TargetName -ExpectedId $AgentId -ExpectedAdapter $Platform -LegacyTargets $LegacyTargets | Out-Null
}

function Get-AutoDelegationGuidance {
    param([string]$RepoRoot)
    $guidancePath = Join-Path $RepoRoot "skills\subagent-architecture\references\global-auto-delegation.md"
    if (-not (Test-Path -LiteralPath $guidancePath -PathType Leaf)) {
        throw "Auto-delegation guidance is missing from the archive: $guidancePath"
    }
    $guidance = [System.IO.File]::ReadAllText($guidancePath).Trim()
    if (-not $guidance) { throw "Auto-delegation guidance is empty: $guidancePath" }
    if ($guidance.Contains("'''")) { throw "Auto-delegation guidance cannot contain a TOML multiline literal delimiter." }
    return $guidance
}

function Assert-RegularInstallLeaf {
    param([string]$Path, [string]$Label)
    $item = Get-Item -Force -LiteralPath $Path -ErrorAction SilentlyContinue
    if (-not $item) { return }
    if ($item.PSIsContainer -or (($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0)) {
        throw "Refusing to replace a non-regular or linked $Label file: $Path"
    }
}

function Assert-RegularConfigFile {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return }
    $item = Get-Item -Force -LiteralPath $Path
    if ($item.PSIsContainer -or (($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0)) {
        throw "Refusing to replace a non-regular or linked config file: $Path"
    }
}

function Get-FileSha256 {
    param([string]$Path)
    $stream = [System.IO.File]::OpenRead($Path)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        return ([System.BitConverter]::ToString($sha.ComputeHash($stream))).Replace('-', '')
    } finally {
        $sha.Dispose()
        $stream.Dispose()
    }
}

function Assert-StrictJsonText {
    param([string]$Text, [string]$Path)
    $state = @{ Text = $Text; Index = 0; Length = $Text.Length }
    $layout = @{
        RootOpen = -1
        RootClose = -1
        InstructionsArrayStart = -1
        InstructionsArrayEnd = -1
        HasInstructions = $false
        Instructions = @()
    }

    function Throw-StrictJsonError {
        param([string]$Reason)
        throw "Refusing to rewrite OpenCode config because $Path is not strict JSON: $Reason"
    }

    function Skip-JsonWhitespace {
        while ($state.Index -lt $state.Length -and " `t`r`n".IndexOf($state.Text[$state.Index]) -ge 0) {
            $state.Index = $state.Index + 1
        }
    }

    function Read-JsonString {
        if ($state.Index -ge $state.Length -or $state.Text[$state.Index] -ne '"') {
            Throw-StrictJsonError "expected a string at offset $($state.Index)"
        }
        $start = $state.Index
        $state.Index = $state.Index + 1
        while ($state.Index -lt $state.Length) {
            $character = $state.Text[$state.Index]
            $codePoint = [int][char]$character
            $state.Index = $state.Index + 1
            if ($character -eq '"') {
                $token = $state.Text.Substring($start, $state.Index - $start)
                try { $value = ConvertFrom-Json -InputObject $token } catch {
                    Throw-StrictJsonError "invalid string at offset $start"
                }
                return @{ Type = "string"; Value = [string]$value; Start = $start; End = $state.Index }
            }
            if ($codePoint -lt 0x20) {
                Throw-StrictJsonError "unescaped control character in a string at offset $($state.Index - 1)"
            }
            if ($character -ne '\') { continue }
            if ($state.Index -ge $state.Length) { Throw-StrictJsonError "unfinished escape at offset $($state.Index - 1)" }
            $escape = $state.Text[$state.Index]
            $state.Index = $state.Index + 1
            if ('"\/bfnrt'.IndexOf($escape) -ge 0) { continue }
            if ($escape -ne 'u' -or $state.Index + 4 -gt $state.Length) {
                Throw-StrictJsonError "invalid escape at offset $($state.Index - 2)"
            }
            $hex = $state.Text.Substring($state.Index, 4)
            if ($hex -notmatch '\A[0-9A-Fa-f]{4}\z') {
                Throw-StrictJsonError "invalid Unicode escape at offset $($state.Index - 2)"
            }
            $state.Index = $state.Index + 4
        }
        Throw-StrictJsonError "unterminated string at offset $start"
    }

    function Read-JsonNumber {
        $start = $state.Index
        $match = [regex]::Match($state.Text.Substring($state.Index), '\A-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?')
        if (-not $match.Success) { Throw-StrictJsonError "invalid number at offset $start" }
        $state.Index = $state.Index + $match.Length
        if ($state.Index -lt $state.Length) {
            $next = $state.Text[$state.Index]
            if (" `t`r`n,]}".IndexOf($next) -lt 0) {
                Throw-StrictJsonError "invalid number terminator at offset $($state.Index)"
            }
        }
        return @{ Type = "number"; Start = $start; End = $state.Index }
    }

    function Read-JsonLiteral {
        param([string]$Literal, [string]$Type)
        $start = $state.Index
        if ($state.Index + $Literal.Length -gt $state.Length -or
            $state.Text.Substring($state.Index, $Literal.Length) -cne $Literal) {
            Throw-StrictJsonError "invalid $Type at offset $start"
        }
        $state.Index = $state.Index + $Literal.Length
        return @{ Type = $Type; Start = $start; End = $state.Index }
    }

    function Read-JsonArray {
        param([int]$Depth)
        $start = $state.Index
        $state.Index = $state.Index + 1
        $items = [System.Collections.ArrayList]::new()
        Skip-JsonWhitespace
        if ($state.Index -lt $state.Length -and $state.Text[$state.Index] -eq ']') {
            $state.Index = $state.Index + 1
            return @{ Type = "array"; Start = $start; End = $state.Index; Items = $items }
        }
        while ($true) {
            $item = Read-JsonValue -Depth ($Depth + 1)
            $null = $items.Add($item)
            Skip-JsonWhitespace
            if ($state.Index -lt $state.Length -and $state.Text[$state.Index] -eq ']') {
                $state.Index = $state.Index + 1
                return @{ Type = "array"; Start = $start; End = $state.Index; Items = $items }
            }
            if ($state.Index -ge $state.Length -or $state.Text[$state.Index] -ne ',') {
                Throw-StrictJsonError "expected a comma in an array at offset $($state.Index)"
            }
            $state.Index = $state.Index + 1
            Skip-JsonWhitespace
        }
    }

    function Read-JsonObject {
        param([int]$Depth)
        $start = $state.Index
        $state.Index = $state.Index + 1
        $keys = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
        Skip-JsonWhitespace
        if ($state.Index -lt $state.Length -and $state.Text[$state.Index] -eq '}') {
            $state.Index = $state.Index + 1
            if ($Depth -eq 0) { $layout.RootOpen = $start; $layout.RootClose = $state.Index - 1 }
            return @{ Type = "object"; Start = $start; End = $state.Index }
        }
        while ($true) {
            $keyNode = Read-JsonString
            $key = [string]$keyNode.Value
            if (-not $keys.Add($key)) { Throw-StrictJsonError "duplicate key '$key'" }
            if ($Depth -eq 0 -and [string]::Equals($key, "instructions", [System.StringComparison]::OrdinalIgnoreCase) -and
                -not [string]::Equals($key, "instructions", [System.StringComparison]::Ordinal)) {
                Throw-StrictJsonError "case-conflicting Instructions key"
            }
            Skip-JsonWhitespace
            if ($state.Index -ge $state.Length -or $state.Text[$state.Index] -ne ':') {
                Throw-StrictJsonError "expected a colon after key '$key'"
            }
            $state.Index = $state.Index + 1
            Skip-JsonWhitespace
            $value = Read-JsonValue -Depth ($Depth + 1)
            if ($Depth -eq 0) {
                $layout.RootOpen = $start
                if ([string]::Equals($key, "instructions", [System.StringComparison]::Ordinal)) {
                    if ($value.Type -ne "array") { Throw-StrictJsonError "instructions is not an array" }
                    $instructionValues = @()
                    foreach ($item in $value.Items) {
                        if ($item.Type -ne "string") { Throw-StrictJsonError "instructions contains a non-string value" }
                        $instructionValues += [string]$item.Value
                    }
                    $layout.HasInstructions = $true
                    $layout.Instructions = $instructionValues
                    $layout.InstructionsArrayStart = $value.Start
                    $layout.InstructionsArrayEnd = $value.End - 1
                }
            }
            Skip-JsonWhitespace
            if ($state.Index -lt $state.Length -and $state.Text[$state.Index] -eq '}') {
                $state.Index = $state.Index + 1
                if ($Depth -eq 0) { $layout.RootClose = $state.Index - 1 }
                return @{ Type = "object"; Start = $start; End = $state.Index }
            }
            if ($state.Index -ge $state.Length -or $state.Text[$state.Index] -ne ',') {
                Throw-StrictJsonError "expected a comma in an object at offset $($state.Index)"
            }
            $state.Index = $state.Index + 1
            Skip-JsonWhitespace
        }
    }

    function Read-JsonValue {
        param([int]$Depth)
        if ($state.Index -ge $state.Length) { Throw-StrictJsonError "unexpected end of input" }
        $character = $state.Text[$state.Index]
        if ($character -eq '{') { return (Read-JsonObject -Depth $Depth) }
        if ($character -eq '[') { return (Read-JsonArray -Depth $Depth) }
        if ($character -eq '"') { return (Read-JsonString) }
        if ($character -eq 't') { return (Read-JsonLiteral -Literal "true" -Type "boolean") }
        if ($character -eq 'f') { return (Read-JsonLiteral -Literal "false" -Type "boolean") }
        if ($character -eq 'n') { return (Read-JsonLiteral -Literal "null" -Type "null") }
        if ($character -eq '-' -or [char]::IsDigit($character)) { return (Read-JsonNumber) }
        Throw-StrictJsonError "invalid value at offset $($state.Index)"
    }

    Skip-JsonWhitespace
    $root = Read-JsonValue -Depth 0
    Skip-JsonWhitespace
    if ($root.Type -ne "object") { Throw-StrictJsonError "root value is not an object" }
    if ($state.Index -ne $state.Length) { Throw-StrictJsonError "unexpected content at offset $($state.Index)" }
    return $layout
}

function Add-OpenCodeInstructionToJsonText {
    param([string]$Text, [hashtable]$Layout, [string]$InstructionPath, [int]$ExistingInstructionCount)
    $newLine = if ($Text.Contains("`r`n")) { "`r`n" } else { "`n" }
    $encodedPath = $InstructionPath | ConvertTo-Json -Compress
    if ($Layout.InstructionsArrayStart -ge 0) {
        if ($Layout.InstructionsArrayEnd -lt 0) { throw "Could not locate the end of the OpenCode instructions array." }
        $index = $Layout.InstructionsArrayEnd
        $separator = if ($ExistingInstructionCount -gt 0) { "," } else { "" }
        $insert = $separator + $newLine + "    " + $encodedPath + $newLine + "  "
        return $Text.Substring(0, $index) + $insert + $Text.Substring($index)
    }
    if ($Layout.RootOpen -lt 0 -or $Layout.RootClose -lt 0) { throw "OpenCode config must contain a JSON object." }
    $last = $Layout.RootClose - 1
    while ($last -gt $Layout.RootOpen -and [char]::IsWhiteSpace($Text[$last])) { $last-- }
    $hasProperties = $last -gt $Layout.RootOpen
    $index = $last + 1
    $separator = if ($hasProperties) { "," } else { "" }
    $insert = $separator + $newLine + "  `"instructions`": [" + $newLine + "    " + $encodedPath + $newLine + "  ]"
    return $Text.Substring(0, $index) + $insert + $Text.Substring($index)
}

function Test-CodexDeveloperInstructionsConflict {
    param([string]$Text)
    $assignmentOrDottedKey = '(?m)^\s*(?:developer_instructions|"developer_instructions"|''developer_instructions'')(?:\s*=|\s*\.)'
    $tableHeader = '(?m)^\s*\[{1,2}\s*(?:developer_instructions|"developer_instructions"|''developer_instructions'')(?:\s*\.|\s*\])'
    if ([regex]::IsMatch($Text, $assignmentOrDottedKey) -or [regex]::IsMatch($Text, $tableHeader)) { return $true }

    $quotedKeyPatterns = @(
        '(?m)^\s*(?<key>"(?:\\.|[^"\\\r\n])*")\s*(?:=|\.)',
        '(?m)^\s*\[{1,2}\s*(?<key>"(?:\\.|[^"\\\r\n])*")\s*(?:\.|\])'
    )
    foreach ($pattern in $quotedKeyPatterns) {
        foreach ($match in [regex]::Matches($Text, $pattern)) {
            $body = $match.Groups['key'].Value.Substring(1, $match.Groups['key'].Value.Length - 2)
            try {
                $decoded = [regex]::Replace($body, '\\u(?<short>[0-9A-Fa-f]{4})|\\U(?<long>[0-9A-Fa-f]{8})', {
                    param($unicodeMatch)
                    $hex = if ($unicodeMatch.Groups['short'].Success) { $unicodeMatch.Groups['short'].Value } else { $unicodeMatch.Groups['long'].Value }
                    return [char]::ConvertFromUtf32([Convert]::ToInt32($hex, 16))
                })
                $decoded = $decoded.Replace('\"', '"').Replace('\\', '\')
                if ([string]::Equals($decoded, 'developer_instructions', [System.StringComparison]::Ordinal)) { return $true }
            } catch {
                continue
            }
        }
    }
    return $false
}

function Get-CodexAutoDelegationPlan {
    param([string]$Guidance)
    $configPath = Join-Path (Get-CodexHome) "config.toml"
    Assert-RegularConfigFile -Path $configPath
    $exists = Test-Path -LiteralPath $configPath -PathType Leaf
    $originalHash = if ($exists) { Get-FileSha256 -Path $configPath } else { $null }
    $text = if ($exists) { Read-StrictUtf8Text -Path $configPath -Label "Codex config" } else { "" }
    if ($exists -and (Get-FileSha256 -Path $configPath) -cne $originalHash) {
        throw "Refusing to edit $configPath because it changed during installation planning. Run the installer again."
    }
    $startPattern = '(?m)^# AUTOVERSE_AUTO_DELEGATION_START\s*$'
    $endPattern = '(?m)^# AUTOVERSE_AUTO_DELEGATION_END\s*$'
    $startCount = [regex]::Matches($text, $startPattern).Count
    $endCount = [regex]::Matches($text, $endPattern).Count
    if ($startCount -ne $endCount -or $startCount -gt 1) {
        throw "Refusing to edit $configPath because its Autoverse auto-delegation markers are incomplete or duplicated."
    }
    if ($startCount -eq 1 -and -not [regex]::IsMatch($text, '\A# AUTOVERSE_AUTO_DELEGATION_START\s*\r?\n')) {
        throw "Refusing to edit $configPath because the Autoverse marker is not a managed block at the start of the file."
    }

    $newLine = if ($text.Contains("`r`n")) { "`r`n" } else { "`n" }
    $normalizedGuidance = [regex]::Replace($Guidance, '\r?\n', $newLine)
    $block = @(
        "# AUTOVERSE_AUTO_DELEGATION_START",
        "developer_instructions = '''",
        $normalizedGuidance,
        "'''",
        "# AUTOVERSE_AUTO_DELEGATION_END"
    ) -join $newLine

    if ($startCount -eq 1) {
        $managedPattern = "(?s)\A# AUTOVERSE_AUTO_DELEGATION_START[^\S\r\n]*\r?\ndeveloper_instructions = '''\r?\n.*?\r?\n'''\r?\n# AUTOVERSE_AUTO_DELEGATION_END[^\S\r\n]*(?:\r?\n)?"
        $managedMatch = [regex]::Match($text, $managedPattern)
        if (-not $managedMatch.Success) {
            throw "Refusing to edit $configPath because its Autoverse managed block has an unexpected structure."
        }
        $remainder = $text.Substring($managedMatch.Length)
        if (Test-CodexDeveloperInstructionsConflict -Text $remainder) {
            throw "Refusing to edit $configPath because it also defines developer_instructions outside the Autoverse managed block. Merge the guidance manually."
        }
        $newText = $block + $newLine + $remainder
    } else {
        if (Test-CodexDeveloperInstructionsConflict -Text $text) {
            throw "Refusing to edit $configPath because it already defines developer_instructions outside the Autoverse managed block. Merge the guidance manually."
        }
        $newText = if ($text) { $block + $newLine + $newLine + $text } else { $block + $newLine }
    }

    return @{
        Runtime = "Codex"
        ConfigPath = $configPath
        Existing = $exists
        OriginalHash = $originalHash
        Action = if ($newText -ceq $text) { "unchanged" } elseif ($exists) { "update" } else { "install" }
        NewText = $newText
    }
}

function Get-OpenCodeAutoDelegationPlan {
    param([string]$InstructionPath)
    $configRoot = Get-OpenCodeConfigRoot
    $jsonPath = Join-Path $configRoot "opencode.json"
    $jsoncPath = Join-Path $configRoot "opencode.jsonc"
    Assert-RegularConfigFile -Path $jsonPath
    Assert-RegularConfigFile -Path $jsoncPath
    $hasJson = Test-Path -LiteralPath $jsonPath -PathType Leaf
    $hasJsonc = Test-Path -LiteralPath $jsoncPath -PathType Leaf
    if ($hasJson -and $hasJsonc) {
        throw "Refusing to edit OpenCode config because both opencode.json and opencode.jsonc exist in $configRoot. Add the Autoverse instruction path manually."
    }
    if ($hasJsonc) {
        throw "Refusing to rewrite JSONC config $jsoncPath. Add '$InstructionPath' to its instructions array manually."
    }

    $portableInstructionPath = [System.IO.Path]::GetFullPath($InstructionPath).Replace('\', '/')
    if (-not $hasJson) {
        $newConfig = [ordered]@{
            '$schema' = 'https://opencode.ai/config.json'
            instructions = @($portableInstructionPath)
        }
        return @{
            Runtime = "OpenCode"
            ConfigPath = $jsonPath
            SiblingConfigPath = $jsoncPath
            Existing = $false
            OriginalHash = $null
            Action = "install"
            NewText = ($newConfig | ConvertTo-Json -Depth 20) + "`n"
        }
    }

    $originalHash = Get-FileSha256 -Path $jsonPath
    $text = Read-StrictUtf8Text -Path $jsonPath -Label "OpenCode config"
    if ((Get-FileSha256 -Path $jsonPath) -cne $originalHash) {
        throw "Refusing to edit $jsonPath because it changed during installation planning. Run the installer again."
    }
    $layout = Assert-StrictJsonText -Text $text -Path $jsonPath
    $instructions = @($layout.Instructions)
    if ($instructions | Where-Object { $_.Replace('\', '/') -ieq $portableInstructionPath }) {
        return @{ Runtime = "OpenCode"; ConfigPath = $jsonPath; SiblingConfigPath = $jsoncPath; Existing = $true; OriginalHash = $originalHash; Action = "unchanged"; NewText = $text }
    }
    $instructionCount = $instructions.Count
    $newText = Add-OpenCodeInstructionToJsonText -Text $text -Layout $layout -InstructionPath $portableInstructionPath -ExistingInstructionCount $instructionCount
    return @{
        Runtime = "OpenCode"
        ConfigPath = $jsonPath
        SiblingConfigPath = $jsoncPath
        Existing = $true
        OriginalHash = $originalHash
        Action = "update"
        NewText = $newText
    }
}

function Invoke-AutoDelegationPlan {
    param([hashtable]$Plan)
    if ($Plan.SiblingConfigPath -and (Test-Path -LiteralPath $Plan.SiblingConfigPath)) {
        throw "Refusing to apply OpenCode auto-delegation because a sibling config appeared: $($Plan.SiblingConfigPath)"
    }
    if ($Plan.Action -eq "unchanged") {
        if ($Plan.Existing) {
            Assert-RegularConfigFile -Path $Plan.ConfigPath
            if (-not (Test-Path -LiteralPath $Plan.ConfigPath -PathType Leaf) -or (Get-FileSha256 -Path $Plan.ConfigPath) -cne $Plan.OriginalHash) {
                throw "Refusing to confirm $($Plan.ConfigPath) because it changed after installation planning. Run the installer again."
            }
        } elseif (Test-Path -LiteralPath $Plan.ConfigPath) {
            throw "Refusing to confirm $($Plan.ConfigPath) because it appeared after installation planning. Run the installer again."
        }
        Write-Success "Auto-delegation already enabled for $($Plan.Runtime): $($Plan.ConfigPath)"
        return
    }
    if ($DryRun) {
        Write-Host "DRY-RUN $($Plan.Action) $($Plan.Runtime) auto-delegation -> $($Plan.ConfigPath)"
        return
    }

    if ($Plan.Existing) {
        Assert-RegularConfigFile -Path $Plan.ConfigPath
        if (-not (Test-Path -LiteralPath $Plan.ConfigPath -PathType Leaf) -or (Get-FileSha256 -Path $Plan.ConfigPath) -cne $Plan.OriginalHash) {
            throw "Refusing to replace $($Plan.ConfigPath) because it changed after installation planning. Run the installer again."
        }
    } elseif (Test-Path -LiteralPath $Plan.ConfigPath) {
        throw "Refusing to create $($Plan.ConfigPath) because it appeared after installation planning. Run the installer again."
    }
    if ($Plan.SiblingConfigPath -and (Test-Path -LiteralPath $Plan.SiblingConfigPath)) {
        throw "Refusing to apply OpenCode auto-delegation because a sibling config appeared: $($Plan.SiblingConfigPath)"
    }

    $parent = Split-Path -Parent $Plan.ConfigPath
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    $tempPath = "$($Plan.ConfigPath).autoverse-$([Guid]::NewGuid().ToString('N')).tmp"
    try {
        [System.IO.File]::WriteAllText($tempPath, $Plan.NewText, [System.Text.UTF8Encoding]::new($false))
        if ($Plan.Existing) {
            Assert-RegularConfigFile -Path $Plan.ConfigPath
            if (-not (Test-Path -LiteralPath $Plan.ConfigPath -PathType Leaf) -or (Get-FileSha256 -Path $Plan.ConfigPath) -cne $Plan.OriginalHash) {
                throw "Refusing to replace $($Plan.ConfigPath) because it changed after installation planning. Run the installer again."
            }
            if ($Plan.SiblingConfigPath -and (Test-Path -LiteralPath $Plan.SiblingConfigPath)) {
                throw "Refusing to apply OpenCode auto-delegation because a sibling config appeared: $($Plan.SiblingConfigPath)"
            }
            $backupPath = "$($Plan.ConfigPath).autoverse-backup-$((Get-Date).ToUniversalTime().ToString('yyyyMMddHHmmssfff'))-$([Guid]::NewGuid().ToString('N'))"
            [System.IO.File]::Replace($tempPath, $Plan.ConfigPath, $backupPath, $true)
            if ((Get-FileSha256 -Path $backupPath) -cne $Plan.OriginalHash) {
                $rejectedPath = "$($Plan.ConfigPath).autoverse-rejected-$([Guid]::NewGuid().ToString('N')).tmp"
                [System.IO.File]::Replace($backupPath, $Plan.ConfigPath, $rejectedPath, $true)
                Remove-Item -Force -LiteralPath $rejectedPath -ErrorAction SilentlyContinue
                throw "Refusing to keep the new $($Plan.Runtime) config because the destination changed during atomic replacement. The concurrent version was restored."
            }
            Write-Info "Backup: $backupPath"
        } else {
            if (Test-Path -LiteralPath $Plan.ConfigPath) {
                throw "Refusing to create $($Plan.ConfigPath) because it appeared after installation planning. Run the installer again."
            }
            if ($Plan.SiblingConfigPath -and (Test-Path -LiteralPath $Plan.SiblingConfigPath)) {
                throw "Refusing to apply OpenCode auto-delegation because a sibling config appeared: $($Plan.SiblingConfigPath)"
            }
            [System.IO.File]::Move($tempPath, $Plan.ConfigPath)
        }
    } finally {
        if (Test-Path -LiteralPath $tempPath) { Remove-Item -Force -LiteralPath $tempPath }
    }
    Write-Success "$($Plan.Action) $($Plan.Runtime) auto-delegation -> $($Plan.ConfigPath)"
}

try {
    if (-not $Target) { Show-Usage; throw "Target is required." }
    $Target = Resolve-TargetName -TargetName $Target -ComponentType $Type
    if ($EnableAutoDelegation -and $Type -ne "agent") {
        throw "EnableAutoDelegation is only supported with -Type agent."
    }
    if ($EnableAutoDelegation -and $Target -notin @("codex", "opencode")) {
        throw "EnableAutoDelegation only supports the global Agent targets 'codex' and 'opencode'."
    }
    Test-ComponentName -ComponentType $Type -ComponentName $Name
    $tempRoot = $null
    $script:SourceKind = if ($SourceDir) { "local-checkout" } else { "github-archive" }

    try {
        if ($SourceDir) {
            $repoRoot = (Resolve-Path -LiteralPath $SourceDir).Path
        } else {
            $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "autoverse-$Type-$([Guid]::NewGuid().ToString('N'))"
            $archivePath = Join-Path $tempRoot "repo.zip"
            $extractDir = Join-Path $tempRoot "repo"
            New-Item -ItemType Directory -Force -Path $tempRoot, $extractDir | Out-Null
            Invoke-DownloadArchive -RepoName $Repo -BranchName $Branch -Destination $archivePath
            Expand-Archive -Path $archivePath -DestinationPath $extractDir -Force
            $repoRoot = Get-ArchiveRoot $extractDir
        }
        if ($Type -eq "agent") {
            $agentProfiles = @(Get-AgentInstallProfiles -TargetName $Target -RequestedInstallDir $InstallDir)
            foreach ($profile in $agentProfiles) {
                Write-Info "Agent destination ($($profile.Platform)): $($profile.DestinationRoot)"
            }

            # Build and preflight the complete cross-profile plan before any writes occur.
            $agentPlans = @()
            foreach ($profile in $agentProfiles) {
                $profileSources = @(Get-AgentSources -RepoRoot $repoRoot -Platform $profile.Platform -OutputSuffix $profile.OutputSuffix -AgentId $Name)
                foreach ($agentSource in $profileSources) {
                    Test-AgentProfileInstall -Source $agentSource.Source -RuntimeName $agentSource.RuntimeName -AgentId $agentSource.Id -Platform $agentSource.Platform -OutputSuffix $agentSource.OutputSuffix -DestinationRoot $profile.DestinationRoot -TargetName $profile.TargetName -LegacyTargets $profile.LegacyTargets -RepoName $Repo
                    $agentPlans += @{ Source = $agentSource; Profile = $profile }
                }
            }

            $installCompanionSkill = (-not $Name) -or $EnableAutoDelegation
            $companionSource = $null
            $companionProfiles = @()
            if ($installCompanionSkill) {
                $companionSource = @(Get-SkillSources -RepoRoot $repoRoot -SkillName "subagent-architecture")[0]
                $companionInstallDir = if ($Target -eq "project") { $InstallDir } else { $null }
                $companionProfiles = @(Get-SkillInstallProfiles -TargetName $Target -ComponentName "subagent-architecture" -RequestedInstallDir $companionInstallDir -RepoName $Repo -IncomingSkillFile (Join-Path $companionSource.FullName "SKILL.md"))
                foreach ($profile in $companionProfiles) {
                    Test-SkillInstall -Source $companionSource -DestinationRoot $profile.DestinationRoot -TargetName $profile.TargetName -LegacyTargets $profile.LegacyTargets -RepoName $Repo
                    Write-Info "Companion Skill destination: $($profile.DestinationRoot)"
                }
            }

            $autoDelegationPlan = $null
            if ($EnableAutoDelegation) {
                $guidance = Get-AutoDelegationGuidance -RepoRoot $repoRoot
                if ($Target -eq "codex") {
                    $autoDelegationPlan = Get-CodexAutoDelegationPlan -Guidance $guidance
                } else {
                    $instructionPath = Join-Path $companionProfiles[0].DestinationRoot "subagent-architecture\references\global-auto-delegation.md"
                    $autoDelegationPlan = Get-OpenCodeAutoDelegationPlan -InstructionPath $instructionPath
                }
            }

            if ($installCompanionSkill) {
                foreach ($profile in $companionProfiles) {
                    Install-Skill -Source $companionSource -DestinationRoot $profile.DestinationRoot -TargetName $profile.TargetName -LegacyTargets $profile.LegacyTargets -RepoName $Repo -BranchName $Branch
                }
            }
            Write-Info "$(if ($DryRun) { 'Planning' } else { 'Installing' }) $($agentPlans.Count) Agent profile(s) for $Target"
            foreach ($agentPlan in $agentPlans) {
                $agentSource = $agentPlan.Source
                $profile = $agentPlan.Profile
                Install-AgentProfile -Source $agentSource.Source -RuntimeName $agentSource.RuntimeName -AgentId $agentSource.Id -Platform $agentSource.Platform -OutputSuffix $agentSource.OutputSuffix -DestinationRoot $profile.DestinationRoot -TargetName $profile.TargetName -LegacyTargets $profile.LegacyTargets -RepoName $Repo -BranchName $Branch
            }
            if ($autoDelegationPlan) { Invoke-AutoDelegationPlan -Plan $autoDelegationPlan }
        } else {
            $sources = @(Get-SkillSources -RepoRoot $repoRoot -SkillName $Name)
            $skillPlans = @()
            foreach ($source in $sources) {
                $sourceProfiles = @(Get-SkillInstallProfiles -TargetName $Target -ComponentName $source.Name -RequestedInstallDir $InstallDir -RepoName $Repo -IncomingSkillFile (Join-Path $source.FullName "SKILL.md"))
                foreach ($profile in $sourceProfiles) {
                    $skillPlans += @{ Source = $source; Profile = $profile }
                }
            }
            @($skillPlans | ForEach-Object { $_.Profile.DestinationRoot } | Sort-Object -Unique) |
                ForEach-Object { Write-Info "Skill destination: $_" }
            foreach ($skillPlan in $skillPlans) {
                $source = $skillPlan.Source
                $profile = $skillPlan.Profile
                Test-SkillInstall -Source $source -DestinationRoot $profile.DestinationRoot -TargetName $profile.TargetName -LegacyTargets $profile.LegacyTargets -RepoName $Repo
            }
            Write-Info "$(if ($DryRun) { 'Planning' } else { 'Installing' }) $($skillPlans.Count) Skill profile(s) for $Target"
            foreach ($skillPlan in $skillPlans) {
                $source = $skillPlan.Source
                $profile = $skillPlan.Profile
                Install-Skill -Source $source -DestinationRoot $profile.DestinationRoot -TargetName $profile.TargetName -LegacyTargets $profile.LegacyTargets -RepoName $Repo -BranchName $Branch
            }
        }

        if ($DryRun) { Write-Success "Dry run complete." } else { Write-Success "Autoverse $Type install complete." }
    } finally {
        if ($tempRoot -and (Test-Path -LiteralPath $tempRoot)) { Remove-Item -Recurse -Force -LiteralPath $tempRoot }
    }
} catch {
    Write-Fail $_.Exception.Message
    exit 1
}
