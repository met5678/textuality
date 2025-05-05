DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
MONGO_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_URL" "$DIR/../settings.json")
MONGO_OPLOG_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_OPLOG_URL" "$DIR/../settings.json")

mongosh $MONGO_URL