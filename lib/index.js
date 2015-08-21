
import os     from 'os';
import server from './server';
import logger from './logger';

const PROD = process.env.NODE_ENV === 'production';
const PORT = PROD ? 8080 : 5000;

setInterval(function processLogger() {
  let startTime = Date.now();
  setImmediate(function logData() {
    let data    = process.memoryUsage();
    data.uptime = process.uptime();
    data.pid    = process.pid;
    data.tags   = ['process-metrics'];
    data.lag    = Date.now() - startTime;
    logger.info(
      data,
      'process.pid: %d heapUsed: %d heapTotal: %d rss: %d uptime %d lag: %d',
      data.pid,
      data.heapUsed,
      data.heapTotal,
      data.rss,
      data.uptime,
      data.lag
    );
  });
}, 15000);

server.listen(PORT, () => {
  logger.info(`Server is now listening on ${os.hostname()}:${PORT}`);
});
