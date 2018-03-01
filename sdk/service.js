/*
 * NODE SDK for the KATANA(tm) Framework (http://katana.kusanagi.io)
 * Copyright (c) 2016-2018 KUSANAGI S.L. All rights reserved.
 *
 * Distributed under the MIT license
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code
 *
 * @link      https://github.com/kusanagi/katana-sdk-node
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @copyright Copyright (c) 2016-2018 KUSANAGI S.L. (http://kusanagi.io)
 */

'use strict';

const Component = require('./component');
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

  /**
   * Register a new action callback
   * @param {string} name
   * @param {function} callback
   */
  action(name, callback) {
    this._setCallback(name, callback);

    return this;
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
   * @private
   */
  runAction(action) {
    const actionName = action.getActionName();

    if (typeof this.callbacks[actionName] !== 'function') {
      throw new Error(`Unknown action '${actionName}'`);
    }

    action._setCallbackExecutionTimeout(actionName, this.cli.timeout);

    this.callbacks[actionName](action);
    // We don't care about the return.
    // To finish the request, user code must call .done() on the request object
  }
}

module.exports = Service;
