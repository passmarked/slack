
import logger from '../logger';

export default function requestLogger(req, res, next) {
  const start = new Date();
  const end   = res.end;
  res.end = function patchedEnd(chunk, encoding) {
    const responseTime = (new Date()).getTime() - start.getTime();
    end.call(res, chunk, encoding);
    const contentLength = parseInt(res.getHeader('Content-Length'), 10);
    const data = {
      req,
      res,
      responseTime,
      contentLength: isNaN(contentLength) ? 0 : contentLength
    };
    logger.info(
      data,
      '%s %s %d %dms - %d',
      data.req.method,
      data.req.url,
      data.res.statusCode,
      data.responseTime,
      data.contentLength
    );
  };
  next();
};
