'use strict';

const Immutable = require('immutable');
const _ = require('lodash');
const File = require('./file');

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
  constructor(data = defaultData) {
    this[_data] = Immutable.fromJS(data);

    if (!this[_data].has(m.meta)) {
      throw new Error('Cannot build transport without meta');
    }
  }

  getAsObject() {
    return this[_data].toJS();
  }

  getMeta() {
    return this[_data].get(m.meta).toJS();
  }

  getRequestId() {
    return this[_data].getIn([m.meta, m.id]);
  }

  getRequestTimestamp() {
    return this[_data].getIn([m.meta, m.datetime]);
  }

  getOriginService() {
    return this[_data].hasIn([m.meta, m.origin]) ?
      this[_data].getIn([m.meta, m.origin]).toJS() : [];
  }

  getOriginDuration() {
    return  this[_data].getIn([m.meta, m.duration]).toJS();
  }

  getProperty(name, defaultValue = '') {
    if (_.isNil(name)) {
      throw new Error('Specify a property `name`');
    } else if (!_.isString(name)) {
      throw new TypeError('The property `name` must be a string');
    }

    return this[_data].getIn(['meta', 'properties', name]) || defaultValue;
  }

  getProperties() {
    return this[_data].getIn(['meta', 'properties']).toJS() || {};
  }

  hasDownload() {
    return this[_data].has(m.body);
  }

  getDownload() {
    if (!this.hasDownload()) {
      return null;
    }

    const {path, mime, filename, size, token} = this[_data].get(m.body).toJS();

    return new File(m.body, path, mime, filename, size, token);
  }

  hasFiles() {
    return this[_data].has(m.files);
  }

  getFiles() {
    return this.hasFiles() ? this[_data].get(m.files).toJS() : null;
  }

  hasData() {
    return this[_data].has(m.data);
  }

  getData(service, version, action) {
    let d = this[_data].get(m.data);

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

  hasRelations() {
    return this[_data].has('relations');
  }

  getRelations(service) {
    let relations = this[_data].get('relations') || Immutable.Map({});

    if (service) {
      relations = relations.get(service) || Immutable.Map({});
    }

    return relations.toJS();
  }

  hasLinks() {
    return this[_data].has('links');
  }

  getLinks(service) {
    let links = this[_data].get('links') || Immutable.Map({});

    if (service) {
      links = links.get(service) || Immutable.Map({});
    }

    return links.toJS();
  }

  hasCalls() {
    return this[_data].has('calls');
  }

  getCalls(service) {
    let calls = this[_data].get('calls') || Immutable.Map({});

    if (service) {
      calls = calls.get(service) || Immutable.Map({});
    }

    return calls.toJS();
  }

  hasTransactions() {
    return this[_data].has('transactions');
  }

  getTransactions(service) {
    let transactions = this[_data].get('transactions') || Immutable.Map({});

    if (service) {
      transactions = transactions.get(service) || Immutable.Map({});
    }

    return transactions.toJS();
  }

  getErrors(service) {
    let errors = this[_data].get('errors') || Immutable.Map({});

    if (service) {
      errors = errors.get(service) || Immutable.Map({});
    }

    return errors.toJS();
  }

  _setProperty(name, value) {
    this[_data] = this[_data].setIn(['meta', 'properties', name], value);
  }

  hasFile(service, version, action, name) {
    return this[_data]
      .hasIn([m.files, this._getGatewayPublicAddress(), service, version, action, name]);
  }

  getFile(service, version, action, name) {
    let getGatewayPublicAddress = this._getGatewayPublicAddress();

    return this[_data]
      .getIn([m.files, getGatewayPublicAddress, service, version, action, name])
      .toJS();
  }

  hasBody() {
    return this[_data].has(m.body);
  }

  getBody() {
    return this[_data].get(m.body);
  }

  _setBody(file) {
    this[_data] = this[_data].setIn([m.body], file);
  }

  _setData(service, version, action, source) {

    const gatewayPublicAddress = this._getGatewayPublicAddress();
    const path = [m.data, gatewayPublicAddress, service, version, action];

    this[_data] = this[_data].setIn(path, Immutable.fromJS(source));
  }

  _getGatewayPublicAddress() {
    return this.getMeta()[m.gateway][1];
  }

  relateOne(name, primaryKey, service, foreignKey) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, service],
      foreignKey
    );
  }

  relateMany(name, primaryKey, service, foreignKeys) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, service],
      Immutable.fromJS(foreignKeys)
    );
  }


  relateOneRemote(name, primaryKey, address, service, foreignKey) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, address, service],
      foreignKey
    );
  }

  relateManyRemote(name, primaryKey, address, service, foreignKeys) {
    this[_data] = this[_data].setIn(
      ['relations', this._getGatewayPublicAddress(), name, primaryKey, address, service],
      Immutable.fromJS(foreignKeys)
    );
  }

  _setLink(name, link, uri) {
    this[_data] = this[_data].setIn(['links', name, link], uri);
  }

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
