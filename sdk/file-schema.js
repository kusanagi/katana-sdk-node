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

const Schema         = require('./schema');
const HttpFileSchema = require('./http-file-schema');
const m              = require('./mappings');

/**
 * Represents a file parameter schema in the framework
 * @see https://github.com/kusanagi/katana-sdk-spec#94-file-schema
 */
class FileSchema extends Schema {
  /**
   *
   * @param {string} name
   * @param {string} mime
   * @param {boolean} required
   * @param {number} max
   * @param {boolean} exclusiveMax
   * @param {number} min
   * @param {boolean} exclusiveMin
   * @param {HttpFileSchema} httpSchema
   */
  constructor(
    name, mime = 'text/plain', required, max, exclusiveMax, min, exclusiveMin, httpSchema
  ) {
    super();

    this._name         = name;
    this._mime         = mime;
    this._required     = required;
    this._max          = max;
    this._exclusiveMax = exclusiveMax;
    this._min          = min;
    this._exclusiveMin = exclusiveMin;
    this._httpSchema   = httpSchema;
  }

  /**
   *
   * @param {string} name
   * @param {Object} mapping
   * @returns {FileSchema}
   */
  static fromMapping(fileName, mapping) {
    const name         = fileName;
    const mime         = this.readProperty(mapping, m.mime, 'text/plain');
    const required     = this.readProperty(mapping, m.required, false);
    const max          = this.readProperty(mapping, m.maximum, Number.MAX_VALUE);
    const exclusiveMax = this.readProperty(mapping, m.exclusive_maximum, false);
    const min          = this.readProperty(mapping, m.minimum, Number.MIN_VALUE);
    const exclusiveMin = this.readProperty(mapping, m.exclusive_minimum, false);
    const httpSchema   = HttpFileSchema.fromMapping(mapping[m.http]);

    return new FileSchema(
      name,
      mime,
      required,
      max,
      exclusiveMax,
      min,
      exclusiveMin,
      httpSchema
    );
  }

  /**
   *
   * @returns {string}
   */
  getName() {
    return this._name;
  }

  /**
   *
   * @returns {string}
   */
  getMime() {
    return this._mime;
  }

  /**
   *
   * @returns {boolean}
   */
  isRequired() {
    return this._required;
  }

  /**
   *
   * @returns {number}
   */
  getMax() {
    return this._max;
  }

  /**
   *
   * @returns {boolean}
   */
  isExclusiveMax() {
    return this._exclusiveMax;
  }

  /**
   *
   * @returns {number}
   */
  getMin() {
    return this._min;
  }

  /**
   *
   * @returns {boolean}
   */
  isExclusiveMin() {
    return this._exclusiveMin;
  }

  /**
   *
   * @returns {HttpFileSchema}
   */
  getHttpSchema() {
    return this._httpSchema;
  }
}

module.exports = FileSchema;
