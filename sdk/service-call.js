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
 * Service call encapsulation
 */
class ServiceCall {
  /**
   *
   * @param {string} serviceName
   * @param {string} version
   * @param {string} actionName
   * @param {Object} params
   */
  constructor(serviceName = '', version = '', actionName = '', params = {}) {
    this._serviceName = serviceName;
    this._version     = version;
    this._actionName  = actionName;
    this._params      = params;
  }

  /**
   *
   * @returns {string}
   */
  getServiceName() {
    return this._serviceName;
  }

  /**
   *
   * @param {string} name
   * @returns {ServiceCall}
   */
  setServiceName(name) {
    this._serviceName = name;

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getActionName() {
    return this._actionName;
  }

  /**
   *
   * @param {string} name
   * @returns {ServiceCall}
   */
  setActionName(name) {
    this._actionName = name;

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getVersion() {
    return this._version;
  }

  /**
   *
   * @param version
   * @returns {ServiceCall}
   */
  setVersion(version) {
    this._version = version;

    return this;
  }
}

module.exports = ServiceCall;
