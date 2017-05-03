'use strict';

/*eslint max-params: ["error", 13]*/

const m                       = require('./mappings');
const Schema                  = require('./schema');
const ActionEntity            = require('./action-entity');
const ActionRelationSchema    = require('./action-relation-schema');
const ParamSchema             = require('./param-schema');
const FileSchema              = require('./file-schema');
const HttpActionSchema        = require('./http-action-schema');
const TransportFallbackSchema = require('./transport-fallback-schema');
const ReturnValueSchema       = require('./return-value-schema');

/**
 * Represents an action schema in the framework
 * @see https://github.com/kusanagi/katana-sdk-spec#92-action-schema
 */
class ActionSchema extends Schema {
  /**
   *
   * @param {string} name
   * @param {number} timeout In milliseconds
   * @param {TransportFallbackSchema} transportFallbackSchema
   * @param {ActionEntity} actionEntity
   * @param {HttpActionSchema} httpActionSchema
   * @param {boolean} deprecated
   * @param {Object} params
   * @param {Object} files
   * @param {[]} relations
   * @param {[]} calls
   * @param {[]} deferredCalls
   * @param {[]} remoteCalls
   * @param {ReturnValueSchema} returnValueSchema
   */
  constructor(
              name, timeout = 1000,
              actionEntity, transportFallbackSchema, httpActionSchema,
              deprecated,
              params  = {}, files = {}, relations = [],
              calls = [], deferredCalls = [], remoteCalls = [],
              returnValueSchema = null
  ) {
    super();

    this._name    = name;
    this._timeout = timeout;

    this._entity            = actionEntity;
    this._transportFallback = transportFallbackSchema;
    this._httpSchema        = httpActionSchema;

    this._deprecated = deprecated;

    this._params    = params;
    this._files     = files;
    this._relations = relations;

    this._calls         = calls;
    this._deferredCalls = deferredCalls;
    this._remoteCalls   = remoteCalls;

    this._returnValue = returnValueSchema;
  }

  /**
   *
   * @param {string} name
   * @param {Object} mapping
   * @returns {ActionSchema}
   */
  static fromMapping(name, mapping) {
    const transportFallbackSchema = TransportFallbackSchema.fromMapping(mapping[m.fallback]);

    const actionEntity = new ActionEntity(
      this.readProperty(mapping, m.entity_path, ''),
      this.readProperty(mapping, m.path_delimiter, '/'),
      this.readProperty(mapping, m.primary_key, 'id'),
      this.readProperty(mapping, m.collection, false),
      this.readProperty(mapping, m.entity, {})
    );

    const httpActionSchema  = HttpActionSchema.fromMapping(mapping[m.http]);
    const returnValueSchema = ReturnValueSchema.fromMapping(mapping[m.return]);

    const paramsObject = this.readProperty(mapping, m.params, {});
    // TODO: Params are supposed to have an OPTIONAL name property in their mapping. Which one wins?
    // In the mapping example the name is omitted in the param mapping, so we're going with the key
    const paramsArray = Object.keys(paramsObject).map((paramName) => {
      ParamSchema.fromMapping(paramName, paramsObject[paramName]);
    });

    const filesObject = this.readProperty(mapping, m.files, {});
    const filesArray  = Object.keys(filesObject).map((fileName) => {
      FileSchema.fromMapping(fileName, filesObject[fileName]);
    });

    return new ActionSchema(
      name,
      this.readProperty(mapping, m.timeout, 1000),
      actionEntity,
      transportFallbackSchema,
      httpActionSchema,

      this.readProperty(mapping, m.is_deprecated, false),

      paramsArray,
      filesArray,
      this.readProperty(mapping, m.relations, []).map(ActionRelationSchema.parseMapping),

      this.readProperty(mapping, m.calls, false),
      this.readProperty(mapping, m.deferred_calls, false),
      this.readProperty(mapping, m.remote_calls, false),

      returnValueSchema
    );
  }

  /**
   *
   * @returns {boolean}
   */
  isDeprecated() {
    return this._deprecated;
  }

  /**
   *
   * @returns {boolean}
   */
  isCollection() {
    return this._entity.isCollection();
  }

  /**
   *
   * @returns {string|*}
   */
  getName() {
    return this._name;
  }

  /**
   *
   * @returns {string}
   */
  getEntityPath() {
    return this._entity.getEntityPath();
  }

  /**
   *
   * @returns {string}
   */
  getPathDelimiter() {
    return this._entity.getPathDelimiter();
  }

  /**
   *
   * @returns {string}
   */
  getPrimaryKey() {
    return this._primaryKey;
  }

  /**
   *
   * @param {Object} data
   * @returns {Object}
   */
  resolveEntity(data) {
    if (!this._entityPath) {
      return data;
    }

    const keys = this._entityPath.split(this._pathDelimiter);

    keys.forEach((key) => {
      if (typeof data[key] === typeof undefined) {
        throw new Error(`Cannot resolve entity for action: ${this.getName()}`);
      }

      data = data[key];
    });

    return data;
  }

  /**
   *
   * @returns true
   */
  hasEntity() {
    return this._entity.hasDefinition();
  }

  /**
   *
   * @returns {Object}
   */
  getEntity() {
    return this._entity.getDefinition() || {};
  }

  /**
   *
   * @returns {boolean}
   */
  hasRelations() {
    return this._relations.length > 0;
  }

  /**
   *
   * @returns {[]}
   */
  getRelations() {
    return this._relations;
  }

  /**
   *
   * @param {[]} source
   * @param {string} name
   * @param {string} version
   * @param {string} action
   * @returns {boolean}
   * @private
   */
  static _hasCalls(source, name, version, action) {
    let matching = source.filter((call) => {
      const {serviceName, serviceVersion, actionName} = call;

      if (name !== serviceName) {
        return false;
      }
      if (version && version !== serviceVersion) {
        return false;
      }
      if (action && action !== actionName) {
        return false;
      }
    });

    return matching.length > 0;
  }

  /**
   *
   * @param {string} name
   * @param {string} version
   * @param {string} action
   * @returns {boolean}
   */
  hasCall(name, version = null, action = null) {
    return ActionSchema._hasCalls(this._calls, name, version, action);
  }

  /**
   *
   * @returns {boolean}
   */
  hasCalls() {
    return this._calls.length > 0;
  }

  /**
   *
   * @returns {[]}
   */
  getCalls() {
    return this._calls;
  }

  /**
   *
   * @param {string} name
   * @param {string} version
   * @param {string} action
   * @returns {boolean}
   */
  hasDeferCall(name, version = null, action = null) {
    return ActionSchema._hasCalls(this._deferredCalls, name, version, action);
  }

  /**
   *
   * @returns {boolean}
   */
  hasDeferCalls() {
    return this._deferredCalls.length > 0;
  }

  /**
   *
   * @returns {[]}
   */
  getDeferCalls() {
    return this._deferredCalls;
  }

  /**
   *
   * @param {string} address
   * @param {string} name
   * @param {string} version
   * @param {string} action
   * @returns {boolean}
   */
  // TODO: Rewrite using a rest/spread approach along with _hasCalls
  hasRemoteCall(address, name = null, version = null, action = null) {
    let matching = this._remoteCalls.filter((call) => {
      const {publicAddress, serviceName, serviceVersion, actionName} = call;

      if (address !== publicAddress) {
        return false;
      }

      if (name && name !== serviceName) {
        return false;
      }

      if (version && version !== serviceVersion) {
        return false;
      }
      if (action && action !== actionName) {
        return false;
      }
    });

    return matching.length > 0;
  }

  /**
   *
   * @returns {boolean}
   */
  hasRemoteCalls() {
    return this._remoteCalls.length > 0;
  }

  /**
   *
   * @returns {[]}
   */
  getRemoteCalls() {
    return this._remoteCalls;
  }

  /**
   *
   * @returns {boolean}
   */
  hasReturn() {
    return this._returnValue !== null;
  }

  /**
   *
   * @returns {string}
   */
  getReturnType() {
    return this._returnValue.getType();
  }

  /**
   *
   * @returns {Object}
   */
  getParams() {
    return this._params;
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasParam(name) {
    return typeof this._params[name] !== typeof undefined;
  }

  /**
   *
   * @param {string} name
   * @returns {ParamSchema}
   */
  getParamSchema(name) {
    if (!this.hasParam(name)) {
      throw new Error(`Cannot resolve schema for parameter: ${name}`);
    }

    return this._params[name];
  }

  /**
   *
   * @returns {Object}
   */
  getFiles() {
    return this._files;
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasFile(name) {
    return typeof this._files[name] !== typeof undefined;
  }

  /**
   *
   * @param {string} name
   * @returns {*}
   */
  getFileSchema(name) {
    if (!this.hasFile(name)) {
      throw new Error(`Cannot resolve schema for file parameter: ${name}`);
    }

    return this._files[name];
  }

  /**
   *
   * @returns {HttpActionSchema}
   */
  getHttpSchema() {
    return this._httpSchema;
  }

  /**
   *
   * @returns {Number}
   */
  getTimeout() {
    return this._timeout;
  }
}

module.exports = ActionSchema;
