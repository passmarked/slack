FROM ubuntu:trusty

MAINTAINER Passmarked <devops@passmarked.com>

RUN apt-get update && apt-get install -y \
  nodejs \
  nodejs-legacy \
  npm

RUN npm i pm2 -g

ADD package.json /tmp/package.json

RUN cd /tmp \
  && NODE_ENV=development npm install

RUN mkdir -p /app \
  && cp -a /tmp/node_modules /app

ADD . /app

RUN cd /app \
  && npm run build

WORKDIR /app

EXPOSE 5000
EXPOSE 8080

CMD ["npm", "start"]
