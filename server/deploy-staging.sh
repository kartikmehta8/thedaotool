#!/bin/bash

cd /root/SERVERS/thedaotool-staging/server || exit

git fetch origin
git reset --hard origin/staging

docker compose build
docker compose up -d

exit 0
