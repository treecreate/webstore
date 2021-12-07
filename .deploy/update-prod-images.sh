#!/bin/bash

# run 'chmod u+x update-prod-images.sh' to make it executable

# Logs in to docker hub
cat .deploy/.env-files/.env.dockerhub | docker login --username kwandes --password-stdin;

# Builds the dev images
docker-compose -f .deploy/docker-compose.build.yml --profile prod build --parallel

# Publishes dev images
docker-compose -f .deploy/docker-compose.build.yml --profile prod push
