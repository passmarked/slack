
// Copyright 2015 Passmarked Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
