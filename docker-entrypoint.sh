#!/bin/sh
set -e
./node_modules/.bin/prisma migrate deploy
./node_modules/.bin/prisma db seed
exec node server.js
