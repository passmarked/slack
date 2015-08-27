#!/bin/bash

# Copyright 2015 Passmarked Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# update and install packages
apt-get update && apt-get -y install \
  build-essential \
  tcl8.5

# download and install node.js
wget http://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz
tar -zxf node-v0.12.7-linux-x64.tar.gz
mv node-v0.12.7-linux-x64/ /opt/node/
ln -s /opt/node/bin/node /usr/bin/node
ln -s /opt/node/bin/npm /usr/bin/npm

# download and install redis
wget http://download.redis.io/releases/redis-stable.tar.gz
tar -xvzf redis-stable.tar.gz && cd redis-stable
make
make test
make install
./utils/install_server.sh
cd ~

# run processes
service redis_6379 start
