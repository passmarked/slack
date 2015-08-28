
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

import Queue     from 'bull';
import postgres  from 'pg-promise';
import when      from 'when';
import node      from 'when/node';
import Bot       from './bot';
import db        from './db';
import createBot from './instance';
import logger    from './logger';

export default new class BotQueue {

  bots = Queue(
    process.env.PASSMARKED_SLACK_REDIS_DATABASE,
    process.env.PASSMARKED_SLACK_REDIS_PORT,
    process.env.PASSMARKED_SLACK_REDIS_HOST
  );

  tokens = db.collection('tokens');

  constructor() {
    this.bots.process(processBot);
  }

  async initialise() {

    let tokens;

    try {

      logger.info(`starting queue of bots...`);
      tokens = await node.call(::this.tokens.find, {});

      when.map(tokens, async token => {
        
        let bot  = new Bot(token.token);
        let test = await bot.test();

        if (!test.ok) {

          switch (test.error) {
            case 'invalid_auth':
            case 'account_inactive':
              logger.info(`removing invalid token ${token.token}`);
              await node.call(::this.tokens.remove, token);
              break;
          }

        } else if (test.ok) {

          logger.info(`initialising instance for ${token.token}`);
          this.add(token.token);

        }
      });

      logger.info(`queue started`);

    } catch (error) {
      logger.fatal('error initialising queue', error);
      process.exit(1);
    }
  }

  async add(token) {
    this.bots.add({ token });
  }

}

function processBot(job) {
  createBot(job.data.token);
  return Promise.resolve();
}
