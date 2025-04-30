#!/bin/bash

# Get the first non-localhost IP address
IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)

# Set ROOT_URL to use the IP address
export ROOT_URL="http://$IP_ADDRESS:4102"

MONGO_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_URL" ../settings.json)
MONGO_OPLOG_URL=$(jq -r ".[\"galaxy.meteor.com\"].env.MONGO_OPLOG_URL" ../settings.json)

echo $MONGO_URL
echo $MONGO_OPLOG_URL

meteor npm install
ROOT_URL=$ROOT_URL DB_ENV=prod MONGO_URL=$MONGO_URL MONGO_OPLOG_URL=$MONGO_OPLOG_URL meteor run --settings ../settings.json --port 4102