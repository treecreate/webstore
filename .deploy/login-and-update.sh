#!/bin/sh

# this file requires the permissions: -rwxr-xr-x aka chmod 755

docker login -u kwandes -p "$(<~/.deploy/.env-files/.env.dockerhub)"

docker-compose -f ~/.deploy/docker-compose-run.yml --profile $1 pull

docker-compose -f ~/.deploy/docker-compose-run.yml --profile $1 $2 $3 $4
