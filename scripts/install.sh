#!/usr/bin/env bash
set -euo pipefail

REPO="HsinPu/Autoverse-Ai-Agent-Skills"
BRANCH="main"
TARGET=""
TYPE="skill"
NAME=""
INSTALL_DIR=""
SOURCE_DIR=""
DRY_RUN=0
FORCE=0

usage() {
  cat <<'EOF'
Autoverse AI Agent Skills installer

Usage:
  scripts/install.sh --target <target> [--type skill] [--name <skill>] [--dir path] [--dry-run] [--force]
  scripts/install.sh [--target <target>] --type agent [--name <role>] [--dir path] [--dry-run] [--force]

Compatibility aliases:
  --agent is an alias for --target; --skill selects a Skill by name.
  --source-dir installs from a local checkout; otherwise the requested GitHub repo and branch are downloaded.
  Omit --name with --type agent to install every available Agent.
  Omit --target with --type agent to install into the current user's Codex.

Skill targets:
  claude, cursor, codex, amp, vscode, copilot, project, goose, opencode,
  opencode-project, letta, gemini

Agent targets:
  codex, codex-project, claude, claude-project

Examples:
  scripts/install.sh --target codex --name python-development
  scripts/install.sh --agent codex --skill python-development
  scripts/install.sh --type agent --name code-reviewer
  scripts/install.sh --target claude-project --agent-profile debugger --dry-run

Safety:
  Existing components are updated only when repo, component, name, and target metadata all match.
  Unknown same-named content is blocked unless --force is provided.
EOF
}

log_info() { printf '==> %s\n' "$1"; }
log_success() { printf 'OK  %s\n' "$1"; }
log_error() { printf 'Error: %s\n' "$1" >&2; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target|--agent) TARGET="${2:-}"; shift 2 ;;
    --type) TYPE="${2:-}"; shift 2 ;;
    --name) NAME="${2:-}"; shift 2 ;;
    --skill) TYPE="skill"; NAME="${2:-}"; shift 2 ;;
    --agent-profile) TYPE="agent"; NAME="${2:-}"; shift 2 ;;
    --branch) BRANCH="${2:-}"; shift 2 ;;
    --repo) REPO="${2:-}"; shift 2 ;;
    --dir) INSTALL_DIR="${2:-}"; shift 2 ;;
    --source-dir) SOURCE_DIR="${2:-}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    --force) FORCE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) log_error "Unknown argument: $1"; usage; exit 1 ;;
  esac
done

if [[ -z "$TARGET" && "$TYPE" == "agent" ]]; then TARGET="codex"; fi

install_path() {
  local target="$1"
  local type="$2"
  if [[ "$type" == "agent" ]]; then
    case "$target" in
      codex) printf '%s/.codex/agents' "$HOME" ;;
      codex-project) printf '%s/.codex/agents' "$PWD" ;;
      claude) printf '%s/.claude/agents' "$HOME" ;;
      claude-project) printf '%s/.claude/agents' "$PWD" ;;
      *) return 1 ;;
    esac
    return
  fi

  case "$target" in
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

validate_name() {
  if [[ "$TYPE" == "agent" ]]; then
    [[ -z "$NAME" ]] && return
    if [[ ! "$NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
      log_error "Invalid Agent Name '$NAME'. Expected a lowercase hyphen-case role."
      exit 1
    fi
    return
  fi
  [[ -z "$NAME" ]] && return
  if [[ "$NAME" == "." || "$NAME" == ".." || "$NAME" == *"/"* || "$NAME" == *"\\"* ]]; then
    log_error "Invalid Skill Name: $NAME"
    exit 1
  fi
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_error "$1 is required but was not found."
    exit 1
  fi
}

json_string_value() {
  local file="$1" key="$2"
  sed -n "s/^[[:space:]]*\"$key\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" "$file" | head -n 1
}

yaml_frontmatter_value() {
  local file="$1" key="$2"
  [[ -f "$file" ]] || return 0
  awk -v key="$key" '
    NR == 1 && $0 == "---" { inside = 1; next }
    inside && $0 == "---" { exit }
    inside && index($0, key ":") == 1 {
      value = substr($0, length(key) + 2)
      sub(/^[[:space:]]+/, "", value)
      sub(/[[:space:]]+$/, "", value)
      gsub(/^['\''"]|['\''"]$/, "", value)
      print value
      exit
    }
  ' "$file"
}

install_action() {
  local target="$1" meta="$2" label="$3" expected_component="$4" expected_name="$5" expected_target="$6" legacy_identity="${7:-}"
  INSTALL_ACTION="install"
  EXISTING_INSTALLED_AT=""
  [[ ! -e "$target" ]] && return

  if [[ -f "$meta" ]]; then
    local existing_repo existing_component existing_name existing_target existing_agent
    existing_repo="$(json_string_value "$meta" "repo")"
    existing_component="$(json_string_value "$meta" "component")"
    existing_name="$(json_string_value "$meta" "name")"
    existing_target="$(json_string_value "$meta" "target")"
    existing_agent="$(json_string_value "$meta" "agent")"
    EXISTING_INSTALLED_AT="$(json_string_value "$meta" "installedAt")"
    if [[ "$existing_repo" == "$REPO" && "$existing_component" == "$expected_component" && "$existing_name" == "$expected_name" && "$existing_target" == "$expected_target" ]]; then
      INSTALL_ACTION="update"
      return
    fi
    if [[ "$existing_repo" == "$REPO" && "$expected_component" == "skill" && -z "$existing_component" && -z "$existing_target" && "$existing_name" == "$expected_name" && "$existing_agent" == "$expected_target" ]]; then
      local legacy_skill_name legacy_skill_source
      legacy_skill_name="$(yaml_frontmatter_value "$legacy_identity" "name")"
      legacy_skill_source="$(yaml_frontmatter_value "$legacy_identity" "source")"
      if [[ "$legacy_skill_name" == "$expected_name" && "$legacy_skill_source" == "$REPO" ]]; then
        INSTALL_ACTION="migrate-update"
        return
      fi
    fi
    if [[ "$FORCE" -eq 1 ]]; then INSTALL_ACTION="force-replace"; return; fi
    if [[ -n "$existing_repo" && "$existing_repo" != "$REPO" ]]; then
      log_error "Refusing to replace '$label' because it was installed from '$existing_repo', not '$REPO'. Use --force to overwrite intentionally."
    elif [[ "$existing_repo" == "$REPO" ]]; then
      log_error "Refusing to replace '$label' because its ownership metadata does not match component='$expected_component', name='$expected_name', and target='$expected_target'. Use --force to overwrite intentionally."
    else
      log_error "Refusing to replace '$label' because its Autoverse metadata is invalid. Use --force to overwrite intentionally."
    fi
    exit 1
  fi

  if [[ "$FORCE" -eq 1 ]]; then INSTALL_ACTION="force-replace"; return; fi
  log_error "Refusing to replace '$label' because it has no matching Autoverse metadata. Use --force to overwrite intentionally."
  exit 1
}

assert_within_destination() {
  case "$1" in
    "$DEST_DIR"/*) ;;
    *) log_error "Refusing to write outside install directory: $1"; exit 1 ;;
  esac
}

install_skill() {
  local src="$1" name target meta now installed_at
  name="$(basename "$src")"
  target="$DEST_DIR/$name"
  meta="$target/.skill-meta.json"
  assert_within_destination "$target"
  install_action "$target" "$meta" "$name" "skill" "$name" "$TARGET" "$target/SKILL.md"
  if [[ "$DRY_RUN" -eq 1 ]]; then printf 'DRY-RUN %s Skill %s -> %s\n' "$INSTALL_ACTION" "$name" "$target"; return; fi

  mkdir -p "$DEST_DIR"
  rm -rf "$target"
  cp -R "$src" "$target"
  now="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  installed_at="${EXISTING_INSTALLED_AT:-$now}"
  cat > "$meta" <<EOF
{
  "source": "$SOURCE_KIND",
  "repo": "$REPO",
  "branch": "$BRANCH",
  "component": "skill",
  "name": "$name",
  "target": "$TARGET",
  "installedAt": "$installed_at",
  "updatedAt": "$now"
}
EOF
  log_success "$INSTALL_ACTION Skill $name -> $target"
}

install_agent_profile() {
  local src="$1" runtime_name="$2" agent_id="$3" platform="$4" extension target meta now installed_at
  extension=".${src##*.}"
  target="$DEST_DIR/$runtime_name$extension"
  meta="$target.autoverse.json"
  assert_within_destination "$target"
  install_action "$target" "$meta" "$agent_id" "agent" "$runtime_name" "$TARGET"
  if [[ "$DRY_RUN" -eq 1 ]]; then printf 'DRY-RUN %s Agent %s -> %s\n' "$INSTALL_ACTION" "$agent_id" "$target"; return; fi

  mkdir -p "$DEST_DIR"
  cp "$src" "$target"
  now="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  installed_at="${EXISTING_INSTALLED_AT:-$now}"
  cat > "$meta" <<EOF
{
  "source": "$SOURCE_KIND",
  "repo": "$REPO",
  "branch": "$BRANCH",
  "component": "agent",
  "id": "$agent_id",
  "name": "$runtime_name",
  "adapter": "$platform",
  "target": "$TARGET",
  "installedAt": "$installed_at",
  "updatedAt": "$now"
}
EOF
  log_success "$INSTALL_ACTION Agent $agent_id -> $target"
}

preflight_agent_profile() {
  local src="$1" runtime_name="$2" agent_id="$3" extension target meta
  extension=".${src##*.}"
  target="$DEST_DIR/$runtime_name$extension"
  meta="$target.autoverse.json"
  assert_within_destination "$target"
  install_action "$target" "$meta" "$agent_id" "agent" "$runtime_name" "$TARGET"
}

if [[ -z "$TARGET" ]]; then usage; log_error "Target is required."; exit 1; fi
if [[ "$TYPE" != "skill" && "$TYPE" != "agent" ]]; then log_error "Type must be skill or agent."; exit 1; fi
validate_name

if [[ -n "$INSTALL_DIR" ]]; then
  DEST_DIR="$INSTALL_DIR"
elif ! DEST_DIR="$(install_path "$TARGET" "$TYPE")"; then
  log_error "Unsupported $TYPE target: $TARGET"
  usage
  exit 1
fi

TMP_DIR=""
cleanup() { [[ -z "$TMP_DIR" ]] || rm -rf "$TMP_DIR"; }
trap cleanup EXIT
if [[ -n "$SOURCE_DIR" ]]; then
  REPO_ROOT="$(cd "$SOURCE_DIR" && pwd)"
  SOURCE_KIND="local-checkout"
else
  require_command curl
  require_command tar
  require_command mktemp
  TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/autoverse-$TYPE.XXXXXX")"
  ARCHIVE="$TMP_DIR/repo.tar.gz"
  EXTRACT_DIR="$TMP_DIR/repo"
  mkdir -p "$EXTRACT_DIR"
  log_info "Downloading $REPO@$BRANCH"
  curl -fsSL "https://codeload.github.com/$REPO/tar.gz/refs/heads/$BRANCH" -o "$ARCHIVE"
  tar -xzf "$ARCHIVE" -C "$EXTRACT_DIR"
  REPO_ROOT="$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
  if [[ -z "$REPO_ROOT" ]]; then log_error "Could not find extracted repository root."; exit 1; fi
  SOURCE_KIND="github-archive"
fi
log_info "Destination: $DEST_DIR"

if [[ "$TYPE" == "agent" ]]; then
  if [[ "$TARGET" == codex* ]]; then PLATFORM="codex"; EXTENSION="toml"; else PLATFORM="claude"; EXTENSION="md"; fi
  AGENT_SOURCES=()
  if [[ -n "$NAME" ]]; then
    SOURCE="$REPO_ROOT/adapters/$PLATFORM/$NAME.$EXTENSION"
    if [[ ! -f "$SOURCE" ]]; then log_error "Agent adapter not found in archive: $NAME ($PLATFORM)"; exit 1; fi
    AGENT_SOURCES+=("$SOURCE")
  else
    for source in "$REPO_ROOT/adapters/$PLATFORM"/*."$EXTENSION"; do
      [[ -f "$source" ]] && AGENT_SOURCES+=("$source")
    done
  fi
  if [[ "${#AGENT_SOURCES[@]}" -eq 0 ]]; then log_error "No Agent adapters were found for $PLATFORM."; exit 1; fi
  for source in "${AGENT_SOURCES[@]}"; do
    ROLE_FILE="${source##*/}"
    ROLE="${ROLE_FILE%.$EXTENSION}"
    preflight_agent_profile "$source" "$ROLE" "$ROLE"
  done
  log_info "$(if [[ "$DRY_RUN" -eq 1 ]]; then printf Planning; else printf Installing; fi) ${#AGENT_SOURCES[@]} Agent(s) for $TARGET"
  for source in "${AGENT_SOURCES[@]}"; do
    ROLE_FILE="${source##*/}"
    ROLE="${ROLE_FILE%.$EXTENSION}"
    install_agent_profile "$source" "$ROLE" "$ROLE" "$PLATFORM"
  done
else
  SOURCES=()
  SKILLS_ROOT="$REPO_ROOT/skills"
  if [[ -n "$NAME" ]]; then
    SKILL_PATH="$SKILLS_ROOT/$NAME"
    [[ -f "$SKILL_PATH/SKILL.md" ]] || SKILL_PATH="$REPO_ROOT/$NAME"
    if [[ ! -f "$SKILL_PATH/SKILL.md" ]]; then log_error "Skill not found in archive: $NAME"; exit 1; fi
    SOURCES+=("$SKILL_PATH")
  else
    SCAN_ROOT="$SKILLS_ROOT"
    [[ -d "$SCAN_ROOT" ]] || SCAN_ROOT="$REPO_ROOT"
    while IFS= read -r dir; do SOURCES+=("$dir"); done < <(find "$SCAN_ROOT" -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/SKILL.md' ';' -print | sort)
  fi
  if [[ "${#SOURCES[@]}" -eq 0 ]]; then log_error "No Skill folders with SKILL.md were found in archive."; exit 1; fi
  log_info "$(if [[ "$DRY_RUN" -eq 1 ]]; then printf Planning; else printf Installing; fi) ${#SOURCES[@]} Skill(s) for $TARGET"
  for src in "${SOURCES[@]}"; do install_skill "$src"; done
fi

if [[ "$DRY_RUN" -eq 1 ]]; then log_success "Dry run complete."; else log_success "Autoverse $TYPE install complete."; fi
