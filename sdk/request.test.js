'use strict';

const expect = require('chai').expect;

const Request = require('./request');
const Response = require('./response');
const HttpRequest = require('./http-request');
const ServiceCall = require('./service-call');

describe('Request', () => {
  const mockHttpRequest = new HttpRequest({
    version: '1.1',
    method: 'POST',
    url: 'http://example.com/v1.0.0/users'
  });

  it('should create an instance', () => {
    const request = new Request();
    expect(request).to.be.an.instanceOf(Request);
  });

  xdescribe('getGatewayProtocol()', () => {
    it('returns the protocol implemented by the Gateway component ', () => {

    });
  });

  xdescribe('getGatewayAddress()', () => {
    it('returns the public address of the Gateway component ', () => {

    });
  });

  xdescribe('getClientAddress()', () => {
    it('returns the IP address and port of the client which sent the request', () => {

    });
  });

  describe('getServiceName()', () => {
    it('should return the name currently defined for the Service', () => {
      const call = new ServiceCall('users');
      const request = new Request(null, null, null, null, null, {}, false, mockHttpRequest, call);
      expect(request.getServiceName()).to.equal('users');
    });

    it('should return an empty string if the Service name is not defined', () => {
      const call = new ServiceCall();
      const request = new Request(null, null, null, null, null, {}, false, mockHttpRequest, call);
      expect(request.getServiceName()).to.equal('');
    });
  });

  describe('setServiceName()', () => {
    it('should set the name for the Service', () => {
      let call = new ServiceCall();
      const request   = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call);
      request.setServiceName('users');
      expect(request.getServiceName()).to.equal('users');
    });

    it('should throw if parameter `service` is not specified', () => {
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest);
      expect(request.setServiceName).to.throw(/Specify a `service` name/);
    });
  });

  describe('getServiceVersion()', () => {
    it('should return the version currently defined for the Service', () => {
      let call = new ServiceCall('', '1.0');
      const request = new Request(null, null, null, null, null, {}, false, mockHttpRequest, call);
      expect(request.getServiceVersion()).to.equal('1.0');
    });

    it('should return an empty string if the Service version is not defined', () => {
      let call = new ServiceCall();
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call);
      expect(request.getServiceVersion()).to.equal('');
    });
  });

  describe('setServiceVersion()', () => {
    it('should set the version for the Service', () => {
      let call = new ServiceCall();
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call);
      request.setServiceVersion('1.0');
      expect(request.getServiceVersion()).to.equal('1.0');
    });

    it('should throw if parameter `service` is not specified', () => {
      let call = new ServiceCall();
      const request = new Request(null, null, null, null, null, {}, false, mockHttpRequest, call);
      expect(request.setServiceVersion).to.throw(/Specify a service `version`/);
    });
  });

  describe('getActionName()', () => {
    it('should return the action currently defined for the Service', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, null, {}, false, mockHttpRequest, call);
      expect(request.getActionName()).to.equal('get');
    });

    it('should return an empty string if the Service action is not defined', () => {
      let call = new ServiceCall();
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call);
      expect(request.getActionName()).to.equal('');
    });
  });

  describe('setActionName()', () => {
    it('should set the action for the Service', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call);
      request.setActionName('get');
      expect(request.getActionName()).to.equal('get');
    });

    it('should throw if parameter `service` is not specified', () => {
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest);
      expect(request.setActionName).to.throw(/Specify a service `action`/);
    });
  });


  xdescribe('hasParam()', () => {

    it('determines if a parameter has been defined', () => {

    });

  });

  xdescribe('getParam()', () => {

    it('returns an instance of Param', () => {

    });

  });

  xdescribe('getParams()', () => {

    it('returns an array of Param objects', () => {

    });

  });

  xdescribe('setParam()', () => {

    it('adds the parameter', () => {

    });

  });

  xdescribe('newParam()', () => {

    it('returns a new Param instance', () => {

    });

  });

  describe('newResponse()', () => {
    it('should return a Response instance with specified status code and text', () => {
      const request = new Request(null, null, null, null, null, {}, false, mockHttpRequest);
      const [statusCode, statusText] = '200 OK'.split(' ');
      const response = request.newResponse(parseInt(statusCode, 10), statusText);

      expect(response).to.be.an.instanceOf(Response);
      expect(response.getHttpResponse().getStatusCode()).equal(statusCode);
      expect(response.getHttpResponse().getStatusText()).equal(statusText);
    });
  });


  xdescribe('getHttpRequest()', () => {

    it('returns the instance of the HttpRequest for this Request', () => {

    });

  });

});
