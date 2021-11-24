FROM node:lts-alpine3.14 AS builder

WORKDIR /app

COPY package*.json ./

ARG LOG_LEVEL=notice
ARG ENV=dev

RUN if [[ $ENV == "prod" ]] ; \
	then npm install --legacy-peer-deps --loglevel ${LOG_LEVEL} --only=prod;	\
	else npm install --legacy-peer-deps --loglevel ${LOG_LEVEL};				\
    fi

COPY ./assets ./assets
COPY ./libs ./libs
COPY ./apps ./apps
COPY nx.json ./nx.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY workspace.json ./workspace.json

RUN npm run build:webstore:${ENV}

FROM nginx:alpine
WORKDIR /app
COPY .deploy/webstore/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/apps/webstore /usr/share/nginx/html

# https://pumpingco.de/blog/environment-variables-angular-docker/
# When the container starts, replace the env.js with values from environment variables via package.json scripts

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/en-US/assets/env.template.js > /usr/share/nginx/html/en-US/assets/env.js && envsubst < /usr/share/nginx/html/dk/assets/env.template.js > /usr/share/nginx/html/dk/assets/env.js && exec nginx -g 'daemon off;'"]
