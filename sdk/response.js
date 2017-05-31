'use strict';

/* eslint max-params: ["error", 12] */

const Api = require('./api');

/**
 * Represents a response in the framework.
 *
 * @extends Api
 * @see https://github.com/kusanagi/katana-sdk-spec#72-response
 */
class Response extends Api {
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
   * @param {HttpResponse} httpResponse
   * @param {Transport} transport
   * @param {string} protocol
   * @param {string} gatewayAddress
   */
  constructor(
    component, path, name, version, frameworkVersion, variables, debug,
    httpRequest, httpResponse, transport,
    protocol, gatewayAddress
  ) {
    super(component, path, name, version, frameworkVersion, variables, debug);

    this._httpRequest    = httpRequest;
    this._httpResponse   = httpResponse;
    this._transport      = transport;
    this._protocol       = protocol;
    this._gatewayAddress = gatewayAddress;
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
   * @returns {HttpRequest}
   */
  getHttpRequest() {
    return this._httpRequest;
  }

  /**
   *
   * @returns {HttpResponse}
   */
  getHttpResponse() {
    return this._httpResponse;
  }

  /**
   *
   * @returns {Transport}
   */
  getTransport() {
    return this._transport;
  }

  /**
   * @return {boolean}
   */
  hasReturn() {
    return this
      .getServiceSchema(this._name, this._version)
      .getActionSchema(this._actionName)
      .hasReturn();
  }

  /**
   * @return {array|number|boolean|string}
   */
  getReturnType() {
    if (this.return) {
      return this.return;
    }

    return this.getServiceSchema(this._name, this._version)
      .getActionSchema(this._actionName)
      .getReturnType();
  }
}

module.exports = Response;
