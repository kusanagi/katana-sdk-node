'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

const _data = Symbol('data');
const _statusCode = Symbol('statusCode');
const _statusText = Symbol('statusText');

/**
 *
 */
class HttpResponse {
  /**
   *
   * @param {Object} data
   */
  constructor(data) {
    this[_data] = Immutable.fromJS(data);
    const parts = this[_data].get('status').split(' ');

    this[_statusCode] = parseInt(parts[0], 10);
    this[_statusText] = parts.slice(1).join(' ');
  }

  /**
   *
   * @param version
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
   * @param version
   * @return {boolean}
   */
  setProtocolVersion(version) {
    if (_.isNil(version)) {
      throw new Error('Specify a protocol `version`');
    } else if (!_.isString(version)) {
      throw new TypeError('The protocol `version` must be a string');
    }

    this[_data] = this[_data].set('version', version);
    return true;
  }

  /**
   *
   * @param status
   * @return {boolean}
   */
  isStatus(status) {
    if (_.isNil(status)) {
      throw new Error('Specify a `status`');
    } else if (!_.isString(status)) {
      throw new TypeError('The `status` must be a string');
    }
    return this[_data].get('status') === status;
  }

  /**
   * @return string
   */
  getStatus() {
    return this[_data].get('status');
  }

  /**
   *
   * @return {number}
   */
  getStatusCode() {
    return this[_statusCode];
  }

  /**
   *
   * @return {string}
   */
  getStatusText() {
    return this[_statusText];
  }

  /**
   *
   * @param code
   * @param text
   * @return {HttpResponse}
   */
  setStatus(code, text) {
    if (_.isNil(code)) {
      throw new Error('Specify a status `code`');
    } else if (!_.isInteger(code)) {
      throw new TypeError('The status `code` must be an integer');
    }

    if (_.isNil(text)) {
      throw new Error('Specify a status `text`');
    } else if (!_.isString(text)) {
      throw new TypeError('The status `text` must be a string');
    }

    this[_data] = this[_data].set('status', `${code} ${text}`);

    return this;
  }

  /**
   *
   * @param name
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
   * @return {array}
   */
  getHeaderArray(name, defaultValue = []) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return this[_data].getIn(['headers', name]) ?
      this[_data].getIn(['headers', name])
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
   * @return {array}
   */
  getHeadersArray() {
    return this[_data].has('headers') ? this[_data].get('headers').toJS() : [];
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   * @return {HttpResponse}
   */
  setHeader(name, value) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    if (_.isNil(value)) {
      throw new Error('Specify a header `value`');
    } else if (!_.isString(value)) {
      throw new TypeError('The header `value` must be a string');
    }

    let header = this[_data].getIn(['headers', name]);

    if (header === undefined) {
      header = [];
    }

    header.push(value);

    this[_data] = this[_data].setIn(['headers', name], header);

    return this;
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
   * @param content
   * @return {HttpResponse}
   */
  setBody(content) {
    this[_data] = this[_data].set('body', String(content));

    return this;
  }
}

module.exports = HttpResponse;
