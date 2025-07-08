#!/bin/bash

cd /root/SERVERS/bizzy-network/server || exit

git fetch origin
git reset --hard origin/main

docker compose -p thedaotool-prod build
docker compose -p thedaotool-prod up -d --remove-orphans

exit 0
