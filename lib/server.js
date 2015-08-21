
import http            from 'http';
import express         from 'express';
import bodyParser      from 'body-parser';
import helmet          from 'helmet';
import routes          from './routes';
import requestLogger   from './middleware/request-logger';
import errorLogger     from './middleware/error-logger';
import exceptionLogger from './middleware/exception-logger';

const app = express();

app.disable('x-powered-by');

app.use(exceptionLogger);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

export default http.Server(app);
