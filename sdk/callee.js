'use strict';

const _ = require('lodash');

/**
 * Callee class
 */
class Callee {
  /**
   * Create a Callee instance
   *
   * @param {int} timeout Timeout for the call
   * @param {int} duration Duration of the call. 0 if not done yet
   * @param {string} address Address of the service
   * @param {string} name Name of the service
   * @param {string} version Version of the service
   * @param {string} action Action called
   * @param {Param[]} params Parameters of the call
   */
  constructor(timeout, duration, address, name, version, action, params) {
    this._timeout = timeout;
    this._duration = duration;
    this._address = address;
    this._name = name;
    this._version = version;
    this._action = action;
    this._params = params;
  }

  /**
   * Return the call timeout
   *
   * @return {int}
   */
  getTimeout() {
    return this._timeout;
  }

  /**
   * Return the call duration
   *
   * @return {int}
   */
  getDuration() {
    return this._duration;
  }

  /**
   * Returns true if the call is remote
   *
   * @returns {boolean}
   */
  isRemote() {
    return _.isString(this._address) && this._address !== '';
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
   * Return the called action
   *
   * @return {string}
   */
  getAction() {
    return this._action;
  }

  /**
   * Return call parameters
   *
   * @returns {Param[]}
   */
  getParams() {
    return this._params;
  }
}

module.exports = Callee;
