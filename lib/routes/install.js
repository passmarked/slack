
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
import common from '../common';
import bots   from '../queue';
import Bot    from '../bot';
import logger from '../logger';
import cache  from '../cache';
import tokens from '../collections/tokens';

const VALID_TOKEN = /^([a-z]*)\-([0-9]*)\-([0-9a-zA-Z]*)/;

export default async function install(req, res, next) {

  let bot;
  let response;
  let json;
  let token;
  let existingToken;
  let allTokens;

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

    logger.info(`fetching ${token} from cache`);
    existingToken = await node.call(::cache.get, req.url);

    if (existingToken == null) {
      logger.info(
        `cache fetch failed. attempting to find ${token} from database`
      );
      existingToken = await node.call(::tokens.findOne, { token });
      logger.info(`${token} found. caching...`)
      cache.setex(
        req.url,
        common.times['six hours'] / 1000,
        existingToken
      );
    }

    if (existingToken) {

      logger.info(
        `token ${token} already exists. aborting with friendly message...`
      );

      return res.json({
        ok      : true,
        message : 'already_installed'
      });

    }

    logger.info(`creating bot instance: ${token}`);

    bot = new Bot(token);

    logger.info(`testing bot connection: ${token}`);

    response = await bot.test();

    if (!response.ok) {

      logger.error('bot installation failed:', response.error);

      return res
        .status(500)
        .json(response);

    }

    logger.info(`saving ${token} to database`);
    await node.call(::tokens.save, { token });
    logger.info(`caching ${token}`);
    cache.setex(
      req.url,
      common.times['six hours'] / 1000,
      token
    );

    logger.info(`adding instance ${token} to bot queue`);
    bots.add(token);

    logger.info(`bot installation for ${token} was successful`);
    logger.info(`${token} is thanking connected Slack clients`);

    await bot.sendMessage({
      channel : '#general',
      attachments: [{
        fallback: "Hello, I'm now active on your team. For instructions " +
                  "on how to interact with me, see " +
                  "http://slack.passmarked.com/instructions",
        pretext: "*Hello! I'm now active on your team. " +
                 "I can test your sites against the Passmarked " +
                 "quality score.*",
        title: "How to Use the Passmarked Slack Bot",
        title_link: 'http://slack.passmarked.com/instructions',
        text: '\n\nBelow are some common bot commands. ' +
              'If in the context of a direct message with the bot, you may ' +
              'omit the @mention. Try combining them!\n\n',
        mrkdwn_in: ['pretext'],
      }, {
        color: "#1A1D1C",
        fields: [{
          title: 'Test a webpage',
          value: 'Type "@' + response.user + ' test http://some-website.com"',
          short: false
        }, {
          title: 'Test a webpage, but focus on specific categories',
          value: 'Type "@' + response.user +
                 ' test http://some-website.com categories:performance,compatibility"',
          short: false
        }, {
          title: 'Test a webpage, but focus on specific rules',
          value: 'Type "@' + response.user +
                 ' test http://some-website.com rules:html,css"',
          short: false
        }, {
          title: 'Schedule a test to be run at a specific time',
          value: 'Type "@' + response.user +
                 ' test http://some-website.com in 2 days"',
          short: false
        }, {
          title: 'Send results to a webhook',
          value: 'Type "@' + response.user +
                 ' test http://some-website.com (http://callback-url.com)"',
          short: false
        }, {
          title: 'Get information on how to fix an issue',
          value: 'Type "@' + response.user +
                 ' how to fix <name of offending rule>"',
          short: false
        }, {
          title: 'Passmarked admins can send invites',
          value: 'Type "@' + response.user +
                 ' invite @user OR user@gmail.com"',
          short: false
        }]
      }]
    });

    logger.info(`caching all tokens...`);
    allTokens = await node.call(::tokens.find, {});
    cache.setex(
      'all tokens',
      common.times['six hours'] / 1000,
      JSON.stringify(allTokens)
    );
    logger.info(`all tokens have been cached`);

    logger.info(`sending install success response`);
    return res.json({
      ok      : true,
      message : 'install_success'
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
