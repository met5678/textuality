#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
REPO_ROOT=$(cd "$DIR/.." && pwd)
SETTINGS="$REPO_ROOT/settings.json"
OP_ITEM="Textuality settings.json"

if ! command -v op >/dev/null 2>&1; then
  echo "1Password CLI (op) not found." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install it with: brew install jq" >&2
  exit 1
fi

if ! op whoami >/dev/null 2>&1; then
  echo "Sign in to 1Password to continue."
  op signin
  op whoami >/dev/null
fi

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT

echo "Pulling \"${OP_ITEM}\" from 1Password..."
op document get "$OP_ITEM" --out-file "$tmp" --force

if ! jq -e . "$tmp" >/dev/null; then
  echo "1Password document is not valid JSON; leaving local settings.json unchanged." >&2
  exit 1
fi

mv "$tmp" "$SETTINGS"
trap - EXIT
chmod 600 "$SETTINGS"

echo "Wrote $SETTINGS"
