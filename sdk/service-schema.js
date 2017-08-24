'use strict';

const m                 = require('./mappings');
const HttpServiceSchema = require('./http-service-schema');
const ActionSchema      = require('./action-schema');
const Schema            = require('./schema');

/**
 *
 */
class ServiceSchema extends Schema {
  /**
   *
   * @param {string} name
   * @param {string} version
   * @param {string} address
   * @param {HttpServiceSchema} httpSchema
   * @param {Object} actions
   * @param {boolean} [fileServer=false]
   */
  constructor(name, version, address, httpSchema, actions, fileServer = false) {
    super();

    this._name       = name;
    this._version    = version;
    this._address    = address;
    this._httpSchema = httpSchema;
    this._actions    = actions;
    this._fileServer = fileServer;
  }

  /**
   *
   * @param {string} name
   * @param {string} version
   * @param {Object} mapping
   * @returns {ServiceSchema}
   * @see https://github.com/kusanagi/katana-sdk-spec#522-mapping
   */
  static fromMapping(name, version, mapping) {
    const actions = {};

    Object.keys(mapping[m.actions] || {}).forEach((actionName) => {
      actions[actionName] = ActionSchema.fromMapping(actionName, mapping[m.actions][actionName]);
    });

    return new ServiceSchema(
      name,
      version,
      mapping[m.address],
      HttpServiceSchema.fromMapping(mapping[m.http]),
      actions,
      this.readProperty(mapping, m.files, false)
    );
  }

  /**
   *
   * @returns {string}
   */
  getName() {
    return this._name;
  }

  /**
   *
   * @returns {string}
   */
  getVersion() {
    return this._version;
  }

  /**
   *
   * @returns {string}
   */
  getAddress() {
    return this._address;
  }

  /**
   *
   * @returns {boolean}
   */
  hasFileServer() {
    return this._fileServer;
  }

  /**
   *
   * @returns {Object[]}
   */
  getActions() {
    return Object.keys(this._actions);
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasAction(name) {
    return typeof this._actions[name] !== typeof undefined;
  }

  /**
   *
   * @param {string} name
   * @returns {ActionSchema}
   */
  getActionSchema(name) {
    if (!this.hasAction(name)) {
      throw new Error(`Cannot resolve schema for action: ${name}`);
    }

    return this._actions[name];
  }

  /**
   *
   * @returns {HttpServiceSchema}
   */
  getHttpSchema() {
    return this._httpSchema;
  }
}

module.exports = ServiceSchema;
