FROM ubuntu:trusty

RUN apt-get update -y
RUN apt-get install -y git
RUN apt-get install -y nodejs
RUN apt-get install -y npm

RUN NODE_ENV=development npm install

RUN npm run build
