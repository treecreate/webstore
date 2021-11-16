# To build this dockerfile use a command similar to this:
# docker build -t <image-name> -f ./.deploy/admin-page/Dockerfile .

###### Build container START

# Lightweight environment with node pre-installed
FROM node:lts-alpine3.14 AS builder

# Directory to work in the container
WORKDIR /app

# Copy package.json to the root of container
COPY package.json .

# Set required ENVs
ARG ENV=dev
ARG LOG_LEVEL=warn

# Run npm install inside container
# --legacy-peer-deps This line is currently required for the dependencies to install
# Should be tested once in a while and removed when possible, as package maintainers
#   updated their dependencies to the new automated system.
RUN if [[ $ENV == "prod" ]] ; \
	then npm install --legacy-peer-deps --loglevel ${LOG_LEVEL} --only=prod;	\
	else npm install --legacy-peer-deps --loglevel ${LOG_LEVEL};			\
    fi

# Copy all files different to local machine to container
# Uses caching to prevent copying ALL files if only some parts changed
COPY ./assets ./assets
COPY ./libs ./libs
COPY ./apps ./apps
COPY nx.json ./nx.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY workspace.json ./workspace.json

# Install NX since it is not installed in our repository
# If we skip this step the prod build fails, as it is not a prod dependency
RUN npm install nx

# Not required as such, but there are lots of translation warnings from angular 
#   to js. This makes those issues go away and I advise we keep it there 
RUN npm install @angular/cli

# Execute this command in the docker container
RUN npm run build:webstore:${ENV}

###### Build container END

###### runtime environment START

FROM nginx:alpine

# Directory to work in the container
WORKDIR /app

# Copy nginx config to nginx container
COPY .deploy/webstore/nginx.conf /etc/nginx/nginx.conf

# Copy build files to nginx container
COPY --from=builder /app/dist/apps/webstore /usr/share/nginx/html

# Execute nginx on container to launch application
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/en-US/assets/env.template.js > /usr/share/nginx/html/en-US/assets/env.js && envsubst < /usr/share/nginx/html/dk/assets/env.template.js > /usr/share/nginx/html/dk/assets/env.js && exec nginx -g 'daemon off;'"]

###### runtime environment END
