#!/bin/bash

cd "$(dirname $0)/.."
docker compose exec wordlelife /app/external/guest_update_db.sh
docker cp wordlelife:/app/database/database.db database/database.db
docker cp wordlelife:/app/database/database_backup.db database/database_backup.db