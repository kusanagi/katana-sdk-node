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
      logger.error(`Service error running callback "${actionName}"`, e.stack);
      // Transport / Command reply
      this._replyWithError(
        `Service error running callback "${actionName}": ${e.message}`,
        500,
        'Internal Server Error'
      );
    }
  }

  /**
   * @param {Action} action The action request
   */
  runAction(action) {
    const actionName = action.getActionName();

    if (typeof this.callbacks[actionName] !== 'function') {
      throw new Error(`Unknown action '${actionName}'`);
    }

    action._setCallbackExecutionTimeout(actionName);

    this.callbacks[actionName](action);
    // We don't care about the return.
    // To finish the request, user code must call .done() on the request object
  }
}

module.exports = Service;
