#!/bin/bash

# Get the first non-localhost IP address
IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)

# Set ROOT_URL to use the IP address
export ROOT_URL="http://$IP_ADDRESS:4002"

MONGO_URL="mongodb://localhost:4001/meteor"
MONGO_OPLOG_URL="mongodb://localhost:4001/local"

echo $MONGO_URL
echo $MONGO_OPLOG_URL

meteor npm install
ROOT_URL=$ROOT_URL DB_ENV=local MONGO_URL=$MONGO_URL MONGO_OPLOG_URL=$MONGO_OPLOG_URL meteor --port=4002 --settings ../settings.json