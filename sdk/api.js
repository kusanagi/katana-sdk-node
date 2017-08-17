'use strict';
const semver = require('semver');

/**
 * Base Api class
 * @see https://github.com/kusanagi/katana-sdk-spec#7-api
 */
class Api {
  /**
   * Create Api instance
   *
   * @param {Component} component Base component running this API
   * @param {string} path Source file path
   * @param {string} name Component name
   * @param {string} version Component version
   * @param {string} frameworkVersion Framework version
   * @param {Object} variables Variables object
   * @param {boolean} debug Debug mode
   */
  constructor(component, path, name, version, frameworkVersion, variables = {}, debug = false) {
    this._component = component;
    this._path = path;
    this._name = name;
    this._version = version;
    this._frameworkVersion = frameworkVersion;
    this._variables = variables;
    this._debug = debug;
    this._params = {};
  }

  /**
   *
   */
  done() {
    if (this._callbackTimeout) {
      clearTimeout(this._callbackTimeout);
    }

    if (this._parentRequest !== undefined) {
      clearTimeout(this._parentRequest._callbackTimeout);
    }
    const {metadata, 'payload': reply} = this._component._commandReply.getMessage(this);

    this._component._replyWith(metadata, reply);
  }


  /**
   *
   * @param {String} action Name of the action callback
   * @param {Number} timeout Maximum allowed execution time, in milliseconds
   * @protected
   */
  _setCallbackExecutionTimeout(action, timeout = 10000) {
    this.log(`Setting timeout of ${timeout}ms for ${action}`);

    this._callbackTimeout = setTimeout(() => {
      this._callbackExecutionTimeout(action, timeout);
    }, timeout);
  }

  /**
   *
   * @param {String} action Name of the action callback
   * @param {Number} timeout Maximum allowed execution time, in milliseconds
   * @protected
   */
  _callbackExecutionTimeout(action, timeout) {
    this.log(`Callback timeout on ${action}: ${timeout}ms`);

    this._component._replyWithError(
      `Timeout in execution of ${this._name} (${this._version}) for asynchronous action: ${action}`,
      500,
      'Internal Server Error'
    );
  }

  /**
   * Returns whether or not the component is currently running in debug mode
   *
   * @return {boolean}
   */
  isDebug() {
    return this._debug;
  }

  /**
   * Get framework version
   *
   * @return {string}
   */
  getFrameworkVersion() {
    return this._frameworkVersion;
  }

  /**
   * Get user source file path
   *
   * @return {string}
   */
  getPath() {
    return this._path;
  }

  /**
   * Get name of the component
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Get version of the component
   *
   * @return {string}
   */
  getVersion() {
    return this._version;
  }

  /**
   * Get variables
   *
   * @return {Object}
   */
  getVariables() {
    return this._variables;
  }

  /**
   * Get variable value
   *
   * @param {string} name Name of the variable
   * @return {string|null}
   */
  getVariable(name) {
    return this._variables[name] || null;
  }

  hasResource(name) {
    return this._component.hasResource(name);
  }

  getResource(name) {
    return this._component.getResource(name);
  }

  getServices() {
    // Don' include the schema
    return this._component.servicesMapping.map((v) => ({name: v.name, version: v.version}));
  }

  /**
   *
   * @param {string} name
   * @param {string} version
   * @return {ServiceSchema}
   */
  getServiceSchema(name, version) {
    if (!this._component.servicesMapping || this._component.servicesMapping.length === 0) {
      throw new Error('Cannot get service schema. No mapping provided');
    }

    const service = this._component.servicesMapping.find((definition) =>
      name === definition.schema.getName()
      &&
      semver.satisfies(definition.schema.getVersion(), version)
    );

    if (service) {
      return service.schema;
    }

    throw new Error(`Cannot resolve schema for Service: ${name} (${version})`);
  }

  /**
   *
   * @param {*} value
   * @return {boolean}
   */
  log(value) {
    return this._component.log(value);
  }

}

module.exports = Api;
