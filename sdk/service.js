'use strict';

const Component = require('./component');
const Action    = require('./action');
const logger    = require('./logger');

/**
 * Service class
 *
 * @extends Component
 */
class Service extends Component {
  constructor(options) {
    super(options);
  }

  action(name, callback) {
    this._setCallback(name, callback);
  }

  /**
   *
   * @param {string} actionName
   * @param {Object} payload
   * @private
   */
  _processCommand(actionName, payload) {
    try {
      this.runAction(this._getAction(actionName, payload));
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
   * @param {Action} action The action request
   */
  runAction(action) {
    let responseAction;
    const actionName = action.getActionName();

    if (typeof this.callbacks[actionName] !== 'function') {
      throw new Error(`Unknown action '${actionName}'`);
    }

    try {
      responseAction = this.callbacks[actionName](action);
    } catch (e) {
      throw new Error(`Userland error. ${e.message}. ${e.stack}`);
    }

    if (!responseAction || !responseAction instanceof Action) {
      throw new Error('Invalid return response, must be an Action instance');
    }

    const {metadata, 'payload': reply} = this._commandReply.getMessage(responseAction);

    this._replyWith(metadata, reply);
  }
}

module.exports = Service;
