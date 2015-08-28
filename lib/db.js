
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

import mongojs from 'mongojs';
import logger  from './logger.js';

const dbURL = process.env.PASSMARKED_SLACK_MONGO_DB_URL;
const db    = mongojs((dbURL || 'passmarked-slack'));

db.on('error', logger.error.bind(logger, 'database error'));
db.on('ready', logger.info.bind(logger, 'database connected'));

export default db;