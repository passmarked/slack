
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

import Bot    from './bot';
import logger from './logger';

export default async function instance(token) {

  let bot = new Bot(token);

  try {

    await bot.connect();

    bot.on('message', async message => {
      if (message.type === 'message') {
        if (message.text === 'tell me a joke') {
          await bot.sendMessage({
            channel: message.channel,
            text: 'Q: What did the barman say when the horse walked in?\nA: "Why the long face?"'
          })
        }
      }
    });

  } catch (error) {

    logger.error(`bot error occurred on ${token}`, error);

  }

};
