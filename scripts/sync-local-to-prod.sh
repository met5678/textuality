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

document_count() {
  local uri="$1"
  local database="$2"
  local count

  count=$(TARGET_DB="$database" mongosh "$uri" --quiet --eval '
    const targetDb = db.getSiblingDB(process.env.TARGET_DB);
    print(targetDb.getCollectionNames()
      .filter(name => !name.startsWith("system."))
      .reduce((total, name) => total + targetDb.getCollection(name).countDocuments({}), 0));
  ')
  [[ "$count" =~ ^[0-9]+$ ]] || fail "Could not count documents in the $database database."
  printf '%s' "$count"
}

for command_name in jq node mongodump mongorestore mongosh; do
  command -v "$command_name" >/dev/null 2>&1 || fail "Missing required command: $command_name. Run 'npm run local-setup'."
done

[[ -f "$SETTINGS" ]] || fail "Missing settings.json at the repo root."

MONGO_URL=$(jq -er '."galaxy.meteor.com".env.MONGO_URL | select(type == "string" and length > 0)' "$SETTINGS") || \
  fail "settings.json is missing galaxy.meteor.com.env.MONGO_URL."
PROD_DB=$(mongo_database_from_url "$MONGO_URL") || fail "Refusing to sync without an explicit production database."

strategy="${1:-}"
if [[ -z "$strategy" ]]; then
  echo "How should local data be pushed to production?"
  echo "  1) merge   Upsert local documents by _id; keep production-only documents."
  echo "  2) replace Drop the production database and restore the complete local dump."
  read -r -p "Choose 1 or 2: " choice
  case "$choice" in
    1) strategy="merge" ;;
    2) strategy="replace" ;;
    *) fail "Please choose 1 or 2." ;;
  esac
fi

case "$strategy" in
  merge)
    command -v mongoexport >/dev/null 2>&1 || fail "Missing required command: mongoexport. Run 'npm run local-setup'."
    command -v mongoimport >/dev/null 2>&1 || fail "Missing required command: mongoimport. Run 'npm run local-setup'."
    echo
    echo "MERGE will write local documents to production and keep production-only documents."
    echo "For matching _id values, local fields overwrite production fields."
    ;;
  replace|override|dump)
    strategy="replace"
    echo
    echo "WARNING: REPLACE will drop the entire production database before restoring local."
    echo "All production-only collections and documents will be permanently deleted."
    read -r -p "Type REPLACE to acknowledge this destructive operation: " replace_confirmation
    case "$replace_confirmation" in
      [Rr][Ee][Pp][Ll][Aa][Cc][Ee]) ;;
      *) fail "Replace cancelled." ;;
    esac
    ;;
  *)
    fail "Unknown strategy '$strategy'. Use 'merge' or 'replace'."
    ;;
esac

echo
echo "Source:      local MongoDB ($LOCAL_DB)"
echo "Destination: PRODUCTION MongoDB ($PROD_DB)"
echo "Strategy:    $strategy"
read -r -p "Type PROCEED to continue: " confirmation
case "$confirmation" in
  [Pp][Rr][Oo][Cc][Ee][Ee][Dd]) ;;
  *) fail "Production sync cancelled." ;;
esac

TEMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/textuality-local-to-prod.XXXXXX")
cleanup() {
  rm -rf -- "$TEMP_DIR"
}
trap cleanup EXIT

echo "Checking local and production database connections..."
mongosh "$LOCAL_MONGO_URL" --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null
mongosh "$MONGO_URL" --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null

if [[ "$strategy" == "replace" ]]; then
  local_document_count=$(document_count "$LOCAL_MONGO_URL" "$LOCAL_DB")
  echo "Dumping local Textuality database..."
  mongodump \
    --uri "$LOCAL_MONGO_URL" \
    --db "$LOCAL_DB" \
    --archive="$TEMP_DIR/local.archive"

  [[ -s "$TEMP_DIR/local.archive" ]] || fail "The local database dump is empty; production was not changed."

  echo "Validating the local dump before changing production..."
  mongorestore \
    --uri "$MONGO_URL" \
    --archive="$TEMP_DIR/local.archive" \
    --nsInclude "$LOCAL_DB.*" \
    --nsFrom "$LOCAL_DB.*" \
    --nsTo "$PROD_DB.*" \
    --dryRun >/dev/null

  echo "Replacing production Textuality database..."
  TARGET_DB="$PROD_DB" mongosh "$MONGO_URL" --quiet --eval \
    'db.getSiblingDB(process.env.TARGET_DB).dropDatabase()' >/dev/null
  mongorestore \
    --uri "$MONGO_URL" \
    --archive="$TEMP_DIR/local.archive" \
    --nsInclude "$LOCAL_DB.*" \
    --nsFrom "$LOCAL_DB.*" \
    --nsTo "$PROD_DB.*" \
    --stopOnError

  production_document_count=$(document_count "$MONGO_URL" "$PROD_DB")
  if [[ "$production_document_count" -ne "$local_document_count" ]]; then
    fail "Restore verification failed: local has $local_document_count documents but production has $production_document_count."
  fi
  echo "Verified $production_document_count document(s) in production."
else
  echo "Reading local collection list..."
  collections_json=$(mongosh "$LOCAL_MONGO_URL" --quiet --eval \
    'JSON.stringify(db.getCollectionNames().filter(name => !name.startsWith("system.")))')

  collection_count=$(printf '%s' "$collections_json" | jq -e 'if type == "array" then length else error("invalid collection list") end') || \
    fail "Could not read the local collection list."

  if [[ "$collection_count" -eq 0 ]]; then
    echo "The local database has no collections; nothing to merge."
    exit 0
  fi

  echo "Merging $collection_count local collection(s) into production..."
  export_index=0
  while IFS= read -r collection; do
    export_index=$((export_index + 1))
    export_file="$TEMP_DIR/collection-$export_index.json"
    echo "  Merging $collection"
    mongoexport \
      --uri "$LOCAL_MONGO_URL" \
      --db "$LOCAL_DB" \
      --collection "$collection" \
      --jsonFormat canonical \
      --out "$export_file"
    mongoimport \
      --uri "$MONGO_URL" \
      --db "$PROD_DB" \
      --collection "$collection" \
      --mode merge \
      --upsertFields _id \
      --file "$export_file"
  done < <(printf '%s' "$collections_json" | jq -r '.[]')
fi

echo "Local database successfully synced to production using the $strategy strategy."
