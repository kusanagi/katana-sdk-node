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

/**
 * Transaction class
 */
class Transaction {
  /**
   * Create a Transaction instance
   *
   * @param {string} type Type of transaction
   * @param {string} name Name of the service
   * @param {string} version Version of the service
   * @param {string} callerAction Action calling the transaction
   * @param {string} calleeAction Action called
   * @param {Param[]} params Parameters of the call
   */
  constructor(type, name, version, callerAction, calleeAction, params) {
    if (['commit', 'rollback', 'complete'].indexOf(type) === -1) {
        throw new TypeError(
            'Invalid transaction type. Valid types are "commit", "rollback" and "complete"'
        );
    }

    this._type = type;
    this._name = name;
    this._version = version;
    this._callerAction = callerAction;
    this._calleeAction = calleeAction;
    this._params = params;
  }

  /**
   * Return the type of transaction
   *
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * Return the service name
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the service version
   *
   * @return {string}
   */
  getVersion() {
    return this._version;
  }

  /**
   * Return the caller action
   *
   * @return {string}
   */
  getCallerAction() {
    return this._callerAction;
  }

  /**
   * Return the called action
   *
   * @return {string}
   */
  getCalleeAction() {
    return this._calleeAction;
  }

  /**
   * Return call parameters
   *
   * @returns {Param[]}
   */
  getParams() {
    return this._params;
  }
}

module.exports = Transaction;
