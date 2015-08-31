
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

import when   from 'when';
import node   from 'when/node';
import Bot    from '../bot';
import logger from '../logger';
import cache  from '../cache';
import common from '../common';
import tokens from '../collections/tokens';

export default async function announce(req, res) {

  let allTokens;

  try {

    logger.info(`received request to make an announcement`);

    if (req.query.token === process.env.PASSMARKED_SLACK_SECURITY_TOKEN) {

      logger.info(`announcement authorized`);

      delete req.query.token;

      logger.info(`collecting all tokens from cache...`);
      allTokens = JSON.parse(
        await node.call(::cache.get, 'all tokens')
      );

      if (allTokens == null) {
        logger.info(
          `tokens cache not found, attempting to fetch from database`
        );
        allTokens = await node.call(::tokens.find, {});
        logger.info(`setting tokens cache`);
        cache.setex(
          'all tokens',
          common.times['6 hours'],
          JSON.stringify(allTokens)
        );
      }

      await when.map(
        allTokens,
        makeAnnouncement.bind(
          null,
          { channel: '#general', ...req.query }
        )
      );

      return res.json({
        ok      : true,
        message : 'announcement_sent'
      });

    } else {

      logger.error(`announcement authorization failed`);

      return res.status(401).json({
        ok    : false,
        error : 'invalid_token'
      });

    }

  } catch (error) {

    logger.error(`announcement failed`, error);

    return res.status(500)
      .json({
        ok    : false,
        error : error.message
      });
  }
};

async function makeAnnouncement(query, { token }) {
  let bot = new Bot(token);
  await bot.sendMessage(query);
}
