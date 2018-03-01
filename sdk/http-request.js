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

const url = require('url');
const _ = require('lodash');
const Immutable = require('immutable');
const File = require('./file');

const _data = Symbol('data');

/**
 *
 */
class HttpRequest {
  /**
   *
   * @param {Object} data Initial request data
   */
  constructor(data) {
    this[_data] = Immutable.fromJS(data);
  }

  /**
   *
   * @param {string} method
   * @return {boolean}
   */
  isMethod(method) {
    return this[_data].get('method').toLowerCase() === method.toLowerCase();
  }

  /**
   *
   * @return {string}
   */
  getMethod() {
    return this[_data].get('method').toUpperCase();
  }

  /**
   *
   * @return {string}
   */
  getUrl() {
    return this[_data].get('url');
  }

  /**
   *
   * @return {string}
   */
  getUrlScheme() {
    return url.parse(this[_data].get('url')).protocol;
  }

  /**
   * @return {string}
   */
  getUrlHost() {
    return url.parse(this[_data].get('url')).host;
  }

  /**
   *
   * @return {string}
   */
  getUrlPath() {
    return url.parse(this[_data].get('url')).pathname;
  }

  /**
   *
   * @param {string} name
   * @return {boolean}
   */
  hasQueryParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['query', name]);
  }

  /**
   *
   * @param {string} name
   * @param {string} defaultValue
   * @return {string}
   */
  getQueryParam(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['query', name]) ?
      this[_data].getIn(['query', name, 0]) : defaultValue;
  }

  /**
   *
   * @param {string} name
   * @param {string} defaultValue
   * @return {string}
   */
  getQueryParamArray(name, defaultValue) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    if (!_.isNil(defaultValue)) {
      if (!_.isArray(defaultValue)) {
        throw new Error('The `defaultValue` must be an array');
      } else if (!defaultValue.length || !_isStringArray(defaultValue)) {
        throw new Error('The `defaultValue` must be an array of strings');
      }
    } else {
      defaultValue = [];
    }

    return this[_data].hasIn(['query', name]) ?
      this[_data].getIn(['query', name]).toJS() : defaultValue;
  }

  /**
   *
   * @return {string[]}
   */
  getQueryParams() {
    const queryParams = this.getQueryParamsArray();
    return Object.keys(queryParams).map((key) => queryParams[key]);
  }

  /**
   *
   * @return {Object}
   */
  getQueryParamsArray() {
    return this[_data].getIn(['query']).toJS();
  }

  /**
   *
   * @param {string} name
   * @return {boolean}
   */
  hasPostParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['postData', name]);
  }

  /**
   *
   * @param name
   * @param defaultValue
   * @return {*}
   */
  getPostParam(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['postData', name]) ?
      this[_data].getIn(['postData', name, 0]) : defaultValue;
  }

  /**
   *
   * @param name
   * @param defaultValue
   * @return {any | *}
   */
  getPostParamArray(name, defaultValue) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    if (!_.isNil(defaultValue)) {
      if (!_.isArray(defaultValue)) {
        throw new TypeError('The `defaultValue` must be an array');
      } else if (!defaultValue.length || !_isStringArray(defaultValue)) {
        throw new TypeError('The `defaultValue` must be an array of strings');
      }
    } else {
      defaultValue = [];
    }

    return this[_data].hasIn(['postData', name]) ?
      this[_data].getIn(['postData', name]).toJS() : defaultValue;
  }

  /**
   * @return {Object[]}
   */
  getPostParamsArray() {
    return this[_data].get('postData').toJS();
  }

  /**
   *
   * @return {Object[]}
   */
  getPostParams() {
    const paramsMap = this.getPostParams();
    return Object.keys(paramsMap).map((key) => ({
        name: key,
        value: paramsMap[key],
      }));
  }

  /**
   *
   * @param {string} version
   * @return {boolean}
   */
  isProtocolVersion(version) {
    if (_.isNil(version)) {
      throw new Error('Specify a protocol `version`');
    } else if (!_.isString(version)) {
      throw new TypeError('The protocol `version` must be a string');
    }

    return this[_data].get('version') === version;
  }

  /**
   * @return {string}
   */
  getProtocolVersion() {
    return this[_data].get('version');
  }

  /**
   *
   * @param {string} name
   * @return {boolean}
   */
  hasHeader(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return this[_data].hasIn(['headers', name]);
  }

  /**
   *
   * @param {string} name
   * @param {string} defaultValue
   * @return {string}
   */
  getHeader(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return Immutable.List.isList(this[_data].getIn(['headers', name], defaultValue)) ?
      this[_data].getIn(['headers', name], defaultValue).get(0)
      :
      this[_data].getIn(['headers', name], defaultValue);
  }

  /**
   *
   * return {array}
   */
  getHeaderArray(name, defaultValue = []) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return this[_data].getIn(['headers', name]) ?
      this[_data].getIn(['headers', name]).toJS()
      :
      defaultValue;
  }

  /**
   *
   * @return {Object}
   */
  getHeaders() {
    if (!this[_data].has('headers')) {
      return {};
    }
    const headers = this[_data].get('headers').toJS();
    let headersObject = {};
    Object.keys(headers).map((key) => {
      headersObject[key] = this[_data].getIn(['headers', key]).get(0);
    });
    return headersObject;
  }

  /**
   *
   */
  getHeadersArray() {
    return this[_data].has('headers') ? this[_data].get('headers').toJS() : [];
  }

  /**
   *
   * @return {boolean}
   */
  hasBody() {
    return this[_data].has('body') && this[_data].get('body').length > 0;
  }

  /**
   *
   * @return {string}
   */
  getBody() {
    return this[_data].get('body') || '';
  }

  /**
   *
   * @param name
   * @return {boolean}
   */
  hasFile(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    return this[_data].hasIn(['files', name]);
  }

  /**
   *
   * @param name
   * @return {File}
   */
  getFile(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    return this[_data].getIn(['files', name]) || new File(name, '');
  }

  /**
   *
   * @return {File[]}
   */
  getFiles() {
    return this[_data].get('files').toJS();
  }
}

function _isStringArray(values) {
  return values.filter(_.isString).length === values.length;
}

module.exports = HttpRequest;
