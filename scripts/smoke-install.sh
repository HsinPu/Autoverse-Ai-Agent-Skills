#!/usr/bin/env bash
set -euo pipefail

log_pass() { printf 'PASS %s\n' "$1"; }
fail() { printf 'FAIL %s\n' "$1" >&2; exit 1; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
INSTALLER="$REPO_ROOT/scripts/install.sh"
EXPECTED_SKILLS="$(node -e "console.log(require(process.argv[1]).skills.length)" "$REPO_ROOT/skills.json")"
EXPECTED_AGENTS="$(node -e "console.log(require(process.argv[1]).agents.length)" "$REPO_ROOT/agents.json")"
SMOKE_MODE="${AUTOVERSE_SMOKE_MODE:-full}"
case "$SMOKE_MODE" in
  full)
    PROJECT_SKILL_ARGS=()
    PROJECT_AGENT_ARGS=()
    EXPECTED_PROJECT_SKILLS="$EXPECTED_SKILLS"
    EXPECTED_PROJECT_AGENTS="$EXPECTED_AGENTS"
    ;;
  quick)
    PROJECT_SKILL_ARGS=(--name terminal-ops)
    PROJECT_AGENT_ARGS=(--name code-reviewer)
    EXPECTED_PROJECT_SKILLS=1
    EXPECTED_PROJECT_AGENTS=1
    ;;
  *) fail "AUTOVERSE_SMOKE_MODE must be full or quick" ;;
esac
TEMP_BASE="$(cd "${TMPDIR:-/tmp}" && pwd -P)"
SMOKE_ROOT="$(mktemp -d "$TEMP_BASE/autoverse-install-smoke-XXXXXXXX")"
PROJECT_ROOT="$SMOKE_ROOT/project"
LAST_OUTPUT=""

cleanup() {
  local resolved
  resolved="$(cd "$SMOKE_ROOT" 2>/dev/null && pwd -P || true)"
  case "$resolved" in
    "$TEMP_BASE"/autoverse-install-smoke-*) ;;
    "") return ;;
    *) printf 'Refusing to clean unexpected smoke root: %s\n' "$resolved" >&2; return 1 ;;
  esac
  if [[ -L "$SMOKE_ROOT" ]]; then
    printf 'Refusing to clean symlink smoke root: %s\n' "$SMOKE_ROOT" >&2
    return 1
  fi
  rm -rf -- "$SMOKE_ROOT"
}

on_exit() {
  local exit_status cleanup_status
  exit_status=$?
  trap - EXIT
  set +e
  cleanup
  cleanup_status=$?
  if [[ "$cleanup_status" -ne 0 ]]; then
    printf 'FAIL smoke cleanup failed for %s\n' "$SMOKE_ROOT" >&2
    exit_status=1
  fi
  exit "$exit_status"
}
trap on_exit EXIT

run_installer() {
  local label="$1"
  shift
  if ! LAST_OUTPUT="$(bash "$INSTALLER" "$@" 2>&1)"; then
    printf '%s\n' "$LAST_OUTPUT" >&2
    fail "$label"
  fi
  log_pass "$label"
}

expect_failure() {
  local label="$1" expected="$2" exit_code
  shift 2
  set +e
  LAST_OUTPUT="$(bash "$INSTALLER" "$@" 2>&1)"
  exit_code=$?
  set -e
  [[ "$exit_code" -ne 0 ]] || fail "$label unexpectedly succeeded"
  [[ "$LAST_OUTPUT" == *"$expected"* ]] || {
    printf '%s\n' "$LAST_OUTPUT" >&2
    fail "$label did not report '$expected'"
  }
  log_pass "$label"
}

assert_equal() {
  local actual="$1" expected="$2" label="$3"
  [[ "$actual" == "$expected" ]] || fail "$label expected $expected, got $actual"
}

assert_metadata() {
  local file="$1" component="$2" component_name="$3" ownership_target="$4" adapter="$5" label="$6"
  [[ -f "$file" && ! -L "$file" ]] || fail "$label metadata is missing or not a regular file: $file"
  if ! node - "$file" "$component" "$component_name" "$ownership_target" "$adapter" <<'NODE'
const fs = require('fs');

const [file, component, componentName, target, adapter] = process.argv.slice(2);
let metadata;
try {
  metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`${file}: ${error.message}`);
  process.exit(1);
}

const expected = {
  source: 'local-checkout',
  repo: 'HsinPu/Autoverse-Ai-Agent-Skills',
  branch: 'main',
  component,
  name: componentName,
  target,
};
if (component === 'agent') {
  expected.id = componentName;
  expected.adapter = adapter;
}

for (const [key, value] of Object.entries(expected)) {
  if (metadata[key] !== value) {
    console.error(`${file}: expected ${key}=${JSON.stringify(value)}, got ${JSON.stringify(metadata[key])}`);
    process.exit(1);
  }
}
NODE
  then
    fail "$label metadata fields do not match the installed profile"
  fi
}

assert_skill_profile() {
  local destination_root="$1" skill_name="$2" ownership_target="$3" label="$4"
  local installed_root="$destination_root/$skill_name"
  assert_metadata "$installed_root/.skill-meta.json" "skill" "$skill_name" "$ownership_target" "" "$label"
  cmp -s "$REPO_ROOT/skills/$skill_name/SKILL.md" "$installed_root/SKILL.md" ||
    fail "$label Skill content does not match its catalog source"
}

assert_agent_profile() {
  local installed_file="$1" agent_name="$2" ownership_target="$3" adapter="$4" label="$5"
  assert_metadata "$installed_file.autoverse.json" "agent" "$agent_name" "$ownership_target" "$adapter" "$label"
  local suffix="${installed_file##*/$agent_name}"
  cmp -s "$REPO_ROOT/adapters/$adapter/$agent_name$suffix" "$installed_file" ||
    fail "$label Agent content does not match the $adapter adapter"
}

count_skill_dirs() {
  local root="$1" count=0 dir
  shopt -s nullglob
  for dir in "$root"/*; do
    [[ -f "$dir/SKILL.md" ]] && count=$((count + 1))
  done
  shopt -u nullglob
  printf '%s' "$count"
}

count_skill_metadata() {
  find "$1" -mindepth 2 -maxdepth 2 -type f -name '.skill-meta.json' -print | wc -l | tr -d ' '
}

count_profile_files() {
  find "$1" -maxdepth 1 -type f -name "$2" -print | wc -l | tr -d ' '
}

count_output_lines() {
  local pattern="$1"
  printf '%s\n' "$LAST_OUTPUT" | grep -Ec "$pattern" || true
}

export HOME="$SMOKE_ROOT/home"
export CODEX_HOME="$HOME/.codex"
export XDG_CONFIG_HOME="$HOME/.config"
export OPENCODE_CONFIG_DIR="$XDG_CONFIG_HOME/opencode"
mkdir -p "$HOME" "$PROJECT_ROOT"

expect_failure "Bash missing option value" "Missing value for --target" --target
expect_failure "Bash option token is not a value" "Missing value for --target" --target -h
expect_failure "Bash strict Skill name" "Invalid Skill Name" \
  --target codex --type skill --name 'Bad Name' --source-dir "$REPO_ROOT" --dry-run

run_installer "project all Skills install" \
  --target project --type skill "${PROJECT_SKILL_ARGS[@]}" --source-dir "$REPO_ROOT" --dir "$PROJECT_ROOT"
run_installer "project all Agents install" \
  --target project --type agent "${PROJECT_AGENT_ARGS[@]}" --source-dir "$REPO_ROOT" --dir "$PROJECT_ROOT"

for root in "$PROJECT_ROOT/.agents/skills" "$PROJECT_ROOT/.claude/skills"; do
  assert_equal "$(count_skill_dirs "$root")" "$EXPECTED_PROJECT_SKILLS" "$root Skill count"
  assert_equal "$(count_skill_metadata "$root")" "$EXPECTED_PROJECT_SKILLS" "$root Skill metadata count"
  assert_skill_profile "$root" "terminal-ops" "project" "$root representative"
done

PROFILE_ROOTS=(
  "$PROJECT_ROOT/.codex/agents"
  "$PROJECT_ROOT/.claude/agents"
  "$PROJECT_ROOT/.cursor/agents"
  "$PROJECT_ROOT/.github/agents"
  "$PROJECT_ROOT/.opencode/agents"
)
PROFILE_PATTERNS=('*.toml' '*.md' '*.md' '*.agent.md' '*.md')
PROFILE_SUFFIXES=('.toml' '.md' '.md' '.agent.md' '.md')
PROFILE_ADAPTERS=('codex' 'claude' 'cursor' 'copilot' 'opencode')
for ((index = 0; index < ${#PROFILE_ROOTS[@]}; index++)); do
  assert_equal "$(count_profile_files "${PROFILE_ROOTS[$index]}" "${PROFILE_PATTERNS[$index]}")" "$EXPECTED_PROJECT_AGENTS" "Agent profile $index count"
  assert_equal "$(count_profile_files "${PROFILE_ROOTS[$index]}" '*.autoverse.json')" "$EXPECTED_PROJECT_AGENTS" "Agent profile $index metadata count"
  assert_agent_profile \
    "${PROFILE_ROOTS[$index]}/code-reviewer${PROFILE_SUFFIXES[$index]}" \
    "code-reviewer" \
    "project" \
    "${PROFILE_ADAPTERS[$index]}" \
    "Agent profile $index representative"
done
log_pass "project profile counts, source content, and parsed ownership metadata"

run_installer "project Skill update" \
  --target project --type skill --name terminal-ops --source-dir "$REPO_ROOT" --dir "$PROJECT_ROOT"
assert_equal "$(count_output_lines '^OK  update Skill ')" 2 "project Skill update count"

run_installer "project Agent update" \
  --target project --type agent --name code-reviewer --source-dir "$REPO_ROOT" --dir "$PROJECT_ROOT"
assert_equal "$(count_output_lines '^OK  update Agent ')" 5 "project Agent update count"

rm -f -- "$PROJECT_ROOT/.codex/agents/code-reviewer.toml"
run_installer "project Agent repair" \
  --target project --type agent --name code-reviewer --source-dir "$REPO_ROOT" --dir "$PROJECT_ROOT"
assert_equal "$(count_output_lines '^OK  repair Agent ')" 1 "project Agent repair count"
assert_equal "$(count_output_lines '^OK  update Agent ')" 4 "project unaffected Agent update count"
[[ -f "$PROJECT_ROOT/.codex/agents/code-reviewer.toml" ]] || fail "project Agent repair did not restore the file"

SKILL_COLLISION_ROOT="$SMOKE_ROOT/project-skill-collision"
SKILL_COLLISION_FILE="$SKILL_COLLISION_ROOT/.claude/skills/python-development/SKILL.md"
SKILL_SENTINEL='FOREIGN-SKILL-SENTINEL: this directory is not owned by Autoverse'
mkdir -p "$(dirname "$SKILL_COLLISION_FILE")"
printf '%s\n' "$SKILL_SENTINEL" > "$SKILL_COLLISION_FILE"
SKILL_COLLISION_CHECKSUM="$(cksum < "$SKILL_COLLISION_FILE")"
expect_failure "project Skill ownership collision" "no matching Autoverse metadata" \
  --target project --type skill --name python-development --source-dir "$REPO_ROOT" --dir "$SKILL_COLLISION_ROOT"
assert_equal "$(cksum < "$SKILL_COLLISION_FILE")" "$SKILL_COLLISION_CHECKSUM" "foreign Skill sentinel checksum"
assert_equal "$(cat "$SKILL_COLLISION_FILE")" "$SKILL_SENTINEL" "foreign Skill sentinel content"
[[ ! -e "$SKILL_COLLISION_ROOT/.claude/skills/python-development/.skill-meta.json" ]] || fail "Skill collision added ownership metadata to foreign content"
[[ ! -e "$SKILL_COLLISION_ROOT/.agents/skills/python-development" ]] || fail "Skill collision left a partial first-profile install"

AGENT_COLLISION_ROOT="$SMOKE_ROOT/project-agent-collision"
AGENT_COLLISION_FILE="$AGENT_COLLISION_ROOT/.opencode/agents/code-reviewer.md"
AGENT_SENTINEL='FOREIGN-AGENT-SENTINEL: this file is not owned by Autoverse'
mkdir -p "$(dirname "$AGENT_COLLISION_FILE")"
printf '%s\n' "$AGENT_SENTINEL" > "$AGENT_COLLISION_FILE"
AGENT_COLLISION_CHECKSUM="$(cksum < "$AGENT_COLLISION_FILE")"
expect_failure "project Agent ownership collision" "no matching Autoverse metadata" \
  --target project --type agent --name code-reviewer --source-dir "$REPO_ROOT" --dir "$AGENT_COLLISION_ROOT"
assert_equal "$(cksum < "$AGENT_COLLISION_FILE")" "$AGENT_COLLISION_CHECKSUM" "foreign Agent sentinel checksum"
assert_equal "$(cat "$AGENT_COLLISION_FILE")" "$AGENT_SENTINEL" "foreign Agent sentinel content"
[[ ! -e "$AGENT_COLLISION_FILE.autoverse.json" ]] || fail "Agent collision added ownership metadata to foreign content"
for partial in \
  '.codex/agents/code-reviewer.toml' \
  '.claude/agents/code-reviewer.md' \
  '.cursor/agents/code-reviewer.md' \
  '.github/agents/code-reviewer.agent.md'; do
  [[ ! -e "$AGENT_COLLISION_ROOT/$partial" ]] || fail "Agent collision left a partial profile install: $partial"
done

GLOBAL_TARGETS=('codex' 'claude' 'cursor' 'vscode' 'copilot' 'opencode')
GLOBAL_SKILL_NAMES=('terminal-ops' 'terminal-ops' 'terminal-ops' 'terminal-ops' 'python-development' 'terminal-ops')
GLOBAL_AGENT_NAMES=('code-reviewer' 'code-reviewer' 'code-reviewer' 'code-reviewer' 'debugger' 'code-reviewer')
GLOBAL_SKILL_ROOTS=(
  "$CODEX_HOME/skills"
  "$HOME/.claude/skills"
  "$HOME/.cursor/skills"
  "$HOME/.copilot/skills"
  "$HOME/.copilot/skills"
  "$OPENCODE_CONFIG_DIR/skills"
)
GLOBAL_AGENT_FILES=(
  "$CODEX_HOME/agents/code-reviewer.toml"
  "$HOME/.claude/agents/code-reviewer.md"
  "$HOME/.cursor/agents/code-reviewer.md"
  "$HOME/.copilot/agents/code-reviewer.agent.md"
  "$HOME/.copilot/agents/debugger.agent.md"
  "$OPENCODE_CONFIG_DIR/agents/code-reviewer.md"
)
GLOBAL_OWNERSHIP_TARGETS=('codex' 'claude' 'cursor' 'copilot' 'copilot' 'opencode')
GLOBAL_AGENT_ADAPTERS=('codex' 'claude' 'cursor' 'copilot' 'copilot' 'opencode')

for ((index = 0; index < ${#GLOBAL_TARGETS[@]}; index++)); do
  requested_target="${GLOBAL_TARGETS[$index]}"
  skill_name="${GLOBAL_SKILL_NAMES[$index]}"
  agent_name="${GLOBAL_AGENT_NAMES[$index]}"
  ownership_target="${GLOBAL_OWNERSHIP_TARGETS[$index]}"
  adapter="${GLOBAL_AGENT_ADAPTERS[$index]}"

  run_installer "global $requested_target Skill install" \
    --target "$requested_target" --type skill --name "$skill_name" --source-dir "$REPO_ROOT"
  assert_equal "$(count_output_lines '^OK  install Skill ')" 1 "global $requested_target Skill install count"
  run_installer "global $requested_target Skill update" \
    --target "$requested_target" --type skill --name "$skill_name" --source-dir "$REPO_ROOT"
  assert_equal "$(count_output_lines '^OK  update Skill ')" 1 "global $requested_target Skill update count"
  assert_skill_profile \
    "${GLOBAL_SKILL_ROOTS[$index]}" \
    "$skill_name" \
    "$ownership_target" \
    "global $requested_target"

  run_installer "global $requested_target Agent install" \
    --target "$requested_target" --type agent --name "$agent_name" --source-dir "$REPO_ROOT"
  assert_equal "$(count_output_lines '^OK  install Agent ')" 1 "global $requested_target Agent install count"
  run_installer "global $requested_target Agent update" \
    --target "$requested_target" --type agent --name "$agent_name" --source-dir "$REPO_ROOT"
  assert_equal "$(count_output_lines '^OK  update Agent ')" 1 "global $requested_target Agent update count"
  if [[ "$requested_target" == "vscode" ]]; then
    [[ "$LAST_OUTPUT" == *"Target alias: vscode -> copilot"* ]] || fail "vscode Agent update did not report the copilot alias"
  fi
  assert_agent_profile \
    "${GLOBAL_AGENT_FILES[$index]}" \
    "$agent_name" \
    "$ownership_target" \
    "$adapter" \
    "global $requested_target"
done
log_pass "global Skill and Agent install/update target matrix"

run_installer "Codex auto-delegation install" \
  --target codex --type agent --name debugger --source-dir "$REPO_ROOT" --enable-auto-delegation
run_installer "Codex auto-delegation update" \
  --target codex --type agent --name debugger --source-dir "$REPO_ROOT" --enable-auto-delegation
assert_equal "$(count_output_lines '^OK  update Agent ')" 1 "Codex Agent update count"
assert_equal "$(grep -c '^# AUTOVERSE_AUTO_DELEGATION_START$' "$CODEX_HOME/config.toml")" 1 "Codex auto-delegation block count"
assert_agent_profile "$CODEX_HOME/agents/debugger.toml" "debugger" "codex" "codex" "Codex auto-delegation"
assert_skill_profile "$CODEX_HOME/skills" "subagent-architecture" "codex" "Codex auto-delegation companion"

printf 'Bash installer smoke passed (%s): %s Skills, %s Agents.\n' "$SMOKE_MODE" "$EXPECTED_PROJECT_SKILLS" "$EXPECTED_PROJECT_AGENTS"
