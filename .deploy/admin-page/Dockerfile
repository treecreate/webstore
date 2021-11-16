# To build this dockerfile use a command similar to this:
# docker build -t <image-name> -f ./.deploy/admin-page/Dockerfile .

###### Build container START

# Lightweight environment with node pre-installed
FROM node:lts-alpine3.14 AS builder

# Directory to work in the container
WORKDIR /app

# Copy package.json to root of container
COPY package.json .

# Set required ENVs
ARG ENV=dev
ARG LOG_LEVEL=warn

# Run npm install inside container
# BAK RUN npm install --loglevel ${LOG_LEVEL} --only=${ENV}
RUN if [[ $ENV == "prod" ]] ; \
	then npm install --loglevel ${LOG_LEVEL} --only=prod;	\
	else npm install --loglevel ${LOG_LEVEL};		\
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
# If we skip this step the prod build fails, as it is not a prod dependecy
RUN npm install nx

# Execute this command in the docker container
# BAK CMD ["npm", "run", "build" "webstore:admin:prod"]
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

