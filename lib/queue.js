
import Queue     from 'bull';
import createBot from './instance';

let bots = Queue('bots', 6379, '127.0.0.1');

bots.process(processBot);

function processBot(job, done) {
  createBot(job.data.token, bot);
  done();
}

export default bots;
