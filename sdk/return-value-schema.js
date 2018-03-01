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

class ReturnValueSchema extends Schema {

  /**
   *
   * @param {string} type
   * @param {boolean} allowEmpty
   */
  constructor(type, allowEmpty) {
    super();
    this._type       = type;
    this._allowEmpty = allowEmpty;
  }

  static fromMapping(mapping) {
    return new ReturnValueSchema(
      this.readProperty(mapping, m.type),
      this.readProperty(mapping, m.allow_empty, false)
    );
  }

  /**
   *
   * @returns {string}
   */
  getType() {
    return this._type;
  }

  /**
   *
   * @returns {boolean}
   */
  allowEmpty() {
    return this._allowEmpty;
  }
}

module.exports = ReturnValueSchema;
