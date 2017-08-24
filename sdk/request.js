'use strict';

/* eslint max-params: ["error", 13] */

const _            = require('lodash');
const Api          = require('./api');
const Response     = require('./response');
const HttpResponse = require('./http-response');
const HttpRequest  = require('./http-request');
const Param        = require('./param');
const Transport    = require('./transport');

const m = require('./mappings');

/**
 * Request class
 *
 * @extends Api
 * @see https://github.com/kusanagi/katana-sdk-spec#71-request
 */
class Request extends Api {
  /**
   *
   * @param {Component} component
   * @param {string} path
   * @param {string} name
   * @param {string} version
   * @param {string} frameworkVersion
   * @param {Object} variables
   * @param {boolean} debug
   * @param {HttpRequest} httpRequest
   * @param {ServiceCall} serviceCall
   * @param {string} protocol
   * @param {string} gatewayAddress
   * @param {string} clientAddress
   * @param {string} params
   */
  constructor(
    component, path, name, version, frameworkVersion, variables, debug,
    httpRequest, serviceCall,
    protocol, gatewayAddress, clientAddress, params
  ) {
    super(component, path, name, version, frameworkVersion, variables, debug);

    this._httpRequest = httpRequest;
    this._call        = serviceCall;

    this._protocol       = protocol;
    this._gatewayAddress = gatewayAddress;
    this._client         = clientAddress;
    this._params         = params || {};
  }

  /**
   *
   * @returns {string}
   */
  getId() {
    throw new Error('Not implemented');
  }

  /**
   *
   * @returns {string}
   */
  getTimestamp() {
    throw new Error('Not implemented');
  }

  /**
   *
   * @returns {string}
   */
  getGatewayProtocol() {
    return this._protocol;
  }

  /**
   *
   * @returns {string}
   */
  getGatewayAddress() {
    return this._gatewayAddress;
  }

  /**
   *
   * @returns {string}
   */
  getClientAddress() {
    return this._client;
  }

  /**
   *
   * @returns {string}
   */
  getServiceName() {
    return this._call.getServiceName();
  }

  /**
   *
   * @param service
   * @return {Request}
   */
  setServiceName(service) {
    if (_.isNil(service)) {
      throw new Error('Specify a `service` name');
    } else if (!_.isString(service)) {
      throw new TypeError('The `service` name must be a string');
    }

    this._call.setServiceName(service);

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getServiceVersion() {
    return this._call.getVersion();
  }

  /**
   *
   * @returns {Request}
   */
  setServiceVersion(version) {
    if (_.isNil(version)) {
      throw new Error('Specify a service `version`');
    } else if (!_.isString(version)) {
      throw new TypeError('The service `version` must be a string');
    }

    this._call.setVersion(version);

    return this;
  }

  /**
   *
   * @returns {string}
   */
  getActionName() {
    return this._call.getActionName();
  }

  /**
   *
   * @param {string} action
   * @return {Request}
   */
  setActionName(action) {
    if (_.isNil(action)) {
      throw new Error('Specify a service `action`');
    } else if (!_.isString(action)) {
      throw new TypeError('The service `action` must be a string');
    }

    this._call.setActionName(action);

    return this;
  }

  // hasParam() implemented in base class API
  // getParam() implemented in base class API
  // getParams() implemented in base class API

  /**
   *
   * @param {Param} param
   * @return {Request}
   */
  setParam(param) {
    if (!(param instanceof Param)) {
      throw new Error('`param` must be an instance of Param');
    }
    this._params[param.getName()] = param;

    return this;
  }

  /**
   * Create a new parameter
   *
   * @param {string} name Name of the param
   * @param {string} [value] Value of the param
   * @param {string} [type] type of the param
   * @return {Param}
   */
  newParam(name, value, type) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return new Param(name, value, type);
  }

  /**
   *
   * @param {number} code
   * @param {string} text
   * @return {Response}
   */
  newResponse(code = 200, text = 'OK') {
    if (_.isNil(code)) {
      throw new Error('Specify an HTTP status `code`');
    } else if (!_.isInteger(code)) {
      throw new TypeError('The status `code` must be an integer');
    }

    if (_.isNil(text)) {
      throw new Error('Specify a status `text`');
    } else if (!_.isString(text)) {
      throw new TypeError('The status `text` must be a string');
    }

    const version = this._httpRequest.getProtocolVersion();
    const status  = `${code} ${text}`;

    return new Response(
      this._component,
      this._path,
      this._name,
      this._version,
      this._frameworkVersion,
      this._variables,
      this._debug,
      new HttpRequest({}),
      new HttpResponse({version, status}),
      new Transport(),
      this._protocol,
      this._gatewayAddress,
      null,
      this
    );
  }

  /**
   *
   * @returns {HttpRequest}
   */
  getHttpRequest() {
    return this._httpRequest;
  }

  /**
   * Determine if a parameter was provided for the action
   *
   * @param {string} name Name of the param
   * @return {boolean}
   */
  hasParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return _.has(this._params, [name]);
  }

  /**
   * Get a parameter
   *
   * @param {string} name Name of the param
   * @return {Param}
   */
  getParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    const param = this._params[name];
    if (param instanceof Param) {
      return param;
    }
    return new Param(name, param[m.value], param[m.type], this.hasParam(name));
  }

  /**
   *
   * @returns {Param[]}
   */
  getParams() {
    return Object.keys(this._params).map(
      (name) => this._params[name] instanceof Param ? this._params[name] : new Param(
        name,
        this._params[name][m.value],
        this._params[name][m.type],
        this.hasParam(name)
      )
    );
  }
}

module.exports = Request;
