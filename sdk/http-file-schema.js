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
