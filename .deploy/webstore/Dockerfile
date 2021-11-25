###### Build container webstore START

# Lightweight environment with node pre-installed
FROM node:lts-alpine3.14 AS builder

# Directory to work in the container
WORKDIR /app

# Set required ENVs. If they are bassed as --build-args these will be overwritten
ARG LOG_LEVEL=notice
ARG ENV=dev

# Copy package.json to the root of the WORKDIR
COPY package.json ./

# Run npm install inside container
# --legacy-peer-deps This line is currently required for the dependencies to install
# Should be tested once in a while and removed when possible, as package maintainers
#   updated their dependencies to the new automated system.
RUN if [[ $ENV == "prod" ]] ;													\
	then npm install --legacy-peer-deps --loglevel ${LOG_LEVEL} --only=prod;	\
	else npm install --legacy-peer-deps --loglevel ${LOG_LEVEL};				\
    fi

# Copy all files different to local machine to container
# Uses caching to prevent copying ALL files if only some parts changed
COPY ./assets ./assets
COPY ./libs ./libs
COPY ./apps ./apps
COPY nx.json ./nx.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY workspace.json ./workspace.json

# Execute this command in the docker container
RUN npm run build:webstore:${ENV}

###### Build container END

###### runtime environment START

# Lightweight environment with node nginx-installed
FROM nginx:alpine

# Directory to work in the container
WORKDIR /app

# Copy nginx config to nginx container
COPY .deploy/webstore/nginx.conf /etc/nginx/nginx.conf
# Copy build files to nginx container
COPY --from=builder /app/dist/apps/webstore /usr/share/nginx/html

# https://pumpingco.de/blog/environment-variables-angular-docker/
# When the container starts, replace the env.js with values from environment variables via package.json scripts

# Execute nginx on container to launch application after setting angular ENVs
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/en-US/assets/env.template.js > /usr/share/nginx/html/en-US/assets/env.js && envsubst < /usr/share/nginx/html/dk/assets/env.template.js > /usr/share/nginx/html/dk/assets/env.js && exec nginx -g 'daemon off;'"]
