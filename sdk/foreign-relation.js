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
   * @param {string} version Version of the service
   * @param {ActionData[]} actions Actions of the service with data
   */
  constructor(address, name, version, actions) {

    this._address = address;
    this._name = name;
    this._version = version;
    this._actions = actions;
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
   * Return the service version
   *
   * @return {string}
   */
  getVersion() {
    return this._version;
  }

  /**
   * Return the service actions with data
   *
   * @returns {ActionData[]}
   */
  getActions() {
    return this._actions;
  }
}

module.exports = ServiceData;
