
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

import node   from 'when/node';
import bots   from '../queue';
import Bot    from '../bot';
import logger from '../logger';
import db     from '../db';

const tokens      = db.collection('tokens');
const VALID_TOKEN = /^([a-z]*)\-([0-9]*)\-([0-9a-zA-Z]*)/;

export default async function install(req, res, next) {

  let bot;
  let response;
  let json;
  let token;
  let tokenExists;

  try {

    token = req.query.token;

    logger.info('recived request to install a bot');

    if (!token) {

      logger.info('bot token not supplied. aborting...');

      return res
        .status(500)
        .json({
          ok    : false,
          error : 'missing_token'
        });

    }

    if (!token.match(VALID_TOKEN)) {

      logger.info('bot token is invalid. aborting...');

      return res
        .status(500)
        .json({
          ok    : false,
          error : 'invalid_token'
        });

    }

    tokenExists = await node.call(::tokens.findOne, { token });

    if (tokenExists) {

      logger.info(
        `token ${token} already exists. aborting with friendly message...`
      );

      return res.json({
        ok      : true,
        message : 'bot_already_installed'
      });

    }

    logger.info(`creating bot instance: ${token}`);

    bot = new Bot(req.query.token);

    logger.info(`testing bot connection: ${token}`);

    response = await bot.test();

    if (!response.ok) {

      logger.error('bot installation failed:', response.error);

      return res
        .status(500)
        .json(response);

    }

    logger.info(`bot installation for ${token} was successful`);
    logger.info(`${token} is thanking connected Slack clients`);

    await bot.sendMessage({
      channel : '#general',
      text    : 'Thanks for installing Passmarked on Slack.'
    });

    logger.info(`adding instance ${token} to bot queue`);

    let result = await bots.add(token);

    return res.json({
      ok      : true,
      message : 'installation_successful'
    });

  } catch (error) {

    res
      .status(500)
      .json({
        ok    : false,
        error : error.message
      });

    next(error);

  }

};
