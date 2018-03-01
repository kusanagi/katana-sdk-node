/*
 * NODE SDK for the KATANA(tm) Framework (http://katana.kusanagi.io)
 * Copyright (c) 2016-2018 KUSANAGI S.L. All rights reserved.
 *
 * Distributed under the MIT license
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code
 *
 * @link      https://github.com/kusanagi/katana-sdk-node
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @copyright Copyright (c) 2016-2018 KUSANAGI S.L. (http://kusanagi.io)
 */

'use strict';

/* eslint max-params: ["error", 15] */

const Api = require('./api');
const _   = require('lodash');

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
   * @param returnValue
   * @param {Request} parentRequest
   * @param {Object} requestAttributes
   */
  constructor(
    component, path, name, version, frameworkVersion, variables, debug,
    httpRequest, httpResponse, transport,
    protocol, gatewayAddress,
    returnValue, parentRequest, requestAttributes
  ) {
    super(component, path, name, version, frameworkVersion, variables, debug);

    this._httpRequest       = httpRequest;
    this._httpResponse      = httpResponse;
    this._transport         = transport;
    this._return            = returnValue;
    this._protocol          = protocol;
    this._gatewayAddress    = gatewayAddress;
    this._parentRequest     = parentRequest;
    this._requestAttributes = requestAttributes;
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
    return this._transport._getAsReadOnlyCopy();
  }

  /**
   * @return {boolean}
   */
  hasReturn() {
    return !!this._return;
  }

  /**
   * @return {array|number|boolean|string}
   */
  getReturn() {
    return this._return;
  }

  /**
   * @return {array|number|boolean|string}
   * @protected
   */
  _getReturnType() {
    if (this.return) {
      return this.return;
    }

    return this.getServiceSchema(this._name, this._version)
      .getActionSchema(this._actionName)
      .getReturnType();
  }

  /**
   * Get a request attribute
   *
   * @param {string} name Name of the attribute
   * @param {string} defaultValue Default return value of the attribute
   * @return {String}
   */
  getRequestAttribute(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify an attribute `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    } else if (!_.isString(defaultValue)) {
      throw new TypeError('The param `defaultValue` must be a string');
    }

    return this._requestAttributes[name] || defaultValue;
  }

  /**
   *
   * @returns {[String]}
   */
  getRequestAttributes() {
    return this._requestAttributes;
  }
}

module.exports = Response;
