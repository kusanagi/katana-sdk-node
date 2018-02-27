'use strict';

const Immutable = require('immutable');
const _ = require('lodash');
const File = require('./file');
const Link = require('./link');

const m = require('./mappings');

const defaultData = {
  [m.meta]: {
    [m.version]: '',
    [m.duration]: '',
    [m.start_time]: '',
    [m.end_time]: '',
    [m.id]: '',
    [m.datetime]: '',
    [m.origin]: [],
    [m.gateway]: ['', ''],
    [m.level]: 0
  }
};

const _data = Symbol('data');

/**
 * Transport class
 */
class Transport {
  /**
   *
   * @param {Object} data
   */
  constructor(data = defaultData) {
    this[_data] = Immutable.fromJS(data);

    if (!this[_data].has(m.meta)) {
      throw new Error('Cannot build transport without meta');
    }
  }

  /**
   *
   * @return {Object}
   * @protected
   */
  _getAsObject() {
    return this[_data].toJS();
  }
  /**
   *
   * @return {Object}
   * @protected
   */
  _getAsReadOnlyCopy() {
    return Object.freeze(new Transport(this._getAsObject()));
  }

  /**
   *
   * @return {Object}
   * @protected
   */
  _getMeta() {
    return this[_data].get(m.meta).toJS();
  }

  /**
   *
   * @return {string}
   */
  getRequestId() {
    return this[_data].getIn([m.meta, m.id]);
  }

  /**
   *
   * @return {string}
   */
  getRequestTimestamp() {
    return this[_data].getIn([m.meta, m.datetime]);
  }

  /**
   *
   * @return {string[]}
   */
  getOriginService() {
    return this[_data].hasIn([m.meta, m.origin]) ?
      this[_data].getIn([m.meta, m.origin]).toJS() : [];
  }

  /**
   *
   * @return {number}
   */
  getOriginDuration() {
    return  this[_data].getIn([m.meta, m.duration]).toJS();
  }

  /**
   *
   * @param {string} name
   * @param {string} defaultValue
   * @return {string}
   */
  getProperty(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a property `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The property `name` must be a string');
    }

    return this[_data].getIn(['meta', 'properties', name]) || defaultValue;
  }

  /**
   *
   * @return {Object}
   */
  getProperties() {
    return this[_data].getIn(['meta', 'properties']).toJS() || {};
  }

  /**
   * @return true
   */
  hasDownload() {
    return this[_data].has(m.body);
  }

  /**
   *
   * @return {File}
   */
  getDownload() {
    if (!this.hasDownload()) {
      return null;
    }

    const {path, mime, filename, size, token} = this[_data].get(m.body).toJS();

    return new File(m.body, path, mime, filename, size, token);
  }

  /**
   * @return {boolean}
   */
  hasFiles() {
    return this[_data].has(m.files);
  }

  /**
   *
   * @return {*}
   */
  getFiles() {
    return this.hasFiles() ? this[_data].get(m.files).toJS() : null;
  }

  /**
   *
   */
  hasData() {
    return this[_data].has(m.data);
  }

  /**
   *
   * @param {string} service
   * @param {string} version
   * @param {string} action
   * @return {Object}
   */
  getData(service, version, action) {
    let d = this[_data].get(m.data);

    if (!d) {
      return [];
    }

    if (service) {
      const gatewayPublicAddress = this._getGatewayPublicAddress();
      d = d.getIn([gatewayPublicAddress, service]) || Immutable.Map({});

      if (version) {
        d = d.get(version) || Immutable.Map({});

        if (action) {
          d = d.get(action) || Immutable.Map({});
        }
      }
    }

    return d.toJS();
  }

  /**
   *
   */
  hasRelations() {
    return this[_data].has('relations');
  }

  /**
   *
   * @param {string} service
   * @return {Object}
   */
  getRelations(service) {
    let relations = this[_data].get('relations') || Immutable.Map({});

    if (service) {
      relations = relations.get(service) || Immutable.Map({});
    }

    return relations.toJS();
  }

  /**
   * @return {boolean}
   */
  hasLinks() {
    return this[_data].has('links');
  }

  /**
   *
   * @return {Link[]}
   */
  getLinks() {
    let links = this[_data].get('links') || Immutable.Map({});
    let linkObjects = [];

    links.keySeq().forEach(
        (address) => links.get(address).keySeq().forEach(
            (name) => links.getIn([address, name]).keySeq().forEach(
                (link) => linkObjects.push(new Link(
                    address,
                    name,
                    link,
                    links.getIn([address, name, link])
                ))
            )
        )
    );

    return linkObjects;
  }

  /**
   * @return {boolean}
   */
  hasCalls() {
    return this[_data].has('calls');
  }

  /**
   *
   * @param {string} service
   * @return {Object}
   */
  getCalls(service) {
    let calls = this[_data].get('calls') || Immutable.Map({});

    if (service) {
      calls = calls.get(service) || Immutable.Map({});
    }

    return calls.toJS();
  }

  /**
   * @return {boolean}
   */
  hasTransactions() {
    return this[_data].has('transactions');
  }

  /**
   *
   * @param {string} service
   * @return {Object}
   */
  getTransactions(service) {
    let transactions = this[_data].get('transactions') || Immutable.Map({});

    if (service) {
      transactions = transactions.get(service) || Immutable.Map({});
    }

    return transactions.toJS();
  }

  /**
   *
   * @param {string} service
   * @return {Object}
   */
  getErrors(service) {
    let errors = this[_data].get('errors') || Immutable.Map({});

    if (service) {
      errors = errors.get(service) || Immutable.Map({});
    }

    return errors.toJS();
  }

  /**
   *
   * @param name
   * @param value
   * @private
   */
  _setProperty(name, value) {
    this[_data] = this[_data].setIn(['meta', 'properties', name], value);
  }

  /**
   *
   * @param service
   * @param version
   * @param action
   * @param name
   * @return {boolean}
   */
  hasFile(service, version, action, name) {
    return this[_data]
      .hasIn([m.files, this._getGatewayPublicAddress(), service, version, action, name]);
  }

  /**
   *
   * @param service
   * @param version
   * @param action
   * @param name
   * @return {File}
   */
  getFile(service, version, action, name) {
    let getGatewayPublicAddress = this._getGatewayPublicAddress();

    return this[_data]
      .getIn([m.files, getGatewayPublicAddress, service, version, action, name])
      .toJS();
  }

  /**
   *
   */
  hasBody() {
    return this[_data].has(m.body);
  }

  /**
   *
   */
  getBody() {
    return this[_data].get(m.body);
  }

  /**
   *
   * @param file
   * @private
   */
  _setBody(file) {
    this[_data] = this[_data].setIn([m.body], file);
  }

  /**
   *
   * @param service
   * @param version
   * @param action
   * @param source
   * @private
   */
  _setData(service, version, action, source) {

    const gatewayPublicAddress = this._getGatewayPublicAddress();
    const path = [m.data, gatewayPublicAddress, service, version, action];

    if (!this[_data].hasIn(path)) {
      this[_data] = this[_data].setIn(path, Immutable.fromJS([]));
    }

    this[_data] = this[_data].updateIn(path, function(list) {
      return list.push(Immutable.fromJS(source));
    });
  }

  /**
   *
   * @return {Object}
   * @private
   */
  _getGatewayPublicAddress() {
    return this._getMeta()[m.gateway][1];
  }

  /**
   *
   * @param name
   * @param primaryKey
   * @param service
   * @param foreignKey
   */
  relateOne(name, primaryKey, service, foreignKey) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, service],
      foreignKey
    );
  }

  /**
   *
   * @param name
   * @param primaryKey
   * @param service
   * @param foreignKeys
   */
  relateMany(name, primaryKey, service, foreignKeys) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, service],
      Immutable.fromJS(foreignKeys)
    );
  }

  /**
   *
   * @param name
   * @param primaryKey
   * @param address
   * @param service
   * @param foreignKey
   */
  relateOneRemote(name, primaryKey, address, service, foreignKey) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, address, service],
      foreignKey
    );
  }

  /**
   *
   * @param name
   * @param primaryKey
   * @param address
   * @param service
   * @param foreignKeys
   */
  relateManyRemote(name, primaryKey, address, service, foreignKeys) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, address, service],
      Immutable.fromJS(foreignKeys)
    );
  }

  /**
   *
   * @param name
   * @param link
   * @param uri
   * @private
   */
  _setLink(name, link, uri) {
    this[_data] = this[_data].setIn(['links', name, link], uri);
  }

  /**
   *
   * @param type
   * @param name
   * @param version
   * @param transaction
   */
  registerTransaction(type, name, version, transaction) {
    let data;
    if (this[_data].hasIn(['transactions', type, name, version])) {
      data = this[_data].updateIn(['transactions', type, name, version], (list) =>
        list.push(Immutable.fromJS(transaction)));
    } else {
      data = this[_data].setIn(['transactions', type, name, version],
        Immutable.fromJS([transaction]));
    }
    this[_data] = data;

    // this[_data] = this[_data].mergeIn(['transactions', type, name, version], Immutable.fromJS([transaction]));
  }

  /**
   *
   * @param service
   * @param version
   * @param action
   * @param file
   */
  addFile(service, version, action, file) {
    this[_data] = this[_data].setIn([m.files, service, version, action], Immutable.fromJS(file));
  }

  /**
   *
   * @param {string} serviceName
   * @param {string} serviceVersion
   * @param {string} actionName
   * @param {string} address
   * @param {string} targetService
   * @param {string} targetVersion
   * @param {string} targetAction
   * @param {Array} [params=[]] params
   * @param {Number} duration
   * @param {Number} [timeout=1000]
   */
  addRemoteCall(
    serviceName, serviceVersion, actionName,
    address, targetService, targetVersion, targetAction, params = [], duration, timeout = 1000
  ) {

    const callData = {
      [m.name]: targetService,
      [m.version]: targetVersion,
      [m.action]: targetAction,
      [m.action]: targetAction,
      [m.params]: params,
      [m.gateway]: address,
      [m.duration]: duration,
      [m.timeout]: timeout,
    };

    this[_data] = this[_data].setIn(
      ['calls', serviceName, serviceVersion, actionName],
      Immutable.fromJS(callData)
    );
  }
  /**
   *
   * @param {string} serviceName
   * @param {string} serviceVersion
   * @param {string} actionName
   * @param {string} targetService
   * @param {string} targetVersion
   * @param {string} targetAction
   * @param {number} duration
   * @param {Array} [params=[]] params
   */
  addDeferredCall(
    serviceName, serviceVersion, actionName,
    targetService, targetVersion, targetAction, duration, params = []
  ) {

    const callData = {
      [m.name]: targetService,
      [m.version]: targetVersion,
      [m.action]: targetAction,
      [m.action]: targetAction,
      [m.duration]: duration,
      [m.params]: params,
    };

    this[_data] = this[_data].setIn(
      ['calls', serviceName, serviceVersion, actionName],
      Immutable.fromJS(callData)
    );
  }

  addError(name, version, error) {
    let data;
    const gatewayUrl = this._getGatewayPublicAddress();

    if (this[_data].hasIn(['errors', gatewayUrl, name, version])) {
      data = this[_data].updateIn(['errors', gatewayUrl, name, version], (list) =>
        list.push(Immutable.fromJS(error)));
    } else {
      data = this[_data].setIn(['errors', gatewayUrl, name, version], Immutable.fromJS([error]));
    }
    this[_data] = data;
  }

  /**
   *
   * @param {Object} incoming
   * @see https://github.com/kusanagi/katana-sdk-spec#73-action
   */
  mergeIn(incoming) {
    const mergeResult = _.merge(this[_data].toJS(), incoming);
    this[_data] = Immutable.fromJS(mergeResult);
  }
}

module.exports = Transport;
