#!/bin/sh

# this file requires the permissions: -rwxr-xr-x aka chmod 755
# It is meant to be executed on the deployment server.
# If the file '.env.dockerhub' is not present it will fail

# The first param is always the profile, and everything after it is normal
#  docker-compose commands.
# The profile options currently are ["prod", "dev"] 

# Example usage: scripts/login-and-update.sh dev up -d
# Example usage: scripts/login-and-update.sh prod down

# Logs in to DockerHub, creates a subshell to read the dockerhub file and
#  returns it to the executing shell
docker login -u kwandes -p "$(<~/.deploy/.env-files/.env.dockerhub)"

# Pulls the newest images from DockerHub
docker-compose -f ~/.deploy/docker-compose-run.yml --profile $1 pull

# Replace any updated images
docker-compose -f ~/.deploy/docker-compose-run.yml --profile $1 $2 $3 $4
