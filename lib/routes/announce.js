
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

import when from 'when';
import node from 'when/node';
import db   from '../db';
import Bot  from '../bot';

const tokens = db.collection('tokens');

export default async function announce(req, res) {
  try {
    if (req.query.token === process.env.PASSMARKED_SLACK_SECURITY_TOKEN) {
      delete req.query.token;
      await when.map(
        (await node.call(::tokens.find, {})),
        makeAnnouncement.bind(null, { ...req.query, channel: '#general' })
      );
      return res.json({
        ok      : true,
        message : 'announcement_sent'
      });
    } else {
      return res.status(401).json({
        ok    : false,
        error : 'invalid_token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok    : false,
      error : error.message
    });
  }
};

async function makeAnnouncement(query, { token }) {
  let bot = new Bot(token);
  await bot.sendMessage(query);
}
