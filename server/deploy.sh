#!/bin/bash

cd /root/SERVERS/bizzy-network/server || exit

git pull origin main

docker compose build
docker compose up
