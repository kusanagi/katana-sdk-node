'use strict';

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
      name === definition.schema.getName() && version === definition.schema.getVersion()
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
