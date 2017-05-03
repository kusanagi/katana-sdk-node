'use strict';

const zmq           = require('zmq');
const msgpack       = require('msgpack');
const Mapper        = require('./mapper');
const CommandReply  = require('./command-reply');
const cli           = require('./cli');
const logger        = require('./logger');
const Action        = require('./action');
const Request       = require('./request');
const Response      = require('./response');
const m             = require('./mappings');
const _             = require('lodash');
const ServiceSchema = require('./service-schema');
const ZMQRuntimeCaller = require('./zmq-runtime-caller');

// https://github.com/kusanagi/katana-sdk-spec#componentlogmixed-value--boolean
const MAX_LOG_LENGTH = 100000;

/**
 * Component class
 */
class Component {
  /**
   * Create a Component instance
   */
  constructor(processHandle) {
    this.process = processHandle || process;

    this.resources       = {};
    this.callbacks       = {};
    this.servicesMapping = [];

    this._mapper       = new Mapper({compact: true});
    this._commandReply = new CommandReply(this._mapper);
    this.logger        = logger;

    this.process.on('uncaughtException', this._handleUncaughtException.bind(this));
    this.process.on('SIGINT', this._cleanExit.bind(this));
    this.process.on('SIGTERM', this._cleanExit.bind(this));
  }

  /**
   *
   * @param {Error} error
   */
  _handleUncaughtException(error) {
    logger.error('Uncaught exception', error.toString(), error.stack);
    this._replyWithError(`Uncaught error. ${error.toString()}`, 500, 'Internal Server Error');
  }

  /**
   *
   * @param {string} message
   * @param {number} code
   * @param {string} status
   */
  _replyWithError(message, code, status) {
    const errorPayload = {
      [m.error]: {
        [m.message]: message,
        [m.code]: code,
        [m.status]: status
      }
    };

    this._replyWith('\x00', errorPayload);
  }

  _readCLIOptions() {
    this.cli           = cli.parse();
    this.logger.setLevel(this.cli.debug ? logger.levels.DEBUG : logger.levels.INFO);
  }

  _runStartup() {
    if (!this._startup) {
      return this.logger.debug('No custom startup callable has been set');
    }

    try {
      this._startup(this);
    } catch (e) {
      this.logger.warning('Uncaught error in custom startup callable', e);
    }
  }

  _runShutdown() {
    if (!this._shutdown) {
      return this.logger.debug('No custom shutdown callable has been set');
    }

    try {
      this._shutdown(this);
    } catch (e) {
      this.logger.warning('Uncaught error in custom shutdown callable', e);
    }
  }

  _runError(error) {
    if (!this._error) {
      return this.logger.debug('No custom error callable has been set');
    }

    try {
      this._error(error);
    } catch (e) {
      this.logger.warning('Uncaught error in custom error callable', e);
    }
  }

  _cleanExit() {
    this._runShutdown();
    this._closeSocket();
    this.process.exit(0);
  }

  _closeSocket() {
    try {
      this.socket && this.socket.close();
    } catch (e) {
      logger.warning('Could not close socket', e.message);
    }
  }

  _replyWith(metadata, payload) {
    // To check out the output payload, it's better to use katana service/middleware start --transport
    // You might need to inspect this if the payload is malformed, though
    // logger.debug('Sending command reply', metadata, JSON.stringify(payload));
    this.socket.send([metadata, msgpack.pack(payload)]);
  }

  _processMessage(rawActionName, encodedMapping, encodedPayload) {
    const actionName = rawActionName.toString();
    const payload    = msgpack.unpack(encodedPayload);
    const newMapping = encodedMapping ? msgpack.unpack(encodedMapping) : null;

    if (newMapping) {
      logger.info('Received new mapping', JSON.stringify(newMapping));
      this._saveNewMapping(newMapping);
    }

    this._processCommand(actionName, payload);
  }

  // /**
  //  *
  //  * @param {string} actionName
  //  * @param {Object} payload
  //  * @private
  //  */
  // _processCommand(actionName, payload) {
  //   logger.error('Unhandled call', actionName, JSON.stringify(payload));
  //   throw new Error('Must be implemented in child class');
  // }

  _saveNewMapping(newMapping) {
    let list = [];
    Object.keys(newMapping).forEach((serviceName) => {
      Object.keys(newMapping[serviceName]).forEach((version) => {
        list.push(
          {
            name: serviceName,
            version: version,
            schema: ServiceSchema
              .fromMapping(serviceName, version, newMapping[serviceName][version]),
          }
        );
      });
    });

    this.servicesMapping = list;
  }

  _getAction(actionName, payload) {
    if (!payload) {
      throw new Error('Cannot create action without data');
    }

    if (!actionName) {
      throw new Error('Cannot create action without name');
    }

    const caller = new ZMQRuntimeCaller();

    return new Action(
      this,
      this.process.argv[1],
      this.cli.name,
      this.cli.version,
      this.cli.frameworkVersion,
      this.cli.variables,
      this.cli.debug,
      actionName,
      this._getParamsAsMap(payload[m.command][m.action][m.params]),
      this._mapper.getTransport(payload[m.command][m.arguments][m.transport]),
      caller
    );
  }

  _getRequest(payload) {
    if (!payload) {
      throw new Error('Cannot create Request without data');
    }

    return new Request(
      this,
      this.process.argv[1],
      this.cli.name,
      this.cli.version,
      this.cli.frameworkVersion,
      this.cli.variables,
      this.cli.debug,
      this._mapper.getHttpRequest(payload[m.command][m.arguments][m.request]),
      this._mapper.getServiceCall(payload[m.command][m.arguments][m.call]),
      payload[m.command][m.arguments][m.meta][m.protocol],
      payload[m.command][m.arguments][m.meta][m.gateway],
      payload[m.command][m.arguments][m.meta][m.client]
    );
  }

  _getResponse(payload) {
    if (!payload) {
      throw new Error('Cannot create Response without data');
    }

    return new Response(
      this,
      this.process.argv[1],
      this.cli.name,
      this.cli.version,
      this.cli.frameworkVersion,
      this.cli.variables,
      this.cli.debug,
      this._mapper.getHttpRequest(payload[m.response]),
      this._mapper.getHttpResponse(payload[m.response]),
      this._mapper.getTransport(payload[m.transport]),
      payload[m.meta][m.protocol],
      payload[m.meta][m.gateway]
    );
  }

  _getParamsAsMap(source = []) {
    let params = {};

    // Add every param name as a key
    source.forEach((p) => {
      params[p[m.name]] = p;
    });

    return params;
  }

  // https://github.com/kusanagi/katana-sdk-spec#34-string-representation
  _getAsString(value) {
    if (value === null) {
      return 'NULL';
    }

    if (_.isString(value)) {
      return value;
    }

    if (_.isArray(value) || _.isObject(value)) {
      return JSON.stringify(value);
    }

    if (_.isNumber(value)) {
      return value.toFixed(9);
    }

    if (_.isFunction(value)) {
      return value.toString().substring('function '.length, value.toString().indexOf('('));
    }

    return 'Unknown value type';
  }

  _setCallback(name, callable) {
    this.callbacks[name] = callable;
  }

  _assertValidCallableType(callable) {
    if (typeof callable !== 'function') {
      throw new Error('Argument `callable` must be of type \'function\'');
    }
  }

  _assertCallableProvided(callable) {
    if (callable === undefined) {
      throw new Error('Argument `callable` is required');
    }
  }

  _initZMQCommunication() {
    this.socket = zmq.socket('rep');

    let addr = `ipc://${this.cli.socket}`;

    this.socket.on('message', this._processMessage.bind(this));

    [
      'connect',
      'connect_delay',
      'connect_retry',
      'listen',
      'bind_error',
      'accept',
      'accept_error',
      'close',
      'close_error',
      'disconnect',
      'monitor_error',
    ].forEach((e) => {
      this.socket.on(e, (...args) => logger.debug(`ZMQ socket event '${e}'`, [...args]));
    });

    this.socket.bindSync(addr);
    logger.debug(`Socket bound: ${addr}`);

    this.socket.monitor(1000, 0);
    logger.debug(`Monitoring socket: ${addr}`);
  }

  /**
   *
   * @param {string} name
   * @param {function} callable
   * @returns {boolean}
   */
  setResource(name, callable) {
    if (callable === undefined) {
      throw new Error('Argument `callable` is required');
    }

    if (typeof callable !== 'function') {
      throw new Error('Argument `callable` must be of type \'function\'');
    }

    const result = callable();
    if (result === undefined) {
      throw new Error('Argument `callable` must be a function returning a value.');
    }

    this.resources[name] = result;

    return true;
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasResource(name) {
    return typeof this.resources[name] !== typeof undefined;
  }

  /**
   *
   * @param {string} name
   * @returns {*}
   */
  getResource(name) {
    if (this.resources[name] === undefined) {
      throw new Error(`Unknown resource '${name}'`);
    }

    return this.resources[name];
  }

  /**
   *
   * @param {function} callable
   * @returns {Component}
   */
  startup(callable) {
    this._assertCallableProvided(callable);
    this._assertValidCallableType(callable);
    this._startup = callable;

    return this;
  }

  /**
   *
   * @param {function} callable
   * @returns {Component}
   */
  shutdown(callable) {
    this._assertCallableProvided(callable);
    this._assertValidCallableType(callable);
    this._shutdown = callable;

    return this;
  }

  /**
   *
   * @param {function} callable
   * @returns {Component}
   */
  error(callable) {
    this._assertCallableProvided(callable);
    this._assertValidCallableType(callable);
    this._error = callable;

    return this;
  }

  /**
   * @returns {boolean}
   */
  run() {
    this._readCLIOptions();

    this._runStartup();

    this._initZMQCommunication();

    return true;
  }

  /**
   *
   * @param {*} value
   * @returns {boolean}
   */
  log(value) {
    if (!this.cli.debug) {
      return false;
    }

    let message = this._getAsString(value).substring(0, MAX_LOG_LENGTH);

    logger.debug(message);

    return true;
  }

}

module.exports = Component;
