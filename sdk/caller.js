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
 * Caller class
 */
class Caller {
  /**
   * Create a Caller instance
   *
   * @param {string} name Name of the service
   * @param {string} version Version of the service
   * @param {string} action Action that generated the call
   * @param {Callee} callee Target of the call
   */
  constructor(name, version, action, callee) {
    this._name = name;
    this._version = version;
    this._action = action;
    this._callee = callee;
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
   * Return the calling action
   *
   * @return {string}
   */
  getAction() {
    return this._action;
  }

  /**
   * Return call target
   *
   * @returns {Callee}
   */
  getCallee() {
    return this._callee;
  }
}

module.exports = Caller;
