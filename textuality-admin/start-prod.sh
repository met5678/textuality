MONGO_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_URL" ../settings.json)
MONGO_OPLOG_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_OPLOG_URL" ../settings.json)

echo $MONGO_URL
echo $MONGO_OPLOG_URL

MONGO_URL=$MONGO_URL MONGO_OPLOG_URL=$MONGO_OPLOG_URL meteor run --settings ../settings.json --port 4100