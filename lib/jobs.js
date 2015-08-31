
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

import Agenda   from 'agenda';
import when     from 'when';
import node     from 'when/node';
import Bot      from './bot';
import logger   from './logger';
import tokensDB from './collections/tokens';

export default function scheduledJobs() {

  let agenda = new Agenda({
    db: {
      address: process.env.PASSMARKED_SLACK_MONGO_DB_URL
    }
  });

  agenda.define(
    'delete invalid tokens',
    async function deleteTokens(job, done) {

      let tokens;

      try {

        logger.info(`running scheduled job for token cleanup...`);

        tokens = await node.call(::tokensDB.find, {});

        await when.map(tokens, async token => {

          let bot  = new Bot(token.token);
          let test = await bot.test();

          if (!test.ok) {

            switch (test.error) {
              case 'invalid_auth':
              case 'account_inactive':
                logger.info(`removing invalid token ${token.token}`);
                await node.call(::tokensDB.remove, token);
                break;
            }

          }
        });

        logger.info(`job complete`);
        return done();

      } catch (error) {
        return logger.error(
          'an error occurred in job "delete invalid tokens":',
          error
        );
      }
    }
  );

  agenda.every('1 hour', 'delete invalid tokens');

  agenda.start();

};
