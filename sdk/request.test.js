'use strict';

const expect = require('chai').expect;

const assert = require('assert');
const Request = require('./request');
const Response = require('./response');
const HttpRequest = require('./http-request');
const ServiceCall = require('./service-call');
const Param = require('./param');

const m = require('./mappings');

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


  describe('hasParam()', () => {
    it('should determine if a parameter was provided for the request', () => {
      const mockParams = {
        name: {
          [m.value]: 'James',
          [m.type]: 'string'
        }
      };
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, mockParams);
      expect(request.hasParam('name')).to.equal(true);
    });

    it('should return false if the parameter was not provided', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(request.hasParam('name')).to.equal(false);
    });

    it('should throw an error if the param `name` is not specified', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.hasParam(null)).to.throw(/Specify a param `name`/);
    });

    it('should throw an error if the specified param `name` is not a string', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.hasParam(true)).to.throw(/The param `name` must be a string/);
    });
  });

  describe('getParam()', () => {

    it('should get a parameter with the specified name and be an instance of Param', () => {
      const mockParams = {
        name: {
          [m.value]: 'James',
          [m.type]: 'string'
        }
      };
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, mockParams);
      const param = request.getParam('name');
      expect(param).to.be.an.instanceOf(Param);
      expect(param.getValue()).to.equal('James');
    });

    it('should throw an error if the param `name` is not specified', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.getParam(null)).to.throw(/Specify a param `name`/);
    });

    it('should throw an error if the specified param `name` is not a string', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.getParam(true)).to.throw(/The param `name` must be a string/);
    });
  });

  describe('getParams()', () => {
    it('returns all the parameters as an array of Param objects', () => {
      const mockParams = {
        name: {
          [m.value]: 'James',
          [m.type]: 'string'
        }
      };
      const expectedResult = {
        name: {
          ['_value']: 'James',
          ['_type']: 'string',
          ['_exists']: true,
          ['_name']: 'name',
        }
      };
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, mockParams);
      expect(request.getParams()).to.eql([expectedResult.name]);
    });
  });

  describe('setParam()', () => {
    it('should set a new parameter with the specified data to the request', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      const param = request.newParam('name', 'James', 'string');
      request.setParam(param);
      const newParam = request.getParam('name');
      expect(newParam).to.be.an.instanceOf(Param);
      expect(newParam.getValue()).to.equal('James');
    });

    it('should throw an error if the param `name` is not specified', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.setParam(null)).to.throw(/`param` must be an instance of Param/);
    });

  });

  describe('newParam()', () => {
    it('should create a new parameter with the specified name', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      const param = request.newParam('name');
      assert.ok(param instanceof Param);
      assert.equal(param.getName(), 'name');
    });

    it('should throw an error if the param `name` is not specified', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.getParam(null)).to.throw(/Specify a param `name`/);
    });

    it('should throw an error if the specified param `name` is not a string', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      expect(() => request.newParam(true)).to.throw(/The param `name` must be a string/);
    });

    it('should create a new parameter with the specified name, value and type', () => {
      let call = new ServiceCall(null, null, 'get');
      const request = new Request(null, null, null, null, {}, false, mockHttpRequest, {}, call,
        null, null, null, {params: {}});
      const param = request.newParam('name', 'James', 'string');
      expect(param).to.be.an.instanceOf(Param);
      expect(param.getName()).to.equal('name');
      expect(param.getValue()).to.equal('James');
      expect(param.getType()).to.equal('string');
    });
  });

  describe('newResponse()', () => {
    it('should return a Response instance with specified status code and text', () => {
      const request = new Request(null, '', '', '', '', {}, false, mockHttpRequest, null,
        '', '', '', '');
      const statusCode = 200;
      const statusText = 'OK';

      const response = request.newResponse(statusCode, statusText);

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
