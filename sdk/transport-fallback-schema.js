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
