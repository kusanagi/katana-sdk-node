'use strict';

const Schema = require('./schema');
const m      = require('./mappings');
// const logger      = require('./logger');

/**
 * @see Action schema > E (entity) at https://github.com/kusanagi/katana-sdk-spec#522-mapping
 */
class ActionEntity extends Schema {

  /**
   *
   * @param {string} entityPath
   * @param {string} pathDelimiter
   * @param {string} primaryKey
   * @param {boolean} collection
   * @param {Object} definition
   */
  constructor(entityPath, pathDelimiter, primaryKey, collection, definition = null) {
    super();

    this._entityPath    = entityPath;
    this._pathDelimiter = pathDelimiter;
    this._primaryKey    = primaryKey;
    this._collection    = collection;
    this._definition    = ActionEntity._parseDefinition(definition);
  }

  static _parseDefinition(mapping) {
    if (!mapping) {
      return null;
    }

    const result = {
      validate: this.readProperty(mapping, m.validate, false),
    };

    if (mapping[m.field]) {
      result.field = this.readProperty(mapping, m.field, []).map(this._parseField);
    }

    if (mapping[m.fields]) {
      result.fields = this.readProperty(mapping, m.fields, []).map(this._parseFields);
    }

    return result;
  }

  /**
   *
   * @returns {Object}
   */
  static _parseField(mapping) {
    const field = {
      name: mapping[m.name],
      type: mapping[m.type],
    };

    // Spec doesn't say it should be left out if not specified, but we're only including it if it is
    if (mapping[m.optional]) {
      field.optional = mapping[m.optional];
    }

    return field;
  }

  /**
   *
   * @returns {Object}
   */
  static _parseFields(mapping) {
    const fields = {
      name: mapping[m.name],
    };

    // Spec doesn't say it should be left out if not specified, but we're only including it if it is
    if (mapping[m.optional]) {
      fields.optional = mapping[m.optional];
    }

    if (mapping[m.field]) {
      fields.field = this._parseField(mapping[m.field]);
    }

    if (mapping[m.fields]) {
      fields.fields = this._parseField(mapping[m.fields]);
    }

    return fields;
  }

  /**
   *
   * @returns {boolean}
   */
  hasDefinition() {
    return this._definition !== null;
  }

  /**
   *
   * @returns {Object}
   */
  getDefinition() {
    return this._definition;
  }

  /**
   *
   * @returns {boolean}
   */
  isCollection() {
    return this._collection;
  }

  /**
   *
   * @returns {string}
   */
  getEntityPath() {
    return this._entityPath;
  }

  /**
   *
   * @returns {string}
   */
  getPathDelimiter() {
    return this._pathDelimiter;
  }

  /**
   *
   * @returns {string}
   */
  getPrimaryKey() {
    return this._primaryKey;
  }
}

module.exports = ActionEntity;
