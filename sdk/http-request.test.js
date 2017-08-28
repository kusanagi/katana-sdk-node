'use strict';

const assert = require('assert');
const _ = require('lodash');
const url = require('url');
const HttpRequest = require('./http-request');

describe('HttpRequest', () => {
  const mockRequest = {
    version: '1.1',
    method: 'POST',
    url: 'http://example.com/v1.0.0/users'
  };

  it('should create an instance', () => {
    const httpRequest = new HttpRequest(mockRequest);
    assert.ok(httpRequest instanceof HttpRequest);
  });
  describe('isMethod()', () => {
    it('should determine if `method` matches that of the httpRequest', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.ok(httpRequest.isMethod('POST'));
    });

    it('should return false if `method` does not math that of the httpRequest', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.isMethod('GET'), false);
    });
  });

  describe('getMethod()', () => {
    it('should return the httpRequest method', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getMethod(), 'POST');
    });
  });

  describe('getUrl()', () => {
    it('should return the full URL provided for the httpRequest', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getUrl(), mockRequest.url);
    });
  });

  describe('getUrlScheme()', () => {
    it('should return scheme used for the URL provided for the httpRequest', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getUrlScheme(), url.parse(mockRequest.url).protocol);
    });
  });

  describe('getUrlHost()', () => {
    it('should return host of the URL provided for the httpRequest', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getUrlHost(), url.parse(mockRequest.url).host);
    });
  });

  describe('getUrlPath()', () => {
    it('should return the path of the URL provided for the httpRequest', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getUrlPath(), url.parse(mockRequest.url).pathname);
    });
  });

  describe('hasQueryParam()', () => {
    it('should determine if the paramater `name` exists in the query object', () => {
      const query = {q: ['test']};
      const _mockRequest = _.merge({query}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.ok(httpRequest.hasQueryParam('q'));
    });

    it('should throw if parameter `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.hasQueryParam, /Specify a param `name`/);
    });
  });

  describe('getQueryParam()', () => {
    it('should return the value of the paramater by `name`', () => {
      const query = {q: ['test']};
      const _mockRequest = _.merge({query}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getQueryParam('q'), query.q[0]);
    });

    it('should return the `defaultValue` if parameter `name` does not exist', () => {
      const query = {};
      const _mockRequest = _.merge({query}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.equal(httpRequest.getQueryParam('q', 'default'), 'default');
    });

    it('should throw if parameter `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.getQueryParam, /Specify a param `name`/);
    });
  });

  describe('getQueryParamArray()', () => {
    it('should return the value of the paramater by `name` as an array', () => {
      const query = {q: ['test']};
      const _mockRequest = _.merge({query}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getQueryParamArray('q'), query.q);
    });

    it('should return the `defaultValue` if parameter `name` does not exist', () => {
      const query = {};
      const _mockRequest = _.merge({query}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      const defaultValue = ['default'];
      assert.deepEqual(httpRequest.getQueryParamArray('q', defaultValue), defaultValue);
    });

    it('should throw if parameter `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.getQueryParamArray, /Specify a param `name`/);
    });

    it('should throw if `defaultValue` is not an array', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(() => httpRequest.getQueryParamArray('q', {}),
        /The `defaultValue` must be an array/);
    });

    it('should throw if `defaultValue` is not an array of strings', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(() => httpRequest.getQueryParamArray('q', ['', null]),
        /The `defaultValue` must be an array of strings/);
    });
  });

  xdescribe('getQueryParams()', () => {
    it('', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getQueryParams(), mockRequest.url);
    });
  });

  describe('getQueryParamsArray()', () => {
    it('should return the query object', () => {
      const query = {q: ['test']};
      const _mockRequest = _.merge({query}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getQueryParamsArray(), query);
    });
  });

  describe('hasPostParam()', () => {
    it('should determine if the parameter `name` is defined in the post data', () => {
      const postData = {name: ['test']};
      const _mockRequest = _.merge({postData}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.ok(httpRequest.hasPostParam('name'));
    });

    it('should throw if parameter `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.hasPostParam, /Specify a param `name`/);
    });
  });

  describe('getPostParam()', () => {
    it('should return the value of the paramater by `name`', () => {
      const postData = {name: ['test']};
      const _mockRequest = _.merge({postData}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getPostParam('name'), postData.name[0]);
    });

    it('should return the `defaultValue` if parameter `name` does not exist', () => {
      const postData = {};
      const _mockRequest = _.merge({postData}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.equal(httpRequest.getPostParam('name', 'default'), 'default');
    });

    it('should throw if parameter `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.getPostParam, /Specify a param `name`/);
    });
  });

  describe('getPostParamArray()', () => {
    it('should return the value of the paramater by `name` as an array', () => {
      const postData = {name: ['test']};
      const _mockRequest = _.merge({postData}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getPostParamArray('name'), postData.name);
    });

    it('should return the `defaultValue` if parameter `name` does not exist', () => {
      const postData = {};
      const _mockRequest = _.merge({postData}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      const defaultValue = ['default'];
      assert.deepEqual(httpRequest.getPostParamArray('name', defaultValue), defaultValue);
    });

    it('should throw if parameter `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.getPostParamArray, /Specify a param `name`/);
    });

    it('should throw if `defaultValue` is not an array', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(() => httpRequest.getPostParamArray('name', {}),
        /The `defaultValue` must be an array/);
    });

    it('should throw if `defaultValue` is not an array of strings', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(() => httpRequest.getPostParamArray('name', ['', null]),
        /The `defaultValue` must be an array of strings/);
    });
  });

  xdescribe('getPostParams()', () => {
    it('', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getPostParams(), mockRequest.url);
    });
  });

  describe('getPostParamsArray()', () => {
    it('returns an object with the parameters provided in the post data', () => {
      const postData = {name: ['test']};
      const _mockRequest = _.merge({postData}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getPostParamsArray(), postData);
    });
  });

  describe('getProtocolVersion()', () => {
    it('should get the protocol version', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getProtocolVersion(), '1.1');
    });
  });

  describe('isProtocolVersion()', () => {
    it('should determine if protocol version matches', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.ok(httpRequest.isProtocolVersion('1.1'));
    });

    it('should return false if versions do not match', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.isProtocolVersion('2.0'), false);
    });

    it('should throw an error if no version specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.isProtocolVersion, /Specify a protocol `version`/);
    });
  });

  describe('hasHeader()', () => {
    it('should determine if the httpRequest contains the specified header `name`', () => {
      const headers = {'Content-Type': 'test'};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.ok(httpRequest.hasHeader('Content-Type'));
    });

    it('should return false if the specified header does not exist', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.hasHeader('Content-Type'), false);
    });

    it('should throw an error if no header `name` specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.hasHeader, /Specify a header `name`/);
    });
  });

  describe('getHeader()', () => {
    it('should return the header with the specified `name`', () => {
      const headers = {'Content-Type': ['test']};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.equal(httpRequest.getHeader('Content-Type'), 'test');
    });

    it('should return the default value when header is not present', () => {
      const headers      = {};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest  = new HttpRequest(_mockRequest);
      const defaultValue = 'text/plain';
      assert.equal(httpRequest.getHeader('Content-Type', defaultValue), defaultValue);
    });

    it('should throw an error if no header `name` specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.getHeader, /Specify a header `name`/);
    });
  });

  describe('getHeaderArray()', () => {
    it('should return the header array with the specified `name`', () => {
      const headers = {'Content-Type': ['test', 'tast']};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getHeaderArray('Content-Type'), ['test', 'tast']);
    });

    it('should return the default value when header is not present', () => {
      const headers      = {};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest  = new HttpRequest(_mockRequest);
      const defaultValue = 'text/plain';
      assert.deepEqual(httpRequest.getHeaderArray('Content-Type', defaultValue), defaultValue);
    });

    it('should return the empty array if no defaultValue is present', () => {
      const headers      = {};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest  = new HttpRequest(_mockRequest);

      assert.deepEqual(httpRequest.getHeaderArray('Content-Type'), []);
    });

    it('should throw an error if no header `name` specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.getHeaderArray, /Specify a header `name`/);
    });
  });

  describe('getHeaders()', () => {
    it('should return all headers', () => {
      const headers = {'Content-Type': ['test', 'tast']};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getHeaders(), {'Content-Type': 'test'});
    });

    it('should return an empty set of headers when none are set', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.deepEqual(httpRequest.getHeaders(), {});
    });
  });

  describe('getHeaderArray()', () => {
    it('should return all headers as arrays', () => {
      const headers = {'Content-Type': ['test', 'tast']};
      const _mockRequest = _.merge({headers}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getHeadersArray(), headers);
    });

    it('should return an empty set of headers when none are set', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.deepEqual(httpRequest.getHeadersArray(), []);
    });
  });

  describe('hasBody()', () => {
    it('should determine if the HTTP httpRequest body contains content', () => {
      const body = ' ';
      const _mockRequest = _.merge({body}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.ok(httpRequest.hasBody());
    });

    it('should return false if HTTP httpRequest body does not exist', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.hasBody(), false);
    });
  });

  describe('getBody()', () => {
    it('should return the content of the HTTP httpRequest body', () => {
      const body = ' ';
      const _mockRequest = _.merge({body}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getBody(), body);
    });

    it('should return an empty string if HTTP httpRequest body is not defined', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.deepEqual(httpRequest.getBody(), '');
    });
  });

  describe('hasFile()', () => {
    it('should determine if the file was uploaded in the httpRequest by `name`', () => {
      const files = {avatar: {}};
      const _mockRequest = _.merge({files}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.ok(httpRequest.hasFile('avatar'));
    });

    it('should throw if file `name` is not specified', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.throws(httpRequest.hasFile, /Specify a file `name`/);
    });

    it('should return false if the file was not uploaded in the httpRequest by `name`', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.hasFile('avatar'), false);
    });
  });

  xdescribe('getFile()', () => {
    it('', () => {
      const httpRequest = new HttpRequest(mockRequest);
      assert.equal(httpRequest.getFile(), mockRequest.url);
    });
  });

  describe('getFiles()', () => {
    it('should return an array with the files uploaded in the httpRequest', () => {
      const files = {avatar: {}};
      const _mockRequest = _.merge({files}, mockRequest);
      const httpRequest = new HttpRequest(_mockRequest);
      assert.deepEqual(httpRequest.getFiles('avatar'), files);
    });
  });

});
