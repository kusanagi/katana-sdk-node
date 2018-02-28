'use strict';

/**
 * Error class
 */
class Error {
  /**
   * Create a Error instance
   *
   * @param {string} address The address of the service
   * @param {string} name The name of the service
   * @param {string} version The version of the service
   * @param {string} message The error message
   * @param {int} code The error code
   * @param {string} status The error status
   */
  constructor(address, name, version, message, code, status) {
    this._address = address;
    this._name = name;
    this._version = version;
    this._message = message;
    this._code = code;
    this._status = status;
  }

  /**
   * Return the address of the service
   *
   * @return {string}
   */
  getAddress() {
    return this._address;
  }

  /**
   * Return the name of the service
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
   * Return the error message
   *
   * @return {string}
   */
  getMessage() {
    return this._message;
  }

  /**
   * Return the error code
   *
   * @return {int}
   */
  getCode() {
    return this._code;
  }

  /**
   * Return the error status
   *
   * @return {string}
   */
  getStatus() {
    return this._status;
  }
}

module.exports = Error;
