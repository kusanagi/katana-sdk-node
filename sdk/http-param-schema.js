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

class HttpParamSchema extends Schema {

  /**
   *
   * @param {boolean} accessible
   * @param {string} input
   * @param {string} param
   */
  constructor(accessible, input = 'query', param) {
    super();

    this._accessible = accessible;
    this._input      = input;
    this._param      = param;
  }

  /**
   *
   * @param mapping
   * @returns {HttpParamSchema}
   * @private
   */
  static fromMapping(mapping) {
    const accessible = this.readProperty(mapping, m.accessible, false);
    const input      = this.readProperty(mapping, m.input, 'query');
    const param      = this.readProperty(mapping, m.param, '');

    return new HttpParamSchema(
      accessible,
      input,
      param
    );
  }

  /**
   *
   * @returns {boolean}
   */
  isAccesible() {
    return this._accessible;
  }

  /**
   *
   * @returns {string}
   */
  getInput() {
    return this._input;
  }

  /**
   *
   * @returns {string}
   */
  getParam() {
    return this._param;
  }
}

module.exports = HttpParamSchema;
