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
 * Error class
 */
class Error {
  /**
   * Create a Error instance
   *
   * @param {string} address The address of the service
   * @param {string} name The name of the service
   * @param {string} version The version of the service
   * @param {string} message The error message
   * @param {int} code The error code
   * @param {string} status The error status
   */
  constructor(address, name, version, message, code, status) {
    this._address = address;
    this._name = name;
    this._version = version;
    this._message = message;
    this._code = code;
    this._status = status;
  }

  /**
   * Return the address of the service
   *
   * @return {string}
   */
  getAddress() {
    return this._address;
  }

  /**
   * Return the name of the service
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
   * Return the error message
   *
   * @return {string}
   */
  getMessage() {
    return this._message;
  }

  /**
   * Return the error code
   *
   * @return {int}
   */
  getCode() {
    return this._code;
  }

  /**
   * Return the error status
   *
   * @return {string}
   */
  getStatus() {
    return this._status;
  }
}

module.exports = Error;
