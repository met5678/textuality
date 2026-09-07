#!/usr/bin/env bash

mongo_database_from_url() {
  local mongo_uri="$1"

  MONGO_URI="$mongo_uri" node -e '
    const uri = process.env.MONGO_URI || "";
    const match = uri.match(/^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?[^/]+\/([^/?]+)(?:\?.*)?$/);
    if (!match) {
      console.error("MONGO_URL must include an explicit database name, such as /textuality, before its query string.");
      process.exit(1);
    }

    let database;
    try {
      database = decodeURIComponent(match[1]);
    } catch {
      console.error("MONGO_URL contains an invalid encoded database name.");
      process.exit(1);
    }

    if (!database) {
      console.error("MONGO_URL must include an explicit database name.");
      process.exit(1);
    }

    process.stdout.write(database);
  '
}
