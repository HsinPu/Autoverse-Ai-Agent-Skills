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
  .\scripts\install.ps1 -Target <target> -Type agent -Name <plugin/role> [-InstallDir path] [-DryRun] [-Force]

Compatibility aliases:
  -Agent is an alias for -Target; -Skill is an alias for -Name.
  -SourceDir installs from a local checkout; otherwise the requested GitHub repo and branch are downloaded.

Skill targets:
  claude, cursor, codex, amp, vscode, copilot, project, goose, opencode,
  opencode-project, letta, gemini

Agent targets:
  codex, codex-project, claude, claude-project

Examples:
  .\scripts\install.ps1 -Target codex -Name python-development
  .\scripts\install.ps1 -Agent codex -Skill python-development
  .\scripts\install.ps1 -Target codex -Type agent -Name comprehensive-review/code-reviewer
  .\scripts\install.ps1 -Target claude-project -Type agent -Name incident-response/debugger -DryRun

Safety:
  Existing components are updated only when Autoverse metadata identifies the same repo.
  Unknown same-named content is blocked unless -Force is provided.
"@
}

function Get-HomeDir {
    if ($env:USERPROFILE) { return $env:USERPROFILE }
    return [Environment]::GetFolderPath("UserProfile")
}

function Resolve-InstallPath {
    param([string]$TargetName, [string]$ComponentType)
    $homeDir = Get-HomeDir
    $cwd = (Get-Location).Path

    if ($ComponentType -eq "agent") {
        switch ($TargetName.ToLowerInvariant()) {
            "codex" { return Join-Path $homeDir ".codex\agents" }
            "codex-project" { return Join-Path $cwd ".codex\agents" }
            "claude" { return Join-Path $homeDir ".claude\agents" }
            "claude-project" { return Join-Path $cwd ".claude\agents" }
            default { throw "Unsupported Agent target: $TargetName" }
        }
    }

    switch ($TargetName.ToLowerInvariant()) {
        "claude" { return Join-Path $homeDir ".claude\skills" }
        "cursor" { return Join-Path $cwd ".cursor\skills" }
        "codex" { return Join-Path $homeDir ".codex\skills" }
        "amp" { return Join-Path $homeDir ".amp\skills" }
        "vscode" { return Join-Path $cwd ".github\skills" }
        "copilot" { return Join-Path $cwd ".github\skills" }
        "project" { return Join-Path $cwd ".skills" }
        "goose" { return Join-Path $homeDir ".config\goose\skills" }
        "opencode" { return Join-Path $homeDir ".config\opencode\skills" }
        "opencode-project" { return Join-Path $cwd ".opencode\skills" }
        "letta" { return Join-Path $homeDir ".letta\skills" }
        "gemini" { return Join-Path $homeDir ".gemini\skills" }
        default { throw "Unsupported Skill target: $TargetName" }
    }
}

function Test-ComponentName {
    param([string]$ComponentType, [string]$ComponentName)
    if ($ComponentType -eq "agent") {
        if (-not $ComponentName) { throw "Agent Name is required and must use plugin/role." }
        if ($ComponentName -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*/[a-z0-9]+(?:-[a-z0-9]+)*$') {
            throw "Invalid Agent Name '$ComponentName'. Expected plugin/role in lowercase hyphen-case."
        }
        return
    }
    if (-not $ComponentName) { return }
    if ($ComponentName -eq "." -or $ComponentName -eq ".." -or $ComponentName.Contains("/") -or $ComponentName.Contains("\")) {
        throw "Invalid Skill Name: $ComponentName"
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

function Get-AgentSource {
    param([string]$RepoRoot, [string]$TargetName, [string]$AgentId)
    $parts = $AgentId.Split('/')
    $plugin = $parts[0]
    $role = $parts[1]
    $platform = if ($TargetName.ToLowerInvariant().StartsWith("codex")) { "codex" } else { "claude" }
    $extension = if ($platform -eq "codex") { ".toml" } else { ".md" }
    $sourcePath = Join-Path $RepoRoot "adapters\$platform\$plugin\$role$extension"
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
        throw "Agent adapter not found in archive: $AgentId ($platform)"
    }
    return @{
        Source = Get-Item -LiteralPath $sourcePath
        RuntimeName = "$plugin-$role"
        Platform = $platform
    }
}

function Test-TargetWithinRoot {
    param([string]$TargetPath, [string]$RootPath)
    $fullTarget = [System.IO.Path]::GetFullPath($TargetPath)
    $fullRoot = [System.IO.Path]::GetFullPath($RootPath).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
    return $fullTarget.StartsWith($fullRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
}

function Get-ExistingMeta {
    param([string]$MetaPath)
    if (-not (Test-Path -LiteralPath $MetaPath -PathType Leaf)) { return $null }
    try { return Get-Content -Raw -LiteralPath $MetaPath | ConvertFrom-Json } catch {
        if ($Force) { return $null }
        throw "Existing Autoverse metadata is invalid: $MetaPath"
    }
}

function Get-InstallAction {
    param([string]$TargetPath, [string]$MetaPath, [string]$Label, [string]$RepoName)
    if (-not (Test-Path -LiteralPath $TargetPath)) { return @{ Action = "install"; ExistingMeta = $null } }
    $existingMeta = Get-ExistingMeta -MetaPath $MetaPath
    if ($existingMeta -and $existingMeta.repo -eq $RepoName) {
        return @{ Action = "update"; ExistingMeta = $existingMeta }
    }
    if ($Force) { return @{ Action = "force-replace"; ExistingMeta = $existingMeta } }
    if ($existingMeta -and $existingMeta.repo) {
        throw "Refusing to replace '$Label' because it was installed from '$($existingMeta.repo)', not '$RepoName'. Use -Force to overwrite intentionally."
    }
    throw "Refusing to replace '$Label' because it has no matching Autoverse metadata. Use -Force to overwrite intentionally."
}

function Install-Skill {
    param([System.IO.DirectoryInfo]$Source, [string]$DestinationRoot, [string]$TargetName, [string]$RepoName, [string]$BranchName)
    $targetPath = Join-Path $DestinationRoot $Source.Name
    if (-not (Test-TargetWithinRoot -TargetPath $targetPath -RootPath $DestinationRoot)) { throw "Refusing to write outside install directory: $targetPath" }
    $metaPath = Join-Path $targetPath ".skill-meta.json"
    $plan = Get-InstallAction -TargetPath $targetPath -MetaPath $metaPath -Label $Source.Name -RepoName $RepoName
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

function Install-AgentProfile {
    param([System.IO.FileInfo]$Source, [string]$RuntimeName, [string]$AgentId, [string]$Platform, [string]$DestinationRoot, [string]$TargetName, [string]$RepoName, [string]$BranchName)
    $targetPath = Join-Path $DestinationRoot ($RuntimeName + $Source.Extension)
    if (-not (Test-TargetWithinRoot -TargetPath $targetPath -RootPath $DestinationRoot)) { throw "Refusing to write outside install directory: $targetPath" }
    $metaPath = "$targetPath.autoverse.json"
    $plan = Get-InstallAction -TargetPath $targetPath -MetaPath $metaPath -Label $AgentId -RepoName $RepoName
    if ($DryRun) { Write-Host "DRY-RUN $($plan.Action) Agent $AgentId -> $targetPath"; return }

    New-Item -ItemType Directory -Force -Path $DestinationRoot | Out-Null
    Copy-Item -Force -LiteralPath $Source.FullName -Destination $targetPath
    $now = (Get-Date).ToUniversalTime().ToString("o")
    $installedAt = if ($plan.ExistingMeta -and $plan.ExistingMeta.installedAt) { $plan.ExistingMeta.installedAt } else { $now }
    @{
        source = $script:SourceKind; repo = $RepoName; branch = $BranchName; component = "agent"
        id = $AgentId; name = $RuntimeName; adapter = $Platform; target = $TargetName
        installedAt = $installedAt; updatedAt = $now
    } | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $metaPath -Encoding UTF8
    Write-Success "$($plan.Action) Agent $AgentId -> $targetPath"
}

try {
    if (-not $Target) { Show-Usage; throw "Target is required." }
    Test-ComponentName -ComponentType $Type -ComponentName $Name
    $destinationRoot = if ($InstallDir) { $InstallDir } else { Resolve-InstallPath -TargetName $Target -ComponentType $Type }
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
        Write-Info "Destination: $destinationRoot"

        if ($Type -eq "agent") {
            $agentSource = Get-AgentSource -RepoRoot $repoRoot -TargetName $Target -AgentId $Name
            Install-AgentProfile -Source $agentSource.Source -RuntimeName $agentSource.RuntimeName -AgentId $Name -Platform $agentSource.Platform -DestinationRoot $destinationRoot -TargetName $Target -RepoName $Repo -BranchName $Branch
        } else {
            $sources = Get-SkillSources -RepoRoot $repoRoot -SkillName $Name
            Write-Info "$(if ($DryRun) { 'Planning' } else { 'Installing' }) $($sources.Count) Skill(s) for $Target"
            foreach ($source in $sources) {
                Install-Skill -Source $source -DestinationRoot $destinationRoot -TargetName $Target -RepoName $Repo -BranchName $Branch
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
