'use strict';

const Schema = require('./schema');
const m      = require('./mappings');

/**
 * Represents the HTTP semantics of an action schema in the framework
 * @see https://github.com/kusanagi/katana-sdk-spec#921-http-action-schema
 */
class HttpActionSchema extends Schema {
  /**
   *
   * @param {boolean} accessible
   * @param {string} method
   * @param {string} path
   * @param {string} input
   * @param {string[]} body Defines the expected MIME type of the HTTP request body for methods
   * other than "get", "options" and "head", which MAY include multiple MIME types, defaults to ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"] (array)
   */
  constructor(accessible, method, path, input, body = ['text/plain']) {
    super();

    this._accessible = accessible;
    this._method     = method;
    this._path       = path;
    this._input      = input;
    this._body       = body;
  }

  /**
   *
   * @param {Object} mapping
   * @returns {HttpActionSchema}
   * @see https://github.com/kusanagi/katana-sdk-spec#522-mapping
   */
  static fromMapping(mapping) {
    return new HttpActionSchema(
      this.readProperty(mapping, m.gateway, true),
      this.readProperty(mapping, m.method, 'get'),
      this.readProperty(mapping, m.path, '/'),
      this.readProperty(mapping, m.input, 'query'),
      this.readProperty(mapping, m.body, [
        'application/x-www-form-urlencoded',
        'multipart/form-data',
        'text/plain'
      ])
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
  getMethod() {
    return this._method.toUpperCase();
  }

  /**
   *
   * @returns {string}
   */
  getPath() {
    return this._path;
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
  getBody() {
    return this._body.join(',');
  }
}

module.exports = HttpActionSchema;
