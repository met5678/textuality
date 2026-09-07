#!/usr/bin/env bash
set -euo pipefail

# Homebrew core — no MongoDB tap required.
# jq: read/write settings.json (sync-prod-to-local, setup-oplog, mongosh-prod)
# ngrok: public tunnel to local Meteor so Twilio can POST inbound texts
# mongosh: MongoDB shell for prod queries (mongosh-prod) and setup-oplog.sh
# b2-tools: Backblaze B2 CLI for object storage
brew install jq ngrok mongosh b2-tools

# mongodb-database-tools: dump, restore, export, and import for the DB sync scripts.
# Lives in MongoDB's third-party tap; trust only this formula, not the whole tap.
# Does not install a local mongod — Meteor already runs one internally.
brew tap mongodb/brew
brew trust --formula mongodb/brew/mongodb-database-tools
brew install mongodb-database-tools
