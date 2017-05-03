'use strict';

const Request  = require('./request');
const Response = require('./response');
const Action   = require('./action');

/**
 * Command Reply builder
 */
class CommandReply {
  constructor(mapper) {
    this._mapper = mapper;
  }

  /**
   *
   * @param {Api} api
   * @returns {Object}
   */
  getMessage(api) {
    if (api instanceof Request) {
      return this._getRequestMessage(api);
    } else if (api instanceof Response) {
      return this._getResponseMessage(api);
    } else if (api instanceof Action) {
      return this._getActionMessage(api);
    }
  }

  /**
   *
   * @param {Request} request
   * @returns {Object}
   * @private
   */
  _getRequestMessage(request) {
    return {
      metadata: '\x00',
      payload: this._mapper.getRequestMessage(request),
    };
  }

  /**
   *
   * @param {Response} response
   * @returns {Object}
   * @private
   */
  _getResponseMessage(response) {
    return {
      metadata: '\x00',
      payload: this._mapper.getResponseMessage(response),
    };
  }

  /**
   *
   * @param {Action} action
   * @returns {Object}
   * @private
   */
  _getActionMessage(action) {
    const transport = action.getTransport();
    let metadata    = '\x00';

    if (transport.hasCalls()) {
      metadata = '\x01';
    }

    if (transport.hasFiles()) {
      metadata = '\x02';
    }

    if (transport.hasTransactions()) {
      metadata = '\x03';
    }

    if (transport.hasDownload()) {
      metadata = '\x04';
    }

    let payload = this._mapper.getActionMessage(action);

    return {metadata, payload};
  }
}

module.exports = CommandReply;
