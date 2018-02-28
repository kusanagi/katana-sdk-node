'use strict';

/**
 * Relation class
 */
class Relation {
  /**
   * Create a Relation instance
   *
   * @param {string} address Address of the service
   * @param {string} name Name of the service
   * @param {string} primaryKey Primary key of the relation
   * @param {ForeignRelation[]} foreignRelations Targets of the relation
   */
  constructor(address, name, primaryKey, foreignRelations) {
    this._address = address;
    this._name = name;
    this._primaryKey = primaryKey;
    this._foreignRelations = foreignRelations;
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
   * Return the primary key
   *
   * @return {string}
   */
  getPrimaryKey() {
    return this._primaryKey;
  }

  /**
   * Return the foreign relation
   *
   * @returns {ForeignRelation[]}
   */
  getForeignRelations() {
    return this._foreignRelations;
  }
}

module.exports = Relation;
