#!/usr/bin/env bash
set -euo pipefail

DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

"$DIR/deploy-static-assets.sh"
"$DIR/deploy-galaxy.sh"
