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

const Schema = require('./schema');
const m      = require('./mappings');

/**
 * Represents the HTTP semantics of a FileSchema
 * @see <a href="https://github.com/kusanagi/katana-sdk-spec#941-http-file-schema">HttpFileSchema
 * in the SDK Spec</a>.
 */
class HttpFileSchema extends Schema {
  /**
   *
   * @param {boolean} accessible
   * @param {string} param
   */
  constructor(accessible, param) {
    super();

    this._accessible = accessible;
    this._param      = param;
  }

  /**
   *
   * @param {Object} mapping
   * @returns {HttpFileSchema}
   */
  static fromMapping(mapping) {
    const accessible = this.readProperty(mapping, m.gateway, true);
    const param      = this.readProperty(mapping, m.param);

    return new HttpFileSchema(
      accessible,
      param
    );
  }

  /**
   *
   * @returns {boolean}
   */
  isAccessible() {
    return this._accessible;
  }

  /**
   *
   * @returns {string}
   */
  getParam() {
    return this._param;
  }
}

module.exports = HttpFileSchema;
