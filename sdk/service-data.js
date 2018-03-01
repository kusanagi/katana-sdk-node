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
 * ServiceData class
 */
class ServiceData {
  /**
   * Create a ServiceData instance
   *
   * @param {string} address Address of the service
   * @param {string} name Name of the service
   * @param {string} version Version of the service
   * @param {ActionData[]} actions Actions of the service with data
   */
  constructor(address, name, version, actions) {

    this._address = address;
    this._name = name;
    this._version = version;
    this._actions = actions;
  }

  /**
   * Return the service address
   *
   * @return {string}
   */
  getAddress() {
    return this._address;
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
   * Return the service actions with data
   *
   * @returns {ActionData[]}
   */
  getActions() {
    return this._actions;
  }
}

module.exports = ServiceData;
