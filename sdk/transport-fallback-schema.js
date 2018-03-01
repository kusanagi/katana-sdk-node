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
 *
 */
class TransportFallbackSchema extends Schema {
  /**
   *
   * @param {Object} properties
   * @param {Object[]} data
   * @param {Object[]} relations
   * @param {Object} links
   * @param {Object[]} errors
   */
  constructor(properties = {}, data = [], relations = [], links = {}, errors = []) {
    super();

    this._properties = properties;
    this._data       = data;
    this._relations  = relations;
    this._errors     = errors;
  }

  /**
   *
   * @param {Object} mapping
   * @returns {TransportFallbackSchema}
   */
  static fromMapping(mapping) {

    return new TransportFallbackSchema(
      this.readProperty(mapping, m.properties, {}),
      this.readProperty(mapping, m.data, []),
      this.readProperty(mapping, m.relations, []),
      this.readProperty(mapping, m.links, {}),
      this.readProperty(mapping, m.errors, [])
    );
  }
}

module.exports = TransportFallbackSchema;
