#!/bin/bash

cd /root/SERVERS/thedaotool-staging/server || exit

git fetch origin
git reset --hard origin/staging

docker compose -p thedaotool-staging build
docker compose -p thedaotool-staging up -d --remove-orphans

exit 0
