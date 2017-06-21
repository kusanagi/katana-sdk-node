'use strict';

const msgpack = require('msgpack');
const zeromq  = require('zeromq');
const m       = require('./mappings');

class ZMQRuntimeCaller {

  constructor() {

  }

  /**
   *
   * @param {Action} action
   * @param {string} service
   * @param {string} version
   * @param {string} targetAction
   * @param {string} address
   * @param params
   * @param files
   * @param timeout
   */
  call(action, service, version, targetAction, address,
       params = [], files = [],
       timeout            = 1000) {

    this._action = action;

    const command = {
      [m.meta]: {
        [m.service]: 'service',
      },
      [m.command]: {
        [m.name]: 'runtime-call',
        [m.arguments]: {
          [m.action]: action,
          [m.callee]: [
            service,
            version,
            targetAction
          ],
          [m.transport]: action.getTransport().getAsObject(),
          [m.params]: params,
          [m.files]: files,
        },
      },
    };

    const socket = zeromq.socket('rep');

    socket.on('message', this._parseReply.bind(this));
    socket.bindSync(address);

    this._timeout = setTimeout(function () {
      socket.unref();
      throw new Error(`Run-time call timed out for ${service} (${version}) "${targetAction}"`);
    }, timeout);

    socket.send(['\x01', msgpack.pack(command)]);
  }

  _parseReply(response) {
    clearTimeout(this._timeout);
    this._action._processRuntimeResponse(msgpack.unpack(response));
  }
}

module.exports = ZMQRuntimeCaller;
