
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

import Queue    from 'bull';
import when     from 'when';
import node     from 'when/node';
import Bot      from '../bot';
import logger   from '../logger';
import tokensDB from '../collections/tokens';

let cleanup = Queue(
  process.env.PASSMARKED_SLACK_REDIS_DATABASE,
  process.env.PASSMARKED_SLACK_REDIS_PORT,
  process.env.PASSMARKED_SLACK_REDIS_HOST
);

cleanup.process(cleanupJob);

function invalid(connection) {
  return !connection.ok
      && (connection.error === 'invalid_auth'
      || connection.error === 'account_inactive');
}

function cleanupJob(job) {
  logger.info(`running scheduled invalid token cleanup`);
  return when.map(node.call(::tokensDB.find, {}), token => {
    let bot = new Bot(token.token);
    bot.test()
      .then(connection => {
        if (invalid(connection)) {
          logger.info(`removing invalid token ${token._id}`);
          return node.call(::tokensDB.remove, token);
        }
      })
  });
}

export default cleanup;
