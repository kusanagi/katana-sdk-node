'use strict';

/* eslint max-params: ["error", 12] */

const _            = require('lodash');
const Api          = require('./api');
const Response     = require('./response');
const HttpResponse = require('./http-response');
const HttpRequest  = require('./http-request');
const Param        = require('./param');
const Transport    = require('./transport');

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
   */
  constructor(
    component, path, name, version, frameworkVersion, variables, debug,
    httpRequest, serviceCall,
    protocol, gatewayAddress, clientAddress
  ) {
    super(component, path, name, version, frameworkVersion, variables, debug);

    this._httpRequest = httpRequest;
    this._call        = serviceCall;

    this._protocol       = protocol;
    this._gatewayAddress = gatewayAddress;
    this._client         = clientAddress;
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
    this.params[param.getName()] = param;

    return this;
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   * @param {string} type
   * @return {Param}
   */
  newParam(name, value, type) {
    return new Param(name, value, type, false);
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
      this._gatewayAddress
    );
  }

  /**
   *
   * @returns {HttpRequest}
   */
  getHttpRequest() {
    return this._httpRequest;
  }
}

module.exports = Request;
