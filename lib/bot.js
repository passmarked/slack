
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

  constructor(token) {
    super();
    this.token    = token;
    this.username = 'Passmarked';
    this.icon_url = 'http://static.passmarked.com/logo.png'
  }

  async test() {
    return await this.method('auth.test');
  }

  async sendMessage(data) {
    return await this.method('chat.postMessage', data);
  }

  async userInfo(user) {
    return await this.method('users.info', { user });
  }

  async connect() {

    let connection = await this.method(
      'rtm.start', {
        simple_latest : true,
        no_unreads    : true
      }
    );

    if (connection.ok) {

      this.ws = new WebSocket(connection.url);

      EVENTS.forEach(event => {

        this.ws.on(event, (data) => {
          if (data != null) data = JSON.parse(data);
          this.emit.call(this, event, data);
        });

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

    return await this.API_CALL(
      `${BASE_URL + method}?${qs.stringify(data)}`
    );

  }

  async API_CALL(endpoint) {
    let response = await fetch(endpoint);
    return await response.json();
  }

}
