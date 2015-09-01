
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

function cleanupJob(job) {
  logger.info(`running scheduled invalid token cleanup`);
  return when.map(job.data.tokens, async token => {
    let bot  = new Bot(token);
    let test = await bot.test();
    if (!test.ok) {
      switch (test.error) {
        case 'invalid_auth':
        case 'account_inactive':
          logger.info(`removing invalid token ${token.token}`);
          return await node.call(::tokensDB.remove, token);
          break;
      }
    }
  });
}

cleanup.process(cleanupJob);

export default cleanup;
