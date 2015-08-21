
import http       from 'http';
import express    from 'express';
import bodyParser from 'body-parser';
import helmet     from 'helmet';
import routes     from './routes';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.disable('x-powered-by');

export default http.Server(app);
