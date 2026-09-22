#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
REPO_ROOT="$DIR/.."
SETTINGS="$REPO_ROOT/settings.json"
LOCAL_MONGO_URL="${LOCAL_MONGO_URL:-mongodb://127.0.0.1:4001/meteor}"
LOCAL_DB="meteor"

# shellcheck source=./mongo-url-utils.sh
source "$DIR/mongo-url-utils.sh"

fail() {
  echo "Error: $*" >&2
  exit 1
}

for command_name in jq node mongodump mongorestore; do
  command -v "$command_name" >/dev/null 2>&1 || fail "Missing required command: $command_name. Run 'npm run local-setup'."
done

[[ -f "$SETTINGS" ]] || fail "Missing settings.json at the repo root."

MONGO_URL=$(jq -er '."galaxy.meteor.com".env.MONGO_URL | select(type == "string" and length > 0)' "$SETTINGS") || \
  fail "settings.json is missing galaxy.meteor.com.env.MONGO_URL."
PROD_DB=$(mongo_database_from_url "$MONGO_URL") || fail "Refusing to sync without an explicit production database."

echo "This will replace the local $LOCAL_DB database with production $PROD_DB."
read -r -p "Is the local admin running ('npm start' in textuality-admin)? (y/n): " confirmation
case "$confirmation" in
  [Yy]*) ;;
  *) fail "Start the local admin, then run this command again." ;;
esac

TEMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/textuality-prod-to-local.XXXXXX")
cleanup() {
  rm -rf -- "$TEMP_DIR"
}
trap cleanup EXIT

echo "Dumping production $PROD_DB database..."
mongodump \
  --uri "$MONGO_URL" \
  --db "$PROD_DB" \
  --archive="$TEMP_DIR/prod.archive"

[[ -s "$TEMP_DIR/prod.archive" ]] || fail "The production database dump is empty; local was not changed."

echo "Restoring production data to local $LOCAL_DB database..."
mongorestore \
  --uri "$LOCAL_MONGO_URL" \
  --archive="$TEMP_DIR/prod.archive" \
  --nsInclude "$PROD_DB.*" \
  --nsFrom "$PROD_DB.*" \
  --nsTo "$LOCAL_DB.*" \
  --drop \
  --stopOnError

echo "Production $PROD_DB database successfully synced to local $LOCAL_DB."
