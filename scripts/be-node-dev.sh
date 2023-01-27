#!/bin/sh

echo "Install bash and execute 'wait-for-it.sh' script"
./scripts/wait-for-it.sh $DB_HOST:3306 --timeout=30 --strict -- echo "mysql up and running"

npm run dev
