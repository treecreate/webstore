# To build this dockerfile use a command similar to this:
# docker build -t <image-name> -f ./.deploy/admin-page/Dockerfile .

###### Build container admin-page START

# Lightweight environment with node pre-installed
FROM node:lts-alpine3.14 AS builder

# Directory to work in the container
WORKDIR /app

# Set required ENVs. If they are bassed as --build-args these will be overwritten
ARG ENV=dev
ARG LOG_LEVEL=warn

# Copy package.json to the root of the WORKDIR
COPY package.json ./

# Run npm install inside container
# --legacy-peer-deps This line is currently required for the dependencies to install
# Should be tested once in a while and removed when possible, as package maintainers
#   updated their dependencies to the new automated system.
RUN if [[ $ENV == "prod" ]] ;	\
	then npm install --legacy-peer-deps --loglevel ${LOG_LEVEL} --only=prod;	\
	else npm install --legacy-peer-deps --loglevel ${LOG_LEVEL};				\
    fi

# Copy all files different to local machine to container
# Uses caching to prevent copying ALL files if only some parts changed
COPY nx.json ./nx.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY workspace.json ./workspace.json
COPY ./assets ./assets
COPY ./libs ./libs
COPY ./apps/admin-page ./apps/admin-page

# Execute this command in the docker container
RUN npm run build:admin:${ENV}

###### Build container END

###### runtime environment START

FROM nginx:alpine

# Directory to work in the container
WORKDIR /app

# Copy nginx config to nginx container
COPY .deploy/admin-page/nginx.conf /etc/nginx/nginx.conf

# Copy build files to nginx container
COPY --from=builder /app/dist/apps/admin-page /usr/share/nginx/html

# Execute nginx on container to launch application
CMD [ "/bin/sh", "-c", "exec nginx -g \"daemon off;\""]

###### runtime environment END
