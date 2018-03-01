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
 * Link class
 */
class Link {
  /**
   * Create a Link instance
   *
   * @param {string} address The address of the service registering the link
   * @param {string} name The name of the service registering the link
   * @param {string} link The name of the link
   * @param {string} uri The uri of the link
   */
  constructor(address, name, link, uri) {
    this._address = address;
    this._name = name;
    this._link = link;
    this._uri = uri;
  }

  /**
   * Return the address of the service registering the link
   *
   * @return {string}
   */
  getAddress() {
    return this._address;
  }

  /**
   * Return the name of the service registering the link
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the name of the link
   *
   * @return {string}
   */
  getLink() {
    return this._link;
  }

  /**
   * Return the uri of the link
   *
   * @return {string}
   */
  getUri() {
    return this._uri;
  }
}

module.exports = Link;
