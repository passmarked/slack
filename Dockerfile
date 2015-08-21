# Base image for ubuntu 14.04
FROM gcr.io/passmarked/base.node:latest

# globally install items
RUN npm install babel coffee-script gulp -g

# run install development NPM
RUN NODE_ENV=development npm install

# do a NPM install
RUN npm run build
