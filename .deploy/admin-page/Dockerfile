
## Build container START

# Lightweight environment with node pre-installed
FROM node:alpine AS builder

# Directory to work in the container
WORKDIR /app

# Copy package.json to root of container
COPY package.json .

# Set required ENVs
ARG ENV=dev
ARG LOG_LEVEL=notice

# Run npm install inside container
RUN npm install --loglevel ${loglevel} --only=${ENV}

# Copy all files different to local machine to container
# Uses caching to prevent copying ALL files if only some parts changed
COPY . .

# Execute this command in the docker container
# BAK CMD ["npm", "run", "build" "webstore:admin:prod"]
RUN npm run build webstore:admin:prod 

## Build container END



## runtime environment START

FROM nginx:alpine

# Directory to work in the container
WORKDIR /app

# Copy nginx config to nginx container
COPY .deploy/admin-page/nginx.conf /etc/nginx/nginx.conf

# Copy build files to nginx container
COPY --from=builder /app/dist/apps/admin-page /usr/share/nginx/htm

# Execute nginx on container to launch application
CMD ["nginx", "-g", "'daemon off;'"]

## runtime environment END