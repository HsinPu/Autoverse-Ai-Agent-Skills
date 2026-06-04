# Autoverse AI Agent Skills installer for Windows.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex'
#   .\scripts\install.ps1 -Agent codex -Skill python-development
#   .\scripts\install.ps1 -Agent project -DryRun
#   .\scripts\install.ps1 -Agent project -Skill python-development -Force

param(
    [string]$Agent,
    [string]$Skill,
    [string]$Branch = "main",
    [string]$Repo = "HsinPu/Autoverse-Ai-Agent-Skills",
    [string]$InstallDir,
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

try {
    [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
} catch {
}

function Write-Info {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "OK  $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "!   $Message" -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    Write-Host "Error: $Message" -ForegroundColor Red
}

function Show-Usage {
    Write-Host @"
Autoverse AI Agent Skills installer

Usage:
  .\scripts\install.ps1 -Agent <agent> [-Skill <skill>] [-Branch main] [-Repo owner/repo] [-InstallDir path] [-DryRun] [-Force]

Agents:
  claude, cursor, codex, amp, vscode, copilot, project, goose, opencode, opencode-project, letta, gemini

Examples:
  .\scripts\install.ps1 -Agent codex
  .\scripts\install.ps1 -Agent codex -Skill python-development
  .\scripts\install.ps1 -Agent project -DryRun
  .\scripts\install.ps1 -Agent project -Skill python-development -Force

Safety:
  Existing skill folders are updated only when .skill-meta.json shows the same repo.
  Unknown same-named folders are blocked unless -Force is provided.
"@
}

function Get-HomeDir {
    if ($env:USERPROFILE) { return $env:USERPROFILE }
    return [Environment]::GetFolderPath("UserProfile")
}

function Resolve-AgentPath {
    param([string]$Name)

    $homeDir = Get-HomeDir
    $cwd = (Get-Location).Path

    switch ($Name.ToLowerInvariant()) {
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
        default { throw "Unsupported agent: $Name" }
    }
}

function Test-SkillName {
    param([string]$Name)

    if (-not $Name) { return }
    if ($Name -eq "." -or $Name -eq ".." -or $Name.Contains("/") -or $Name.Contains("\")) {
        throw "Invalid skill name: $Name"
    }
}

function Invoke-DownloadArchive {
    param(
        [string]$RepoName,
        [string]$BranchName,
        [string]$Destination
    )

    $archiveUrl = "https://codeload.github.com/$RepoName/zip/refs/heads/$BranchName"
    Write-Info "Downloading $RepoName@$BranchName"
    Invoke-WebRequest -Uri $archiveUrl -OutFile $Destination
}

function Get-ArchiveRoot {
    param([string]$ExtractDir)

    $roots = Get-ChildItem -Path $ExtractDir -Directory
    if ($roots.Count -ne 1) {
        throw "Could not find a single extracted repository root in $ExtractDir"
    }
    return $roots[0].FullName
}

function Get-SkillSources {
    param(
        [string]$RepoRoot,
        [string]$SkillName
    )

    $skillsRoot = Join-Path $RepoRoot "skills"

    if ($SkillName) {
        $skillPath = Join-Path $skillsRoot $SkillName
        if (-not (Test-Path (Join-Path $skillPath "SKILL.md"))) {
            $skillPath = Join-Path $RepoRoot $SkillName
        }
        if (-not (Test-Path (Join-Path $skillPath "SKILL.md"))) {
            throw "Skill not found in archive: $SkillName"
        }
        return @(Get-Item $skillPath)
    }

    $scanRoot = if (Test-Path $skillsRoot) { $skillsRoot } else { $RepoRoot }
    $skills = Get-ChildItem -Path $scanRoot -Directory |
        Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") } |
        Sort-Object Name

    if ($skills.Count -eq 0) {
        throw "No skill folders with SKILL.md were found in archive."
    }
    return @($skills)
}

function Test-TargetWithinRoot {
    param(
        [string]$Target,
        [string]$Root
    )

    $fullTarget = [System.IO.Path]::GetFullPath($Target)
    $fullRoot = [System.IO.Path]::GetFullPath($Root).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
    return $fullTarget.StartsWith($fullRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
}

function Get-ExistingSkillMeta {
    param([string]$Target)

    $metaPath = Join-Path $Target ".skill-meta.json"
    if (-not (Test-Path $metaPath)) {
        return $null
    }

    try {
        return Get-Content -Raw -Path $metaPath | ConvertFrom-Json
    } catch {
        if ($Force) {
            return $null
        }
        throw "Existing skill metadata is invalid: $metaPath"
    }
}

function Get-InstallAction {
    param(
        [string]$Target,
        [string]$SkillName,
        [string]$RepoName
    )

    if (-not (Test-Path $Target)) {
        return @{
            Action = "install"
            ExistingMeta = $null
        }
    }

    $existingMeta = Get-ExistingSkillMeta -Target $Target
    if ($existingMeta -and $existingMeta.repo -eq $RepoName) {
        return @{
            Action = "update"
            ExistingMeta = $existingMeta
        }
    }

    if ($Force) {
        return @{
            Action = "force-replace"
            ExistingMeta = $existingMeta
        }
    }

    if ($existingMeta -and $existingMeta.repo) {
        throw "Refusing to replace '$SkillName' because it was installed from '$($existingMeta.repo)', not '$RepoName'. Use -Force to overwrite intentionally."
    }

    throw "Refusing to replace '$SkillName' because the existing folder has no Autoverse .skill-meta.json. Use -Force to overwrite intentionally."
}

function Install-Skill {
    param(
        [System.IO.DirectoryInfo]$Source,
        [string]$DestinationRoot,
        [string]$AgentName,
        [string]$RepoName,
        [string]$BranchName
    )

    $target = Join-Path $DestinationRoot $Source.Name
    if (-not (Test-TargetWithinRoot -Target $target -Root $DestinationRoot)) {
        throw "Refusing to write outside install directory: $target"
    }

    $plan = Get-InstallAction -Target $target -SkillName $Source.Name -RepoName $RepoName

    if ($DryRun) {
        Write-Host "DRY-RUN $($plan.Action) $($Source.Name) -> $target"
        return
    }

    New-Item -ItemType Directory -Force -Path $DestinationRoot | Out-Null
    if (Test-Path $target) {
        Remove-Item -Recurse -Force -Path $target
    }
    Copy-Item -Recurse -Force -Path $Source.FullName -Destination $target

    $now = (Get-Date).ToUniversalTime().ToString("o")
    $metaPath = Join-Path $target ".skill-meta.json"
    $installedAt = $now
    if ($plan.ExistingMeta -and $plan.ExistingMeta.installedAt) {
        $installedAt = $plan.ExistingMeta.installedAt
    }
    @{
        source = "github-archive"
        repo = $RepoName
        branch = $BranchName
        name = $Source.Name
        agent = $AgentName
        installedAt = $installedAt
        updatedAt = $now
    } | ConvertTo-Json -Depth 3 | Set-Content -Path $metaPath -Encoding UTF8

    Write-Success "$($plan.Action.Substring(0,1).ToUpperInvariant() + $plan.Action.Substring(1)) $($Source.Name) -> $target"
}

try {
    if (-not $Agent) {
        Show-Usage
        throw "Agent is required."
    }

    Test-SkillName $Skill
    $destinationRoot = if ($InstallDir) { $InstallDir } else { Resolve-AgentPath $Agent }
    $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "autoverse-skills-$([Guid]::NewGuid().ToString('N'))"
    $archivePath = Join-Path $tempRoot "repo.zip"
    $extractDir = Join-Path $tempRoot "repo"

    New-Item -ItemType Directory -Force -Path $tempRoot, $extractDir | Out-Null
    try {
        Invoke-DownloadArchive -RepoName $Repo -BranchName $Branch -Destination $archivePath
        Expand-Archive -Path $archivePath -DestinationPath $extractDir -Force
        $repoRoot = Get-ArchiveRoot $extractDir
        $sources = Get-SkillSources -RepoRoot $repoRoot -SkillName $Skill

        Write-Info "$(if ($DryRun) { 'Planning' } else { 'Installing' }) $($sources.Count) skill(s) for $Agent"
        Write-Info "Destination: $destinationRoot"

        foreach ($source in $sources) {
            Install-Skill -Source $source -DestinationRoot $destinationRoot -AgentName $Agent -RepoName $Repo -BranchName $Branch
        }

        if ($DryRun) {
            Write-Success "Dry run complete."
        } else {
            Write-Success "Autoverse skills install complete."
        }
    } finally {
        if (Test-Path $tempRoot) {
            Remove-Item -Recurse -Force -Path $tempRoot
        }
    }
} catch {
    Write-Fail $_.Exception.Message
    exit 1
}
