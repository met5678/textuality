#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
SETTINGS="$DIR/../settings.json"

# shellcheck source=./mongo-url-utils.sh
source "$DIR/mongo-url-utils.sh"

[[ -f "$SETTINGS" ]] || {
  echo "Missing settings.json at repo root." >&2
  exit 1
}

MONGO_URL=$(jq -er '."galaxy.meteor.com".env.MONGO_URL | select(type == "string" and length > 0)' "$SETTINGS") || {
  echo "settings.json is missing galaxy.meteor.com.env.MONGO_URL." >&2
  exit 1
}
PROD_DB=$(mongo_database_from_url "$MONGO_URL") || exit 1

echo "Connecting to production database: $PROD_DB"
exec mongosh "$MONGO_URL"
