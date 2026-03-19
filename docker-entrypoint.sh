#!/bin/sh
set -e

# Use npx to ensure prisma is found correctly in the container environment
npx prisma migrate deploy
npx prisma db seed

# Next.js standalone output puts the server at the root of the build
exec node server.js
