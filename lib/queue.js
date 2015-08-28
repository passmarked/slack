
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
import node      from 'when/node';
import db        from './db';
import createBot from './instance';

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

  async add(token) {
    this.bots.add({ token });
    return (
      await node.call(::this.tokens.save, { token })
    );
  }

}

function processBot(job) {
  createBot(job.data.token);
  return Promise.resolve();
}
