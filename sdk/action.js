'use strict';

/* eslint max-params: ["error", 11] */

const _ = require('lodash');
const Api = require('./api');
const Param = require('./param');
const File = require('./file');
const logger = require('./logger');

const m = require('./mappings');

/**
 * Action class
 *
 * @extends Api
 */
class Action extends Api {
  /**
   * Create an Action instance
   *
   * @param {Component} component Parent component
   * @param {string} path Source file path
   * @param {string} name The name of the parent component
   * @param {string} version Component version
   * @param {string} frameworkVersion Framework version
   * @param {Object} variables Variables object
   * @param {boolean} debug Debug mode
   * @param {string} actionName The name of this action
   * @param {Object} params Params received from an action call
   * @param {Transport} transport Transport instance
   * @param {ZMQRuntimeCaller} runtimeCaller
   */
  constructor(
    component, path, name, version, frameworkVersion, variables, debug,
    actionName,
    params, transport,
    runtimeCaller
  ) {
    super(component, path, name, version, frameworkVersion, variables, debug);

    this._transport  = transport;
    this._actionName = actionName;
    this._params     = params || {}; // Overrides parent
    this._runtimeCaller = runtimeCaller;
  }

  /**
   *
   * @return {Transport}
   */
  getTransport() {
    return this._transport;
  }

  /**
   * Returns whether or not the current Service is the initial Service called in a request
   *
   * @return {boolean}
   */
  isOrigin() {
    const [name, version] = this._transport.getOriginService();
    return this.getName() === name && this.getVersion() === version;
  }

  /**
   * Returns the action name
   *
   * @return {string}
   */
  getActionName() {
    return this._actionName;
  }

  /**
   * Register a custom property
   *
   * @param {string} name Name of the property
   * @param {string} value Value of the property
   * @return {Action}
   */
  setProperty(name, value) {
    if (_.isNil(name)) {
      throw new Error('Specify a property `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The property `name` must be a string');
    }

    if (_.isNil(value)) {
      throw new Error('Specify a property `value`');
    } else if (!_.isString(value)) {
      throw new TypeError('The property `value` must be a string');
    }

    this._transport._setProperty(name, value);

    return this;
  }

  // hasParam declared in base class Api
  // getParam declared in base class Api
  // getParams declared in base class Api

  /**
   * Create a new parameter
   *
   * @param {string} name Name of the param
   * @param {string} [value] Value of the param
   * @param {string} [type] type of the param
   * @return {Param}
   */
  newParam(name, value, type) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return new Param(name, value, type);
  }

  /**
   * Determine if a file was provided for the action
   *
   * @param {string} name Name of the file
   * @return {boolean}
   */
  hasFile(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    const [service, version, action] = [this.getName(), this.getVersion(), this.getActionName()];
    return this._transport.hasFile(service, version, action, name);
  }

  /**
   * Get a file
   *
   * @param {string} name Name of the file
   * @return {File}
   */
  getFile(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    const [service, version, action] = [this.getName(), this.getVersion(), this.getActionName()];
    if (this.hasFile(name)) {
      const file = this._transport.getFile(service, version, action, name);

      return new File(
        name,
        file[m.path],
        file[m.mime],
        file[m.filename],
        file[m.size],
        file[m.token]
      );
    }

    return new File(name, '');
  }

  /**
   *
   * @return {Array}
   */
  getFiles() {
    return this._transport.getFiles().map((d) => this.getFile(d[m.name]));
  }

  /**
   * Create a new file
   *
   * @param {string} name Name of the file
   * @param {string} path Path of the file
   * @param {string} [mime] Mime type of the file
   * @return {File}
   */
  newFile(name, path, mime) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The file `name` must be a string');
    }

    if (_.isNil(path)) {
      throw new Error('Specify a file `path`');
    } else if (!_.isString(path)) {
      throw new TypeError('The file `path` must be a string');
    }

    if (!_.isNil(mime) && !_.isString(mime)) {
      throw new TypeError('The file `mime` type must be a string');
    }

    return new File(name, path, mime);
  }

  /**
   * Register a file to be downloaded
   *
   * @param {string} file The file to be registered
   * @return {Action}
   */
  setDownload(file) {
    this._transport._setBody(file);

    return this;
  }

  /**
   *
   * @returns {Action}
   * @see https://github.com/kusanagi/katana-sdk-spec#actionset_returnmixed-value--action
   */
  setReturn(value) {
    let serviceSchema;

    try {
      serviceSchema = this.getServiceSchema(this.name, this.version);
    } catch (e) {
      this._return = value;

      return this;
    }
    const actionSchema = serviceSchema.getActionSchema(this._actionName);

    if (!actionSchema.hasReturn()) {
      throw new Error(
        `Cannot set a return value in "${this._name}" (${this._version}) \
for action: "${this._actionName}"`
      );
    }

    if (typeof value !== actionSchema.getReturnType()) {
      // TODO: Include expected type?
      throw new Error(
        `Invalid return type given in "${this._name}" (${this._version}) \
for action: "${this._actionName}"`
      );
    }

    this._return = value;

    return this;
  }

  /**
   * @return {array|number|boolean|string}
   */
  getReturnType() {
    if (this.return) {
      return this.return;
    }

    return this.getServiceSchema(this._name, this._version)
      .getActionSchema(this._actionName)
      .getReturnType();
  }

  /**
   * Register an entity object in the Transport
   *
   * @param {Object} entity The entity object
   * @return {Action}
   */
  setEntity(entity) {
    if (_.isNil(entity)) {
      throw new Error('Specify an `entity`');
    } else if (!_.isPlainObject(entity)) {
      throw new TypeError('The `entity` must be an object');
    }

    const [service, version, action] = [this.getName(), this.getVersion(), this.getActionName()];
    this._transport._setData(service, version, action, entity);

    return this;
  }

  /**
   * Register an array of entity objects
   *
   * @param {array} collection Array of entity objects
   * @return {Action}
   */
  setCollection(collection) {
    if (_.isNil(collection)) {
      throw new Error('Specify a `collection` of entities');
    } else if (!_.isArray(collection)) {
      throw new TypeError('The `collection` of entities must be an array');
    }

    const [service, version, action] = [this.getName(), this.getVersion(), this.getActionName()];
    this._transport._setData(service, version, action, collection);

    return this;
  }

  /**
   * Register a one-to-one relation between the entity and the foreign Service
   *
   * @param {string} primaryKey
   * @param {string} service
   * @param {string} foreignKey
   * @return {Action}
   */
  relateOne(primaryKey, service, foreignKey) {
    if (_.isNil(primaryKey)) {
      throw new Error('Specify a `primaryKey`');
    } else if (!_.isString(primaryKey)) {
      throw new TypeError('The `primaryKey` must be a string');
    }

    if (_.isNil(service)) {
      throw new Error('Specify a `service`');
    } else if (!_.isString(service)) {
      throw new TypeError('The `service` must be a string');
    }

    if (_.isNil(foreignKey)) {
      throw new Error('Specify a `foreignKey`');
    } else if (!_.isString(foreignKey)) {
      throw new TypeError('The `foreignKey` must be a string');
    }

    this._transport.relateOne(this.getName(), primaryKey, service, foreignKey);

    return this;
  }

  /**
   * Register a one-to-many relation between the entity and the foreign Service
   *
   * @param {string} primaryKey
   * @param {string} service
   * @param {array} foreignKeys
   * @return {Action}
   */
  relateMany(primaryKey, service, foreignKeys) {
    if (_.isNil(primaryKey)) {
      throw new Error('Specify a `primaryKey`');
    } else if (!_.isString(primaryKey)) {
      throw new TypeError('The `primaryKey` must be a string');
    }

    if (_.isNil(service)) {
      throw new Error('Specify a `service`');
    } else if (!_.isString(service)) {
      throw new TypeError('The `service` must be a string');
    }

    if (_.isNil(foreignKeys)) {
      throw new Error('Specify a `foreignKeys`');
    } else if (!_.isArray(foreignKeys)) {
      throw new TypeError('The `foreignKeys` must be an array');
    }

    this._transport.relateMany(this.getName(), primaryKey, service, foreignKeys);

    return this;
  }

  /**
   *
   * @param primaryKey
   * @param address
   * @param service
   * @param foreignKey
   * @return {Action}
   */
  relateOneRemote(primaryKey, address, service, foreignKey) {
    this._transport.relateOneRemote(this.getName(), primaryKey, address, service, foreignKey);

    return this;
  }

  /**
   *
   * @param primaryKey
   * @param address
   * @param service
   * @param foreignKeys
   * @return {Action}
   */
  relateManyRemote(primaryKey, address, service, foreignKeys) {
    this._transport.relateManyRemote(this.getName(), primaryKey, address, service, foreignKeys);

    return this;
  }

  /**
   * Register a link
   *
   * @param {string} link Link name
   * @param {string} uri Link URI
   * @return {boolean}
   */
  setLink(link, uri) {
    if (_.isNil(link)) {
      throw new Error('Specify a `link`');
    } else if (!_.isString(link)) {
      throw new TypeError('The `link` must be a string');
    }

    if (_.isNil(uri)) {
      throw new Error('Specify a `uri`');
    } else if (!_.isString(uri)) {
      throw new TypeError('The `uri` must be a string');
    }

    this._transport._setLink(this.getName(), link, uri);
    return this;
  }

  _buildTransaction(action, params) {
    if (_.isNil(action)) {
      throw new Error('Specify an `action` name');
    } else if (!_.isString(action)) {
      throw new TypeError('The `action` name must be a string');
    }

    if (!_.isNil(params) && !_.isArray(params) && !_isParamArray(params)) {
      throw new Error('Argument `params` must be an array of Param');
    }

    const transaction = {action};

    if (params.length) {
      transaction.params = params;
    }

    return transaction;
  }

  /**
   * Register a commit transaction
   *
   * @param {string} action Name of the action
   * @param {array} params Array of params
   * @return {Action}
   */
  commit(action, params) {
    const [name, version] = [this.getName(), this.getVersion()];
    const transaction = this._buildTransaction(action, params);
    this._transport.registerTransaction('commit', name, version, transaction);

    return this;
  }

  /**
   * Register a rollback transaction
   *
   * @param {string} action Name of the action
   * @param {array} params Array of params
   * @return {Action}
   */
  rollback(action, params) {
    const [name, version] = [this.getName(), this.getVersion()];
    const transaction = this._buildTransaction(action, params);
    this._transport.registerTransaction('rollback', name, version, transaction);

    return this;
  }
  /**
   * Register a complete transaction
   *
   * @param {string} action Name of the action
   * @param {array} params Array of params
   * @return {Action}
   */
  complete(action, params) {
    const [name, version] = [this.getName(), this.getVersion()];
    const transaction = this._buildTransaction(action, params);
    this._transport.registerTransaction('complete', name, version, transaction);

    return this;
  }

  /**
   * Register a Service call
   *
   * @param {string} service Name of the Service
   * @param {string} version Version of the Service
   * @param {string} action Name of the action to call
   * @param {array} [params] Array of params
   * @param {array} [files] Array of files
   * @param {number} timeout Operation timeout
   * @return {Action}
   */
  call(service, version, action, params, files, timeout) {
    if (_.isNil(service)) {
      throw new Error('Specify a `service` name');
    }

    if (!_.isString(service)) {
      throw new TypeError('The `service` name must be a string');
    }

    if (_.isNil(version)) {
      throw new Error('Specify a service `version`');
    }

    if (!_.isString(version)) {
      throw new TypeError('The service `version` must be a string');
    }

    if (_.isNil(action)) {
      throw new Error('Specify an `action` name');
    } else if (!_.isString(action)) {
      throw new TypeError('The `action` name must be a string');
    }

    if (!_.isNil(params) && !_.isArray(params) && !_isParamArray(params)) {
      throw new TypeError('Argument `params` must be an array of Param');
    }

    if (!_.isNil(files) && !_.isArray(files) && !_isFileArray(files)) {
      throw new TypeError('Argument `files` must be an array of File');
    } else {
      files.forEach((file) => this._transport.addFile(service, version, action, file));
    }


    const address = this.getServiceSchema(this._name, this._version).getAddress();

    this._runtimeCaller.call(
      this,
      service,
      version,
      action,
      address,
      params,
      files,
      timeout
    );
    
    return this;
  }

  /**
   * Register a Service call
   *
   * @param {string} service Name of the Service
   * @param {string} version Version of the Service
   * @param {string} action Name of the action to call
   * @param {array} [params] Array of params
   * @param {array} [files] Array of files
   * @return {Action}
   */
  deferCall(service, version, action, params, files) {
    const serviceSchema = this.getServiceSchema(this.getName(), this.getVersion());
    const actionSchema = serviceSchema.getActionSchema(this.getActionName());

    if (!actionSchema.hasDeferCall(service, version, action)) {
      throw new Error(
        `Deferred call not configured, connection to action on "${service}" (${version}) 
        aborted: "${action}"`
      );
    }

    this.transport.addDeferredCall(
      'deferred',
      this.getName(),
      this.getVersion(),
      this.getActionName(),
      service,
      version,
      action,
      0,
      params
    );

    for (let file of files) {
      if (file.isLocal() && !serviceSchema.hasFileServer()) {
        throw new Error(
          `File server not configured: "${this.getName()}" (${this.getVersion()})`
        );
      }

      this.transport.addFile(service, version, action, file);
    }

    return this;
  }

  /**
   * Register a Service call
   *
   * @param {string} address Name of the Service
   * @param {string} service Name of the Service
   * @param {string} version Version of the Service
   * @param {string} action Name of the action to call
   * @param {Array} [params] Array of params
   * @param {Array} [files] Array of files
   * @param {Number} [timeout=1000] Call timeout
   * @return {Action}
   */
  remoteCall(address, service, version, action, params, files, timeout = 1000) {
    const serviceSchema = this.getServiceSchema(this.getName(), this.getVersion());
    const actionSchema = serviceSchema.getActionSchema(this.getActionName());

    if (!actionSchema.hasRemoteCall(address, service, version, action)) {
      throw new Error(
        `Remote call not configured, connection to action on [${address}] "${service}" (${version}) 
        aborted: "${action}"`
      );
    }

    this.transport.addRemoteCall(
      this.getName(),
      this.getVersion(),
      this.getActionName(),
      address,
      service,
      version,
      action,
      params,
      0,
      timeout
    );

    for (let file of files) {
      if (file.isLocal() && !serviceSchema.hasFileServer()) {
        throw new Error(`File server not configured: "${this.getName()}" (${this.getVersion()})`);
      }

      this.transport.addFile(service, version, action, file);
    }

    return this;
  }

  /**
   * Set the action result as an error
   *
   * @param {string} message Natural language description of the error
   * @param {string} [code=0] Code to be defined for the error
   * @param {string} [status] Status code to be defined for the error
   * @return {boolean}
   */
  error(message, code = 0, status) {
    const error = {
      [m.message]: message,
      [m.code]: code,
      [m.status]: status
    };
    this._transport.addError(this.getName(), this.getVersion(), error);
    
    return true;
  }

  _processRuntimeResponse(payload) {
    logger.debug('Runtime response', payload);

    if (payload[m.command_reply][m.result][m.error]) {
      const message = [m.command_reply][m.result][m.error][m.message];
      throw new Error(`Runtime call received an error response: ${message}`);
    }

    this._transport.mergeIn(payload[m.command_reply][m.response][m.transport]);

    const {metadata, 'payload': reply} = this._component._commandReply.getMessage(this);

    this._component._replyWith(metadata, reply);
  }


  /**
   * Determine if a parameter was provided for the action
   *
   * @param {string} name Name of the param
   * @return {boolean}
   */
  hasParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    return _.has(this._params, [name]);
  }

  /**
   * Get a parameter
   *
   * @param {string} name Name of the param
   * @return {Param}
   */
  getParam(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a param `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The param `name` must be a string');
    }

    const param = this._params[name];
    if (param instanceof Param) {
      return param;
    }
    return new Param(name, param[m.value], param[m.type], this.hasParam(name));
  }

  /**
   *
   * @returns {[]}
   */
  getParams() {
    return Object.keys(this._params).map(
      (name) => this._params[name] instanceof Param ? this._params[name] : new Param(
        name,
        this._params[name][m.value],
        this._params[name][m.type],
        this.hasParam(name)
      )
    );
  }

}

function _isParamArray(params) {
  return params.filter((param) => param instanceof Param).length === params.length;
}

function _isFileArray(files) {
  return files.filter((file) => file instanceof File).length === files.length;
}

module.exports = Action;
