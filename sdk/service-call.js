'use strict';

/**
 * Service call encapsulation
 */
class ServiceCall {
  /**
   *
   * @param {string} serviceName
   * @param {string} version
   * @param {string} actionName
   * @param {Object} params
   */
  constructor(serviceName = '', version = '', actionName = '', params = {}) {
    this._serviceName = serviceName;
    this._version     = version;
    this._actionName  = actionName;
    this._params      = params;
  }

  /**
   *
   * @returns {string}
   */
  getServiceName() {
    return this._serviceName;
  }

  /**
   *
   * @param {string} name
   * @returns {ServiceCall}
   */
  setServiceName(name) {
    this._serviceName = name;

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getActionName() {
    return this._actionName;
  }

  /**
   *
   * @param {string} name
   * @returns {ServiceCall}
   */
  setActionName(name) {
    this._actionName = name;

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getVersion() {
    return this._version;
  }

  /**
   *
   * @param version
   * @returns {ServiceCall}
   */
  setVersion(version) {
    this._version = version;

    return this;
  }
}

module.exports = ServiceCall;
