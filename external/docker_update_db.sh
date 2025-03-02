#!/bin/bash

cd "$(dirname $0)/.."
python3 external/db_scraping.py

if [ $? -eq 0 ]; then
    echo "Database scraping completed successfully"

    cp database/database.db database/database_backup.db
    mv database/database_new.db database/database.db

    echo "Database updated successfully"
    exit 0
else
    echo "Error occurred during database scraping"

    [ -f database/database_new.db ] && rm database/database_new.db

    exit 1
fi