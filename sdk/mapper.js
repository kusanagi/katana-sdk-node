'use strict';

const _ = require('lodash');
const HttpRequest = require('./http-request');
const HttpResponse = require('./http-response');
const ServiceCall = require('./service-call');
const File = require('./file');
const Transport = require('./transport');
const m = require('./mappings');

class Mapper {
  constructor(options) {
    const defaults = {compact: true};
    const compact = (c) => () => c;
    const extended = (c, e) => () => e;

    this.options = Object.assign({}, defaults, options);

    const get = this.options.compact ? compact : extended;

    this._mappings = {};
    _.forIn(m, (c, e) =>
      Object.defineProperty(this._mappings, e, {get: get(c, e)})
    );
  }

  /**
   *
   * @param {Request} requestApi
   * @returns {Object}
   */
  getRequestMessage(requestApi) {
    return {
      [m.command_reply]: {
        [m.name]: requestApi.getName(),
        [m.result]: {
          [m.call]: {
            [m.service]: requestApi.getServiceName(),
            [m.version]: requestApi.getServiceVersion(),
            [m.action]: requestApi.getActionName(),
            [m.params]: requestApi.getParams().map((p) => ({
                [m.type]: p.getType(),
                [m.value]: p.getValue(),
                [m.name]: p.getName(),
              }
            )),
          }
        }
      }
    };
  }


  /**
   *
   * @param {Response} responseApi
   * @returns {Object}
   */
  getResponseMessage(responseApi) {
    const httpResponse = responseApi.getHttpResponse();

    let payload = {
      [m.command_reply]: {
        [m.name]: responseApi.getName(),
        [m.result]: {
          [m.response]: {
            [m.version]: httpResponse.getProtocolVersion(),
            [m.status]: httpResponse.getStatus(),
            [m.headers]: httpResponse.getHeaders(),
            [m.body]: httpResponse.getBody(),
          }
        }
      }
    };
    if (responseApi.hasReturn()) {
      payload[m.command_reply][m.result][m.response_return] = responseApi.getReturnType();
    }
    return payload;
  }


  /**
   *
   * @param {Action} actionApi
   * @returns {Object}
   */
  getActionMessage(actionApi) {
    return {
      [m.command_reply]: {
        [m.name]: actionApi.getName(),
        [m.result]: {
          [m.transport]: this.getTransportMessage(actionApi.getTransport())
        }
      }
    };
  }

  /**
   *
   * @param {Object} data
   * @returns {HttpRequest}
   */
  getHttpRequest(data) {
    // const requestData = data[m.command][m.arguments][m.request];

    const httpRequestData = {
      version: data[m.version],
      method: data[m.method],
      url: data[m.url]
    };

    if (_.has(data, m.query)) {
      httpRequestData.query = data[m.query];
    }

    if (_.has(data, m.post_data)) {
      httpRequestData.postData = data[m.post_data];
    }

    if (_.has(data, m.headers)) {
      httpRequestData.headers = data[m.headers];
    }

    if (_.has(data, m.body)) {
      httpRequestData.body = data[m.body];
    }

    if (_.has(data, m.files)) {
      httpRequestData.files = data[m.files].map((fileData) => new File(
        fileData[m.name],
        fileData[m.path],
        fileData[m.mime],
        fileData[m.filename],
        fileData[m.size],
        fileData[m.token]
      ));
    }

    return new HttpRequest(httpRequestData);
  }

  getHttpResponse(data) {

    if (!data) {
      throw new Error('Cannot get HTTP response without data');
    }

    const httpResponseData = {
      version: data[m.version],
      status: data[m.status]
    };

    if (_.has(data, m.body)) {
      httpResponseData.body = data[m.body];
    }

    if (_.has(data, m.headers)) {
      httpResponseData.headers = data[m.headers];
    }

    return new HttpResponse(httpResponseData);
  }

  getServiceCall(data) {
    // const callData = data[m.command][m.arguments][m.call];

    return new ServiceCall(
      data[m.service],
      data[m.version],
      data[m.action],
      data[m.params]
    );
  }

  getTransport(data) {
    if (!data) {
      throw new Error('Cannot create a Transport without data');
    }

    return new Transport(data);
  }

  getTransportMessage(transport) {
    const transportMessage = {
      [m.meta]: transport.getMeta()
    };

    if (transport.hasFiles()) {
      transportMessage[m.files] = transport.getFiles();
    }

    if (transport.hasData()) {
      transportMessage[m.data] = transport.getData();
    }

    if (transport.hasRelations()) {
      transportMessage[m.relations] = transport.getRelations();
    }

    if (transport.hasLinks()) {
      transportMessage[m.links] = transport.getLinks();
    }

    if (transport.hasCalls()) {
      transportMessage[m.calls] = transport.getCalls();
    }

    if (transport.getTransactions()) {
      transportMessage[m.transactions] = transport.getTransactions();
    }

    if (transport.getErrors()) {
      transportMessage[m.errors] = transport.getErrors();
    }

    if (transport.hasBody()) {
      transportMessage[m.body] = transport.getBody();
    }

    return transportMessage;
  }
}

module.exports = Mapper;
