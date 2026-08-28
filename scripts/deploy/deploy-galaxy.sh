#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
REPO_ROOT=$(cd "$DIR/../.." && pwd)
CLIENT_DIR="$REPO_ROOT/textuality-client"
SETTINGS="$REPO_ROOT/settings.json"

if [[ ! -f "$SETTINGS" ]]; then
  echo "Missing settings.json at repo root. See README for the expected format." >&2
  exit 1
fi

cd "$CLIENT_DIR"

# Assets live in B2, so hide public/ from the Meteor build
mv public public-local
trap 'mv public-local public' EXIT

meteor deploy textuality --settings "$SETTINGS" --plan essentials --owner goddess
# Args for reference:
# --free	Deploy on the free plan
# --plan [plan]	Set plan: professional, essentials, or free
# --mongo	Provision a free shared MongoDB
# --container-size [size]	Set container size
# --settings [file]	Pass a JSON settings file
# --cache-build	Reuse build if git commit is unchanged (Meteor 1.11+)
# --debug	Deploy without minifying code
# --no-wait	Exit after upload, don't wait for deployment
# --deploy-polling-timeout [ms]	Deployment wait timeout (default: 15 min)
# --owner [user/org]	Deploy under a specific account
# --delete, -D
