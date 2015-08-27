
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
import createBot from './instance';

const pg = postgres();

export default new class BotQueue {

  bots = Queue(
    process.env.PASSMARKED_SLACK_REDIS_DATABASE,
    process.env.PASSMARKED_SLACK_REDIS_PORT,
    process.env.PASSMARKED_SLACK_REDIS_HOST
  );

  db = pg({
    host     : process.env.PASSMARKED_SLACK_POSTGRES_HOST,
    port     : process.env.PASSMARKED_SLACK_POSTGRES_PORT,
    database : process.env.PASSMARKED_SLACK_POSTGRES_DATABASE,
    user     : process.env.PASSMARKED_SLACK_POSTGRES_USER,
    password : process.env.PASSMARKED_SLACK_POSTGRES_PASSWORD
  });

  constructor() {
    this.bots.process(processBot);
  }

  async add(token, bot) {
    this.bots.add({ token, bot });
    return await this.db.none(
      'insert into tokens(token, bot) values($1, $2)',
      [token, bot]
    );
  }

}

function processBot(job) {
  createBot(job.data.token, job.data.bot);
  return Promise.resolve();
}
