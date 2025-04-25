#!/bin/bash

cd /root/SERVERS/bizzy-network/server || exit

git fetch origin
git reset --hard origin/main

docker compose build
docker compose up -d
