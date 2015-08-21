
import http          from 'http';
import express       from 'express';
import bodyParser    from 'body-parser';
import helmet        from 'helmet';
import routes        from './routes';
import requestLogger from './middleware/request-logger';

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);

export default http.Server(app);
