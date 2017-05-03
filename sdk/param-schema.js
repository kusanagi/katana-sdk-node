'use strict';

/* eslint max-params: ["error", 21] */

const Schema          = require('./schema');
const HttpParamSchema = require('./http-param-schema');
const m               = require('./mappings');

/**
 * Represents a parameter schema in the framework
 * @see https://github.com/kusanagi/katana-sdk-spec#93-param-schema
 */
class ParamSchema extends Schema {
  /**
   *
   * @param {string} name
   * @param {string} type
   * @param {string} format
   * @param {string} arrayFormat
   * @param {string} pattern
   * @param {boolean} allowEmpty
   * @param {string} defaultValue
   * @param {boolean} required
   * @param {Object} items
   * @param {number} max
   * @param {boolean} exclusiveMax
   * @param {number} min
   * @param {boolean} exclusiveMin
   * @param {number} maxLength
   * @param {number} minLength
   * @param {number} maxItems
   * @param {number} minItems
   * @param {string} uniqueItems
   * @param {array} enumList
   * @param {number} multipleOf
   * @param {HttpParamSchema} httpParamSchema
   *
   */
  constructor(
    name, type, format, arrayFormat, pattern, allowEmpty, defaultValue, required, items, max,
    exclusiveMax, min, exclusiveMin, maxLength, minLength, maxItems, minItems, uniqueItems,
    enumList, multipleOf, httpParamSchema
  ) {
    super();

    this._name            = name;
    this._type            = type;
    this._format          = format;
    this._arrayFormat     = arrayFormat;
    this._pattern         = pattern;
    this._allowEmpty      = allowEmpty;
    this._defaultValue    = defaultValue;
    this._required        = required;
    this._items           = items;
    this._max             = max;
    this._exclusiveMax    = exclusiveMax;
    this._min             = min;
    this._exclusiveMin    = exclusiveMin;
    this._maxLength       = maxLength;
    this._minLength       = minLength;
    this._maxItems        = maxItems;
    this._minItems        = minItems;
    this._uniqueItems     = uniqueItems;
    this._enumList        = enumList;
    this._multipleOf      = multipleOf;
    this._httpParamSchema = httpParamSchema;

  }

  /**
   *
   * @param {string} name
   * @param {Object} mapping
   * @returns {ParamSchema}
   */
  static fromMapping(name, mapping) {
    return new ParamSchema(
      name, // this.readProperty(mapping, m.name) // TODO: Switch this if the mapping property wins
      this.readProperty(mapping, m.type, 'string'),
      this.readProperty(mapping, m.format, ''),
      this.readProperty(mapping, m.array_format, 'csv'),
      this.readProperty(mapping, m.pattern, ''),
      this.readProperty(mapping, m.allow_empty, false),
      this.readProperty(mapping, m.default_value, null),
      this.readProperty(mapping, m.required, false),
      this.readProperty(mapping, m.items, ''),
      this.readProperty(mapping, m.maximum, Number.MAX_VALUE),
      this.readProperty(mapping, m.exclusive_maximum, false),
      this.readProperty(mapping, m.minimum, Number.MIN_VALUE),
      this.readProperty(mapping, m.exclusive_minimum, false),
      this.readProperty(mapping, m.maximum_length, -1),
      this.readProperty(mapping, m.minimum_length, -1),
      this.readProperty(mapping, m.maximum_items, -1),
      this.readProperty(mapping, m.minimum_items, -1),
      this.readProperty(mapping, m.unique_items, false),
      this.readProperty(mapping, m.enum, []),
      this.readProperty(mapping, m.multiple_of, -1),
      HttpParamSchema.fromMapping(mapping[m.http])
    );
  }

  /**
   * @returns {string}
   */
  getName() {
    return this._name;
  }

  /**
   *
   * @returns {string}
   */
  getType() {
    return this._type;
  }

  /**
   *
   * @returns {string}
   */
  getFormat() {
    return this._format;
  }

  /**
   *
   * @returns {string}
   */
  getArrayFormat() {
    return this._arrayFormat;
  }

  /**
   *
   * @returns {string}
   */
  getPattern() {
    return this._pattern;
  }

  /**
   *
   * @returns {boolean}
   */
  allowEmpty() {
    return this._allowEmpty;
  }

  /**
   *
   * @returns {boolean}
   */
  hasDefaultValue() {
    return typeof this._defaultValue !== typeof undefined;
  }

  /**
   *
   * @returns {string}
   */
  getDefaultValue() {
    return this._defaultValue;
  }

  /**
   *
   * @returns {boolean}
   */
  isRequired() {
    return this._required;
  }

  /**
   *
   * @returns {Object}
   */
  getItems() {
    return this._items;
  }

  /**
   *
   * @returns {number}
   */
  getMax() {
    return this._max;
  }

  /**
   *
   * @returns {boolean}
   */
  isExclusiveMax() {
    return this._exclusiveMax;
  }

  /**
   *
   * @returns {number}
   */
  getMin() {
    return this._min;
  }

  /**
   *
   * @returns {boolean}
   */
  isExclusiveMin() {
    return this._exclusiveMin;
  }

  /**
   *
   * @returns {number}
   */
  getMaxLength() {
    return this._maxLength;
  }

  /**
   *
   * @returns {number}
   */
  getMinLength() {
    return this._minLength;
  }

  /**
   *
   * @returns {number}
   */
  getMaxItems() {
    return this._maxItems;
  }

  /**
   *
   * @returns {number}
   */
  getMinItems() {
    return this._minItems;
  }

  /**
   *
   * @returns {string}
   */
  hasUniqueItems() {
    return this._uniqueItems;
  }

  getEnum() {
    return this._enumList;
  }

  /**
   *
   * @returns {number}
   */
  getMultipleOf() {
    return this._multipleOf;
  }

  /**
   *
   * @returns {HttpParamSchema}
   */
  getHttpSchema() {
    return this._httpParamSchema;
  }

}

module.exports = ParamSchema;
