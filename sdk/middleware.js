'use strict';

const Component = require('./component');
const Request = require('./request');
const Response = require('./response');
const logger = require('./logger');

/**
 * Middleware class
 *
 * @extends Component
 */
class Middleware extends Component {
  constructor() {
    super();
  }

  /**
   *
   * @param {string} actionName
   * @param {Object} payload
   */
  _processCommand(actionName, payload) {
    logger.debug('Incoming command', JSON.stringify(payload));

    try {
        if (actionName === 'request') {
          this.runRequest(this._getRequest(payload));
        } else if (actionName === 'response') {
          this.runResponse(this._getResponse(payload));
        } else {
          throw new Error(`Unknown action for middleware: ${actionName}`);
        }
    } catch (e) {
      // User
      this._runError(e);
      // Logs
      logger.error(`Error running callback: ${actionName}. ${e.message}`, e.stack);
      // Transport / Command reply
      this._replyWithError(
        `Middleware error running callback: ${actionName}. ${e.message}`,
        500,
        'Internal Server Error'
      );
    }
  }

  /**
   *
   * @param {Request} request
   * @returns {Request}
   */
  runRequest(request) {
    const actionName = 'request';

    if (typeof this.callbacks[actionName] !== 'function') {
      throw new Error(`Unknown action '${actionName}'`);
    }

    const result = this.callbacks[actionName](request);

    if (!result || !(result instanceof Request) && !(result instanceof Response)) {
      throw new Error('Invalid callback return, must be an instance of Request or Response');
    }

    const {metadata, 'payload': reply} = this._commandReply.getMessage(result);

    this._replyWith(metadata, reply);
  }
  /**
   *
   * @param {Response} response
   * @returns {Response}
   */
  runResponse(response) {
    const actionName = 'response';

    if (typeof this.callbacks[actionName] !== 'function') {
      throw new Error(`Unknown action '${actionName}'`);
    }

    const result = this.callbacks[actionName](response);

    if (!result || !result instanceof Response) {
      throw new Error('Invalid callback return, must be an instance of Request');
    }

    const {metadata, 'payload': reply} = this._commandReply.getMessage(result);

    this._replyWith(metadata, reply);
  }

  /**
   *
   * @param {function} callable
   * @returns {Middleware}
   */
  request(callable) {
    this._setCallback('request', callable);

    return this;
  }

  /**
   *
   * @param {function} callable
   * @returns {Middleware}
   */
  response(callable) {
    this._setCallback('response', callable);

    return this;
  }
}

module.exports = Middleware;
