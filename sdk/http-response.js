'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

const _data = Symbol('data');
const _statusCode = Symbol('statusCode');
const _statusText = Symbol('statusText');

class HttpResponse {
  constructor(data) {
    this[_data] = Immutable.fromJS(data);
    [this[_statusCode], ...this[_statusText]] = this[_data].get('status').split(' ');
    this[_statusCode] = parseInt(this[_statusCode], 10);
    this[_statusText] = this[_statusText].join(' ');
  }

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

  setProtocolVersion(version) {
    if (_.isNil(version)) {
      throw new Error('Specify a protocol `version`');
    } else if (!_.isString(version)) {
      throw new TypeError('The protocol `version` must be a string');
    }

    this[_data] = this[_data].set('version', version);
    return true;
  }

  isStatus(status) {
    if (_.isNil(status)) {
      throw new Error('Specify a `status`');
    } else if (!_.isString(status)) {
      throw new TypeError('The `status` must be a string');
    }
    return this[_data].get('status') === status;
  }

  getStatus() {
    return this[_data].get('status');
  }

  getStatusCode() {
    return this[_statusCode];
  }

  getStatusText() {
    return this[_statusText];
  }

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
    return true;
  }

  hasHeader(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return this[_data].hasIn(['headers', name]);
  }

  getHeader(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a header `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The header `name` must be a string');
    }

    return this[_data].getIn(['headers', name]) || '';
  }

  getHeaders() {
    return this[_data].has('headers') ? this[_data].get('headers').toJS() : {};
  }

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

    this[_data] = this[_data].setIn(['headers', name], value);
    return true;
  }

  hasBody() {
    return this[_data].has('body') && this[_data].get('body').length > 0;
  }

  getBody() {
    return this[_data].get('body') || '';
  }

  setBody(content) {
    this[_data] = this[_data].set('body', String(content));
  }
}

module.exports = HttpResponse;
