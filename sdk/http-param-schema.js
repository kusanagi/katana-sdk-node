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
