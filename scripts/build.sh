#!/bin/bash

sudo apt-get update

sudo apt-get -y install build-essential redis-server

wget http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz

sudo tar -zxf node-v0.12.7-linux-x64.tar.gz

sudo mv node-v0.12.7-linux-x64/ /opt/node/
sudo ln -s /opt/node/bin/node /usr/bin/node
sudo ln -s /opt/node/bin/npm /usr/bin/npm

cd /vagrant
sudo npm install
sudo npm run dev
