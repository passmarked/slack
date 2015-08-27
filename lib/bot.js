
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

import qs               from 'querystring';
import { EventEmitter } from 'events';
import fetch            from 'node-fetch';
import WebSocket        from 'ws';
import _                from 'lodash';

const BASE_URL = 'https://slack.com/api/';

const EVENTS = [
  'open',
  'close',
  'error',
  'message'
];

export default class Bot extends EventEmitter {

  username = 'Passmarked';
  icon_url = 'http://static.passmarked.com/logo.png';

  constructor(token) {
    super();
    this.token = token;
  }

  async test() {
    return (
      await this.method('auth.test')
    );
  }

  async sendMessage(data) {
    return (
      await this.method('chat.postMessage', data)
    );
  }

  async userInfo(user) {
    return (
      await this.method('users.info', { user })
    );
  }

  async connect() {

    let connection = await this.method(
      'rtm.start',
      {
        simple_latest : true,
        no_unreads    : true
      }
    );

    if (connection.ok) {

      this.ws = new WebSocket(connection.url);

      EVENTS.forEach(event => {

        this.ws.on(event, (data = null) => (
          this.emit(event, JSON.parse(data))
        ));

      });

    }

    return connection;
  }

  async method(method, info = {}) {

    let data = _.defaults(
      {
        token    : this.token,
        username : this.username,
        icon_url : this.icon_url
      },
      info
    );

    return (
      await this.API_CALL(
        `${BASE_URL + method}?${qs.stringify(data)}`
      )
    );

  }

  async API_CALL(endpoint) {
    let response = await fetch(endpoint);
    return (
      await response.json()
    );
  }

}
