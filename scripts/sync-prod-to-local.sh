while true; do
    read -p "Is the local admin running ('npm start' in textuality-admin)? (y/n): " yn
    case $yn in
        [Yy]* ) echo "Great, we'll sync the prod DB to it"; break;;
        [Nn]* ) echo "Well, start it!"; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
MONGO_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_URL" "$DIR/../settings.json")
MONGO_OPLOG_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_OPLOG_URL" "$DIR/../settings.json")

echo "Dumping prod textuality DB"
mongodump --uri $MONGO_URL -d test -o "$DIR/../dump"
echo "Restoring to local textuality DB"
mongorestore --uri mongodb://127.0.0.1:4001/meteor --drop "$DIR/../dump/test"
rm -r "$DIR/../dump"
echo "Done!"
