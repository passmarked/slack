
import logger from '../logger';

export default function errorLogger(error, req, res, next) {
  logger.error(
    {
      req,
      res,
      error
    },
    error.stack
  );
  next(error);
};
