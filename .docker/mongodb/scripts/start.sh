#!/bin/bash

DELAY=10

docker compose -f ./../../../docker-compose.yml down

#Cleaning docker environment 
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)

docker compose -f ./../../../docker-compose.yml up 

echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY
