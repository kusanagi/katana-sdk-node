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
