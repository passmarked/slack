
import server from './server';
import logger from './logger';

const PROD = process.env.NODE_ENV === 'production';
const PORT = PROD ? 8080 : 5000;

server.listen(PORT, () => {
  logger.info(`Server is now listening on port ${PORT}`);
});
