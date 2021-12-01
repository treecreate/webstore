#!/bin/bash


# Logs in to docker hub
cat .deploy/.env-files/.env.dockerhub | docker login --username kwandes --password-stdin;

# Builds the dev images
docker-compose -f .deploy/docker-compose-build.yml --profile dev build --parallel

# Publishes dev images
docker-compose -f .deploy/docker-compose-build.yml --profile dev push
