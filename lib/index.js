
// Copyright 2015 Passmarked Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

require('dotenv').load({ silent: true });

import os       from 'os';
import node     from 'when/node';
import server   from './server';
import logger   from './logger';
import bots     from './queue';
import common   from './common';
import cleanup  from './jobs/cleanup';
import tokensDB from './collections/tokens';

const PROD = process.env.NODE_ENV === 'production';
const PORT = PROD ? 8080 : 5000;

setInterval(processLogger, 15000);

setInterval(function cleanupJob() {
  node.call(::tokensDB.find, {}).then(tokens => cleanup.add({ tokens }));
}, common.times['six hours']);

server.listen(PORT, () => {
  logger.info(
    `Server is now listening on ${os.hostname()}:${PORT}`
  );
});

bots.initialise();

function processLogger() {
  let startTime = Date.now();
  setImmediate(logData.bind(this, startTime));
}

function logData(startTime) {
  let data    = process.memoryUsage();
  data.uptime = process.uptime();
  data.pid    = process.pid;
  data.tags   = ['process-metrics'];
  data.lag    = Date.now() - startTime;
  logger.info(
    data,
    'process.pid: %d heapUsed: %d heapTotal: %d rss: %d uptime %d lag: %d',
    data.pid,
    data.heapUsed,
    data.heapTotal,
    data.rss,
    data.uptime,
    data.lag
  );
}
