'use strict';

const m      = require('./mappings');
const Schema = require('./schema');

/**
 * Represents the HTTP semantics of a Service schema in the framework
 * @see https://github.com/kusanagi/katana-sdk-spec#911-http-service-schema
 */
class HttpServiceSchema extends Schema {
  /**
   *
   * @param {boolean} accessible
   * @param {string} basePath
   */
  constructor(accessible, basePath) {
    super();

    this._accessible = accessible;
    this._basePath   = basePath;
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
  getBasePath() {
    return this._basePath;
  }

  /**
   *
   * @param {Object} mapping
   * @returns {HttpServiceSchema}
   */
  static fromMapping(mapping) {
    return new HttpServiceSchema(
      this.readProperty(mapping, m.gateway, true),
      this.readProperty(mapping, m.base_path, '')
    );
  }
}

module.exports = HttpServiceSchema;
