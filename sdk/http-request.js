'use strict';

const url = require('url');
const _ = require('lodash');
const Immutable = require('immutable');
const File = require('./file');

const _data = Symbol('data');

class HttpRequest {
  constructor(data) {
    this[_data] = Immutable.fromJS(data);
  }

  isMethod(method) {
    return this[_data].get('method').toLowerCase() === method.toLowerCase();
  }

  getMethod() {
    return this[_data].get('method').toUpperCase();
  }

  getUrl() {
    return this[_data].get('url');
  }

  getUrlScheme() {
    return url.parse(this[_data].get('url')).protocol;
  }

  getUrlHost() {
    return url.parse(this[_data].get('url')).host;
  }

  getUrlPath() {
    return url.parse(this[_data].get('url')).pathname;
  }

  hasQueryParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['query', name]);
  }

  getQueryParam(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['query', name]) ?
      this[_data].getIn(['query', name, 0]) : defaultValue;
  }

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
   * @return {Array}
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

  hasPostParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['postData', name]);
  }

  getPostParam(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return this[_data].hasIn(['postData', name]) ?
      this[_data].getIn(['postData', name, 0]) : defaultValue;
  }

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
   * @return {Object}
   */
  getPostParamsArray() {
    return this[_data].get('postData').toJS();
  }

  /**
   *
   * @return {Array}
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

  getProtocolVersion() {
    return this[_data].get('version');
  }

  hasHeader(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return this[_data].hasIn(['headers', name]);
  }

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

  getHeaders() {
    return this[_data].has('headers') ? this[_data].get('headers').toJS() : {};
  }

  hasBody() {
    return this[_data].has('body') && this[_data].get('body').length > 0;
  }

  getBody() {
    return this[_data].get('body') || '';
  }

  hasFile(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    return this[_data].hasIn(['files', name]);
  }

  getFile(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    return this[_data].getIn(['files', name]) || new File(name, '');
  }

  getFiles() {
    return this[_data].get('files').toJS();
  }
}

function _isStringArray(values) {
  return values.filter(_.isString).length === values.length;
}

module.exports = HttpRequest;
