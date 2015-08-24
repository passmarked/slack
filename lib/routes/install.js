
import Bot from '../bot';

export default async function install(req, res) {

  let bot;
  let test;
  let connect;

  try {

    bot     = new Bot(req.query.token);
    test    = await bot.test();
    connect = await bot.connect();

    bot.on('message', function(data) {
      console.log(data);
    });

    let sent_message_test = await bot.sendMessage({
      channel: '#general',
      text: `Yay! you have successfully installed Passmarked on your Slack! :)`
    });

    res.json(sent_message_test);

  } catch (error) {
    console.log(error);
  }

};
