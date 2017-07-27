'use strict';

const _ = require('lodash');
const logger = require('./logger');

const NULL = 'null';
const BOOLEAN = 'boolean';
const INTEGER = 'integer';
const FLOAT = 'float';
const STRING = 'string';
const ARRAY = 'array';
const OBJECT = 'object';

const types = [
  NULL,
  BOOLEAN,
  INTEGER,
  FLOAT,
  STRING,
  ARRAY,
  OBJECT
];

/**
 * Param class
 */
class Param {
  /**
   * Create a File instance
   *
   * @param {string} name The name of the parameter
   * @param {string} [value=''] Value of the parameter
   * @param {string} [type=string] The data type of the parameter
   * @param {boolean} [exists=false] Determines if the parameter exists
   */
  constructor(name, value = '', type = STRING, exists = false) {
    if (type !== '' && !~types.indexOf(type)) {
      type = STRING;
    }

    this._name = name;
    this._value = value;
    this._type = type;
    this._exists = exists;
  }

  /**
   * Return the name of the parameter
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the value of the parameter
   *
   * @return {null|boolean|number|string|array|object}
   */
  getValue() {
    if (this._type === STRING) {
      return String(this._value);
    } else if (this._type === INTEGER) {
      return Number.parseInt(this._value, 10);
    } else if (this._type === FLOAT) {
      return Number.parseFloat(this._value);
    } else {
      try {
        return JSON.parse(this._value);
      } catch (err) {
        logger.error(`Param ${this._name} is not ${this._type}: ${this._value}`);
      }
    }
  }

  /**
   * Return the type of the parameter
   *
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * Determine if the parameter exists in the request
   *
   * @return {boolean}
   */
  exists() {
    return this._exists;
  }

  /**
   * Return a new instance of Param object with a new name
   *
   * @param {string} name Name of the parameter
   * @return {Param}
   */
  copyWithName(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return new Param(name, this, this._value, this._type, this._exists);
  }

  /**
   * Return a new instance of Param object with a new value
   *
   * @param {string} value Value of the parameter
   * @return {Param}
   */
  copyWithValue(value) {
    if (_.isNil(value)) {
      throw new Error('Specify a param `value`');
    } else if (!_.isString(value)) {
      throw new TypeError('The param `value` must be a string');
    }

    return new Param(this._name, value, this._type, this._exists);
  }

  /**
   * Return a new instance of Param object with a new type
   *
   * @param {string} type Type of the parameter
   * @return {Param}
   */
  copyWithType(type) {
    if (_.isNil(type)) {
      throw new Error('Specify a param `type`');
    } else if (!_.isString(type)) {
      throw new TypeError('The param `type` must be a string');
    }

    return new Param(this._name, this._value, type, this._exists);
  }
}

/**
 * Param types
 *
 * @memberof Param
 * @type {Object}
 * @property {string} NULL=null null type
 * @property {string} BOOLEAN=boolean boolean type
 * @property {string} INTEGER=integer integer type
 * @property {string} FLOAT=float float type
 * @property {string} STRING=string string type
 * @property {string} ARRAY=array array type
 * @property {string} OBJECT=object object type
 */
Param.types = {
  NULL,
  BOOLEAN,
  INTEGER,
  FLOAT,
  STRING,
  ARRAY,
  OBJECT
};

module.exports = Param;
