#!/usr/bin/env bash
set -euo pipefail

REPO="HsinPu/Autoverse-Ai-Agent-Skills"
BRANCH="main"
AGENT=""
SKILL=""
INSTALL_DIR=""
DRY_RUN=0

usage() {
  cat <<'EOF'
Autoverse AI Agent Skills installer

Usage:
  scripts/install.sh --agent <agent> [--skill <skill>] [--branch main] [--repo owner/repo] [--dir path] [--dry-run]

Agents:
  claude, cursor, codex, amp, vscode, copilot, project, goose, opencode, opencode-project, letta, gemini

Examples:
  scripts/install.sh --agent codex
  scripts/install.sh --agent codex --skill python-development
  scripts/install.sh --agent project --dry-run
EOF
}

log_info() {
  printf '==> %s\n' "$1"
}

log_success() {
  printf 'OK  %s\n' "$1"
}

log_error() {
  printf 'Error: %s\n' "$1" >&2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent)
      AGENT="${2:-}"
      shift 2
      ;;
    --skill)
      SKILL="${2:-}"
      shift 2
      ;;
    --branch)
      BRANCH="${2:-}"
      shift 2
      ;;
    --repo)
      REPO="${2:-}"
      shift 2
      ;;
    --dir)
      INSTALL_DIR="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      log_error "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

agent_path() {
  case "$1" in
    claude) printf '%s/.claude/skills' "$HOME" ;;
    cursor) printf '%s/.cursor/skills' "$PWD" ;;
    codex) printf '%s/.codex/skills' "$HOME" ;;
    amp) printf '%s/.amp/skills' "$HOME" ;;
    vscode|copilot) printf '%s/.github/skills' "$PWD" ;;
    project) printf '%s/.skills' "$PWD" ;;
    goose) printf '%s/goose/skills' "${XDG_CONFIG_HOME:-$HOME/.config}" ;;
    opencode) printf '%s/opencode/skills' "${XDG_CONFIG_HOME:-$HOME/.config}" ;;
    opencode-project) printf '%s/.opencode/skills' "$PWD" ;;
    letta) printf '%s/.letta/skills' "$HOME" ;;
    gemini) printf '%s/.gemini/skills' "$HOME" ;;
    *) return 1 ;;
  esac
}

validate_skill_name() {
  local name="$1"
  [[ -z "$name" ]] && return 0
  if [[ "$name" == "." || "$name" == ".." || "$name" == *"/"* || "$name" == *"\\"* ]]; then
    log_error "Invalid skill name: $name"
    exit 1
  fi
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_error "$1 is required but was not found."
    exit 1
  fi
}

install_skill() {
  local src="$1"
  local name
  name="$(basename "$src")"
  local target="$DEST_DIR/$name"

  case "$target" in
    "$DEST_DIR"/*) ;;
    *)
      log_error "Refusing to write outside install directory: $target"
      exit 1
      ;;
  esac

  if [[ "$DRY_RUN" -eq 1 ]]; then
    if [[ -e "$target" ]]; then
      printf 'DRY-RUN replace %s -> %s\n' "$name" "$target"
    else
      printf 'DRY-RUN install %s -> %s\n' "$name" "$target"
    fi
    return
  fi

  mkdir -p "$DEST_DIR"
  rm -rf "$target"
  cp -R "$src" "$target"

  local now
  now="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  cat > "$target/.skill-meta.json" <<EOF
{
  "source": "github-archive",
  "repo": "$REPO",
  "branch": "$BRANCH",
  "name": "$name",
  "agent": "$AGENT",
  "installedAt": "$now",
  "updatedAt": "$now"
}
EOF

  log_success "Installed $name -> $target"
}

if [[ -z "$AGENT" ]]; then
  usage
  log_error "Agent is required."
  exit 1
fi

validate_skill_name "$SKILL"
require_command curl
require_command tar
require_command mktemp

if [[ -n "$INSTALL_DIR" ]]; then
  DEST_DIR="$INSTALL_DIR"
else
  if ! DEST_DIR="$(agent_path "$AGENT")"; then
    log_error "Unsupported agent: $AGENT"
    usage
    exit 1
  fi
fi

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/autoverse-skills.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

ARCHIVE="$TMP_DIR/repo.tar.gz"
EXTRACT_DIR="$TMP_DIR/repo"
mkdir -p "$EXTRACT_DIR"

log_info "Downloading $REPO@$BRANCH"
curl -fsSL "https://codeload.github.com/$REPO/tar.gz/refs/heads/$BRANCH" -o "$ARCHIVE"
tar -xzf "$ARCHIVE" -C "$EXTRACT_DIR"

REPO_ROOT="$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
if [[ -z "$REPO_ROOT" ]]; then
  log_error "Could not find extracted repository root."
  exit 1
fi

SOURCES=()
if [[ -n "$SKILL" ]]; then
  if [[ ! -f "$REPO_ROOT/$SKILL/SKILL.md" ]]; then
    log_error "Skill not found in archive: $SKILL"
    exit 1
  fi
  SOURCES+=("$REPO_ROOT/$SKILL")
else
  while IFS= read -r dir; do
    SOURCES+=("$dir")
  done < <(find "$REPO_ROOT" -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/SKILL.md' ';' -print | sort)
fi

if [[ "${#SOURCES[@]}" -eq 0 ]]; then
  log_error "No skill folders with SKILL.md were found in archive."
  exit 1
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  log_info "Planning ${#SOURCES[@]} skill(s) for $AGENT"
else
  log_info "Installing ${#SOURCES[@]} skill(s) for $AGENT"
fi
log_info "Destination: $DEST_DIR"

for src in "${SOURCES[@]}"; do
  install_skill "$src"
done

if [[ "$DRY_RUN" -eq 1 ]]; then
  log_success "Dry run complete."
else
  log_success "Autoverse skills install complete."
fi
