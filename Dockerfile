FROM ubuntu:trusty

MAINTAINER Passmarked <devops@passmarked.com>

RUN apt-get update && apt-get install -y \
  curl \
  nodejs \
  nodejs-legacy \
  npm

RUN npm i pm2 -g

ADD package.json /tmp/package.json

RUN cd /tmp \
  && npm install

RUN mkdir -p /dist \
  && cp -a /tmp/node_modules /dist

ADD . /dist

WORKDIR /dist

ENV NODE_ENV production

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
