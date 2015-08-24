
import bots   from '../queue';
import Bot    from '../bot';
import logger from '../logger';

const VALID_TOKEN = /^([a-z]*)\-([0-9]*)\-([0-9a-zA-Z]*)/;

export default async function install(req, res, next) {

  let bot;
  let response;
  let json;

  try {

    logger.info('recived request to install a bot');

    if (!req.query.token) {

      logger.info('bot token not supplied. aborting...');

      return res.json({
        ok    : false,
        error : 'missing_token'
      });

    }

    if (!req.query.token.match(VALID_TOKEN)) {

      logger.info('bot token is invalid. aborting...');

      return res.json({
        ok    : false,
        error : 'invalid_token'
      });

    }

    logger.info(`creating bot instance: ${req.query.token}`);

    bot = new Bot(req.query.token);

    logger.info(`testing bot connection: ${req.query.token}`);

    response = await bot.test();

    if (!response.ok) {
      logger.error('bot installation failed:', response.error);
      return res.status(500).json(response);
    }

    logger.info(`bot installation for ${req.query.token} was successful`);
    logger.info(`${req.query.token} is thanking connected Slack clients.`);

    await bot.sendMessage({
      channel : '#general',
      text    : 'Thanks for installing Passmarked on Slack.'
    });

    logger.info(`adding token ${req.query.token} to bot queue`);

    bots.add({
      token : req.query.token,
      bot   : bot
    });

    return res.json({
      ok      : true,
      message : 'Installation successful.'
    });

  } catch (error) {

    res.status(500).json({
      ok    : false,
      error : error.message
    });

    next(error);

  }

};
