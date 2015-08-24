
import domain from 'domain';
import logger from '../logger';

export default function exceptionLogger(req, res, next) {

  let requestDomain = domain.create();

  requestDomain.add(req);
  requestDomain.add(res);

  requestDomain.on('error', onError);

  next();

};

function onError(error) {
  let data = {
    req,
    res,
    error
  };
  logger.fatal(data, error.message);
}
