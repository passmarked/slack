
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

import redis  from 'redis';
import logger from './logger';

let client = redis.createClient(
  process.env.PASSMARKED_SLACK_REDIS_PORT || 6379,
  process.env.PASSMARKED_SLACK_REDIS_HOST
);

if (typeof process.env.PASSMARKED_SLACK_REDIS_PASSWORD) {
  client.auth(process.env.PASSMARKED_SLACK_REDIS_PASSWORD);
}

client.on('error', function onRedisError(err) {
  logger.error('redis error:', err);
});

export default client;
