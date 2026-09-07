#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
SETTINGS="$DIR/../settings.json"

# shellcheck source=./mongo-url-utils.sh
source "$DIR/mongo-url-utils.sh"

if [[ ! -f "$SETTINGS" ]]; then
  echo "Missing settings.json at repo root. See README for the expected format." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install it with: brew install jq" >&2
  exit 1
fi

if ! command -v mongosh >/dev/null 2>&1; then
  echo "mongosh is required. Install it with: brew install mongosh" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is required." >&2
  exit 1
fi

MONGO_URL=$(jq -r '."galaxy.meteor.com".env.MONGO_URL // empty' "$SETTINGS")
MONGO_OPLOG_URL=$(jq -r '."galaxy.meteor.com".env.MONGO_OPLOG_URL // empty' "$SETTINGS")

if [[ -z "$MONGO_URL" ]]; then
  echo "settings.json is missing galaxy.meteor.com.env.MONGO_URL (admin credentials)." >&2
  exit 1
fi

PROD_DB=$(mongo_database_from_url "$MONGO_URL") || {
  echo "Refusing to configure oplog access without an explicit application database in MONGO_URL." >&2
  exit 1
}

parse_mongo_field() {
  URI="$1" FIELD="$2" node -e '
    const match = process.env.URI.match(/^mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@/);
    if (!match) {
      console.error("Could not parse username/password from MongoDB URI.");
      process.exit(1);
    }
    const creds = {
      user: decodeURIComponent(match[1]),
      pwd: decodeURIComponent(match[2]),
    };
    const field = process.env.FIELD;
    if (!(field in creds)) {
      console.error("Unknown credential field: " + field);
      process.exit(1);
    }
    process.stdout.write(creds[field]);
  '
}

build_oplog_url() {
  MONGO_URL="$1" OPLOG_USER="$2" OPLOG_PWD="$3" node -e '
    const mongoUrl = process.env.MONGO_URL;
    const match = mongoUrl.match(/^(mongodb(?:\+srv)?):\/\/([^:]+):([^@]+)@([^/?]+)(?:\/([^?]*))?(?:\?(.*))?$/);
    if (!match) {
      console.error("Could not parse MONGO_URL into an oplog connection string.");
      process.exit(1);
    }
    const protocol = match[1];
    const hosts = match[4];
    const params = new URLSearchParams(match[6] || "");
    params.set("authSource", "admin");
    const user = encodeURIComponent(process.env.OPLOG_USER);
    const pwd = encodeURIComponent(process.env.OPLOG_PWD);
    process.stdout.write(`${protocol}://${user}:${pwd}@${hosts}/local?${params.toString()}`);
  '
}

write_oplog_url() {
  local url="$1"
  local tmp
  tmp=$(mktemp)
  jq --arg url "$url" '."galaxy.meteor.com".env.MONGO_OPLOG_URL = $url' "$SETTINGS" > "$tmp"
  mv "$tmp" "$SETTINGS"
}

if [[ -z "$MONGO_OPLOG_URL" ]]; then
  OPLOG_USER="oploguser"
  OPLOG_PWD=$(node -e 'process.stdout.write(require("crypto").randomBytes(18).toString("base64url"))')
  MONGO_OPLOG_URL=$(build_oplog_url "$MONGO_URL" "$OPLOG_USER" "$OPLOG_PWD")
  write_oplog_url "$MONGO_OPLOG_URL"
  echo "Wrote galaxy.meteor.com.env.MONGO_OPLOG_URL for user '${OPLOG_USER}' to settings.json"
else
  OPLOG_USER=$(parse_mongo_field "$MONGO_OPLOG_URL" user)
  OPLOG_PWD=$(parse_mongo_field "$MONGO_OPLOG_URL" pwd)
fi

echo "Application database: $PROD_DB"
echo "Ensuring oplog user '${OPLOG_USER}' exists (read on local)..."

export OPLOG_USER OPLOG_PWD
mongosh "$MONGO_URL" --quiet --eval '
  const user = process.env.OPLOG_USER;
  const pwd = process.env.OPLOG_PWD;
  if (!user || !pwd) {
    throw new Error("OPLOG_USER and OPLOG_PWD must be set");
  }

  const admin = db.getSiblingDB("admin");
  const roles = [{ role: "read", db: "local" }];
  const info = admin.runCommand({ usersInfo: { user, db: "admin" } });
  const exists = Array.isArray(info.users) && info.users.length > 0;

  if (!exists) {
    admin.createUser({ user, pwd, roles });
    print("Created oplog user " + user);
  } else {
    admin.updateUser(user, { pwd, roles });
    print("Updated oplog user " + user);
  }
'

echo "Verifying oplog access as ${OPLOG_USER}..."
mongosh "$MONGO_OPLOG_URL" --quiet --eval '
  const doc = db.getSiblingDB("local").getCollection("oplog.rs").findOne();
  if (!doc) {
    throw new Error("Connected as the oplog user but local.oplog.rs is empty or inaccessible");
  }
  print("Oplog user can read local.oplog.rs");
'

echo "Done. Meteor can use galaxy.meteor.com.env.MONGO_OPLOG_URL from settings.json."
