'use strict';

/**
 * ForeignRelation class
 */
class ForeignRelation {
  /**
   * Create a ForeignRelation instance
   *
   * @param {string} address Address of the service
   * @param {string} name Name of the service
   * @param {string} type Type of the relation
   * @param {string[]} foreignKeys Keys to which the relation links to
   */
  constructor(address, name, type, foreignKeys) {
    if (['one', 'many'].indexOf(type) === -1) {
        throw new TypeError('Invalid relation type. Valid types are "one" and "many"');
    }

    this._address = address;
    this._name = name;
    this._type = type;
    this._foreignKeys = foreignKeys;
  }

  /**
   * Return the service address
   *
   * @return {string}
   */
  getAddress() {
    return this._address;
  }

  /**
   * Return the service name
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the relation type
   *
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * Return the relation foreign keys
   *
   * @returns {string[]}
   */
  getForeignKeys() {
    return this._foreignKeys;
  }
}

module.exports = ForeignRelation;
