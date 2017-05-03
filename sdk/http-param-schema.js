'use strict';

const Schema = require('./schema');
const m      = require('./mappings');

class HttpParamSchema extends Schema {

  constructor(accessible, input = 'query', param) {
    super();

    this._accessible = accessible;
    this._input      = input;
    this._param      = param;
  }

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

  isAccesible() {
    return this._accessible;
  }

  getInput() {
    return this._input;
  }

  getParam() {
    return this._param;
  }
}

module.exports = HttpParamSchema;
