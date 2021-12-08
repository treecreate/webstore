#!/bin/bash

# run 'chmod u+x update-prod-images.sh' to make it executable
# This must be run from project root as the paths are based on that
# The dockerhub token must be present in .deploy/.env-files/.env.dockerhub
#  or the execution will fail as the credentials are required to push to 
#  a private repository on dockerhub

# Example usage: .deploy/update-prod-images.sh

# Logs in to docker hub
cat .deploy/.env-files/.env.dockerhub | docker login --username kwandes --password-stdin;

# Builds the dev images
docker-compose -f .deploy/docker-compose.build.yml --profile prod build --parallel

# Publishes dev images
docker-compose -f .deploy/docker-compose.build.yml --profile prod push
