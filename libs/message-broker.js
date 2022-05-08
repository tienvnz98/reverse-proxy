const shortId = require('shortid');
const Events = require('events');

class MessageBroker extends Events {
  constructor() {
    super();
    this._connMap = {};
    this._subscriptionChannel = {};
  }

  async init(ws) {
    if (this._initialized === true) return;
    this._initialized = true;
    const that = this;
    ws.setMaxListeners(10000);
    ws.on('connection', (conn) => {
      conn.id = shortId.generate();
      this._connMap[conn.id] = conn;
      this.sendMessage(conn.id, { msg: 'Connection success!', subId: conn.id });

      conn.on('close', () => {
        conn.terminate();
        delete this._connMap[conn.id];
        console.log('client connection is close!');
      });

      conn.on('message', (buff) => {
        const msg = String(buff);
        this.msgParser(conn, msg);
      })
    });
  }

  async sendMessage(target, data) {
    let value = '';
    if (data instanceof Object) {
      value = JSON.stringify(data);
    } else if (typeof (data) === 'string') {
      value = data;
    }
    const wsTarget = this._connMap[target];
    if (wsTarget) {
      wsTarget.send(value);
    }
  }

  async msgParser(ws, data) {
    let obj = this.parser(data);
    if (obj) {
      const { method, channel, data = {} } = obj;
      if (method === 'subscribe') {
        if (!this._subscriptionChannel[channel]) this._subscriptionChannel[channel] = [];
        this._subscriptionChannel[channel].push(ws.id);
      } else if (method === 'publish') {
        // Publish for subscriber
        this.publish(channel, data);
        this.emit(channel, data);
        if (channel === '*') {
          for (const c in this._subscriptionChannel) {
            this.publish(c, data);
          }
        }
      }
    }
  }

  publish(subject, data) {
    const listSubs = [];
    for (const subj in this._subscriptionChannel) {
      if (subj.indexOf(subject) !== -1) {
        const list = this._subscriptionChannel[subj];
        for (const item of list) {
          if (listSubs.indexOf(item) === -1) {
            listSubs.push(item);
          }
        }
      }
    }

    for (const id of listSubs) {
      this.sendMessage(id, {
        method: 'publish',
        channel: subject,
        data: data
      });
    }
  }

  parser(jsonstring) {
    let obj = null;
    try {
      obj = JSON.parse(jsonstring);
    } catch (error) { }
    return obj;
  }

  subscribe(channel, callback = (data) => { console.log(data) }) {
    if (!(callback instanceof Function)) {
      throw new Error('Callback must be a function!');
      process.exit(142);
    }
    this.on(channel, callback);
  }

  static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

module.exports = MessageBroker.Instance;