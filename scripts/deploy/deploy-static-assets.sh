#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
REPO_ROOT=$(cd "$DIR/../.." && pwd)
SETTINGS="$REPO_ROOT/settings.json"
PUBLIC_DIR="$REPO_ROOT/textuality-client/public"
B2_BUCKET="textuality-static"

ask() {
  local reply
  read -r -p "$1" reply </dev/tty
  printf '%s' "$reply"
}

ask_yes() {
  local reply
  reply=$(ask "$1")
  case "${reply:-Y}" in
    [Yy] | [Yy][Ee][Ss] | '') return 0 ;;
    *) return 1 ;;
  esac
}

jq_pick_field() {
  local item_json="$1"
  shift
  local names_json
  names_json=$(printf '%s\n' "$@" | jq -R . | jq -s .)
  # Try candidate names in the order given, not 1Password field order.
  jq -r --argjson names "$names_json" '
    def norm: ascii_downcase | gsub("[^a-z0-9]"; "");
    def field_names:
      [.purpose, .label, .id] | map(select(. != null) | norm);
    [
      $names[] as $name
      | ($name | norm) as $wanted
      | .fields[]?
      | select((.value // "") != "")
      | select(field_names | any(. == $wanted))
      | (.value | gsub("^\\s+|\\s+$"; ""))
    ] | first // empty
  ' <<<"$item_json"
}

ensure_op_signin() {
  if op whoami >/dev/null 2>&1; then
    return 0
  fi
  echo "Sign in to 1Password to continue."
  op signin
  op whoami >/dev/null
}

pick_op_item_id() {
  local items matches count choice name
  items=$(op item list --format json)
  matches=$(jq -c '[.[] | select(.title | test("backblaze|\\bb2\\b|textuality-static"; "i"))]' <<<"$items")
  count=$(jq 'length' <<<"$matches")

  if [[ "$count" -eq 0 ]]; then
    echo "No 1Password items matched Backblaze / B2 / textuality-static." >&2
    name=$(ask "Enter 1Password item name or ID: ")
    if [[ -z "$name" ]]; then
      echo "No item specified." >&2
      return 1
    fi
    printf '%s' "$name"
    return 0
  fi

  if [[ "$count" -eq 1 ]]; then
    jq -r '.[0] | "Using 1Password item: \(.title) (\(.vault.name))" ' <<<"$matches" >&2
    jq -r '.[0].id' <<<"$matches"
    return 0
  fi

  echo "Select a 1Password item:" >&2
  jq -r 'to_entries[] | "\(.key + 1)) \(.value.title) (\(.value.vault.name))"' <<<"$matches" >&2
  choice=$(ask "Item number [1]: ")
  choice=${choice:-1}
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [[ "$choice" -lt 1 || "$choice" -gt "$count" ]]; then
    echo "Invalid selection." >&2
    return 1
  fi
  jq -r --argjson i "$((choice - 1))" '.[$i].id' <<<"$matches"
}

prompt_op_field() {
  local item_json="$1"
  local prompt="$2"
  local fields_json count choice
  fields_json=$(jq -c '[.fields[]? | select((.label // .id // "") != "") | {label: (.label // .id), value: (.value // "")}]' <<<"$item_json")
  count=$(jq 'length' <<<"$fields_json")
  if [[ "$count" -eq 0 ]]; then
    echo "That 1Password item has no fields." >&2
    return 1
  fi
  echo "$prompt" >&2
  jq -r 'to_entries[] | "\(.key + 1)) \(.value.label)"' <<<"$fields_json" >&2
  choice=$(ask "Field number: ")
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [[ "$choice" -lt 1 || "$choice" -gt "$count" ]]; then
    echo "Invalid selection." >&2
    return 1
  fi
  jq -r --argjson i "$((choice - 1))" '.[$i].value' <<<"$fields_json"
}

fetch_b2_creds_from_1password() {
  local item_id item_json key_id key
  if ! command -v op >/dev/null 2>&1; then
    return 1
  fi
  if ! ask_yes "B2 credentials not found. Fetch from 1Password? [Y/n] "; then
    return 1
  fi

  ensure_op_signin
  item_id=$(pick_op_item_id)
  item_json=$(op item get "$item_id" --format json --reveal)

  key_id=$(jq_pick_field "$item_json" \
    keyid applicationkeyid b2applicationkeyid appkeyid username)
  key=$(jq_pick_field "$item_json" \
    credential applicationkey b2applicationkey secret appkey password)

  if [[ -z "$key_id" ]]; then
    key_id=$(prompt_op_field "$item_json" "Which field is the B2 application key ID?")
  fi
  if [[ -z "$key" ]]; then
    key=$(prompt_op_field "$item_json" "Which field is the B2 application key?")
  fi

  if [[ -z "$key_id" || -z "$key" ]]; then
    echo "Could not read B2 credentials from that 1Password item." >&2
    return 1
  fi

  B2_APPLICATION_KEY_ID="$key_id"
  B2_APPLICATION_KEY="$key"
}

if [[ ! -d "$PUBLIC_DIR" ]]; then
  echo "Missing static assets directory: $PUBLIC_DIR" >&2
  exit 1
fi

if ! command -v b2 >/dev/null 2>&1; then
  echo "b2 CLI not found. Run scripts/local-setup.sh (installs b2-tools)." >&2
  exit 1
fi

# Prefer env vars; otherwise gitignored settings.json; otherwise 1Password CLI.
if [[ -z "${B2_APPLICATION_KEY_ID:-}" && -f "$SETTINGS" ]]; then
  B2_APPLICATION_KEY_ID=$(jq -r '.private.b2ApplicationKeyId // empty' "$SETTINGS")
fi
if [[ -z "${B2_APPLICATION_KEY:-}" && -f "$SETTINGS" ]]; then
  B2_APPLICATION_KEY=$(jq -r '.private.b2ApplicationKey // empty' "$SETTINGS")
fi

if [[ -z "${B2_APPLICATION_KEY_ID:-}" || -z "${B2_APPLICATION_KEY:-}" ]]; then
  if command -v op >/dev/null 2>&1; then
    fetch_b2_creds_from_1password || true
  fi
fi
export B2_APPLICATION_KEY_ID="${B2_APPLICATION_KEY_ID:-}"
export B2_APPLICATION_KEY="${B2_APPLICATION_KEY:-}"

if [[ -z "$B2_APPLICATION_KEY_ID" || -z "$B2_APPLICATION_KEY" ]]; then
  echo "Missing B2 credentials. Set B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY, add private.b2ApplicationKeyId and private.b2ApplicationKey to settings.json, or install the 1Password CLI (op) to fetch them." >&2
  exit 1
fi

echo "Syncing textuality-client/public to b2://${B2_BUCKET}..."
b2 sync \
  --replace-newer \
  --exclude-regex '(.*\.DS_Store)|(.*\.Spotlight-V100)' \
  "$PUBLIC_DIR" \
  "b2://${B2_BUCKET}"
