#!/bin/sh

ec2ip="54.175.160.234"
port="3001"

ssh ubuntu@$ec2ip "mongodump -h 127.0.0.1 --port 27017 -d textuality"
scp -r ubuntu@$ec2ip:~/dump ./dump
mongorestore -h 127.0.0.1 --port $port -d meteor dump/textuality
rm -r dump
echo "Done copying"