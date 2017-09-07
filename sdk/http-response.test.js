'use strict';

const assert = require('assert');
const HttpResponse = require('./http-response');

describe('HttpResponse', () => {
  const mockResponse = {
    version: '1.0',
    status: '200 OK'
  };

  it('should create an instance', () => {
    const httpResponse = new HttpResponse(mockResponse);
    assert.ok(httpResponse instanceof HttpResponse);
  });

  describe('isProtocolVersion()', () => {
    it('should determine if protocol version matches', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.ok(httpResponse.isProtocolVersion('1.0'));
    });

    it('should return false if versions do not match', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.isProtocolVersion('2.0'), false);
    });

    it('should throw an error if no version specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(httpResponse.isProtocolVersion, /Specify a protocol `version`/);
    });

    it('should throw an error if no version specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() =>
        httpResponse.isProtocolVersion(false), /The protocol `version` must be a string/);
    });
  });

  describe('getProtocolVersion()', () => {
    it('should get the protocol version', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getProtocolVersion(), '1.0');
    });
  });

  describe('setProtocolVersion()', () => {
    it('should set the protocol version', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getProtocolVersion(), '1.0');
      httpResponse.setProtocolVersion('2.0');
      assert.equal(httpResponse.getProtocolVersion(), '2.0');
    });

    it('should throw an error if no version specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(httpResponse.setProtocolVersion, /Specify a protocol `version`/);
    });

    it('should throw an error if no version specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() =>
        httpResponse.setProtocolVersion(Boolean), /The protocol `version` must be a string/);
    });
  });

  describe('isStatus()', () => {
    it('should determine if status matches', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.ok(httpResponse.isStatus('200 OK'));
    });

    it('should return false if status do not match', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.isStatus('400 Bad Request'), false);
    });

    it('should throw an error if no status specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(httpResponse.isStatus, /Specify a `status`/);
    });

    it('should throw an error if specified status is not a string', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() => httpResponse.isStatus({}), /The `status` must be a string/);
    });
  });

  describe('getStatus()', () => {
    it('should return the status', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatus(), '200 OK');
    });
  });

  describe('getStatusCode()', () => {
    it('should return status code', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatusCode(), '200');
    });
  });

  describe('getStatusText()', () => {
    it('should return status text', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatusText(), 'OK');
    });
  });

  describe('setStatus()', () => {
    it('should set the status', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatus(), '200 OK');
      httpResponse.setStatus(400, 'Bad Request');
      assert.equal(httpResponse.getStatus(), '400 Bad Request');
    });

    it('should throw an error if no code specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatus(), '200 OK');
      assert.throws(() => httpResponse.setStatus(void 0, 'Bad Request'), /Specify a status `code`/);
    });

    it('should throw an error if the code is not an integer', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatus(), '200 OK');
      assert.throws(() =>
        httpResponse.setStatus('200', 'Bad Request'), /The status `code` must be an integer/);
    });

    it('should throw an error if no text specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatus(), '200 OK');
      assert.throws(() => httpResponse.setStatus(400, void 0), /Specify a status `text`/);
    });

    it('should throw an error if specified text is not a string', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.getStatus(), '200 OK');
      assert.throws(() => httpResponse.setStatus(400, true), /The status `text` must be a string/);
    });
  });

  describe('hasHeader()', () => {
    it('should determine if header has been set', () => {
      const _mockResponse = Object.assign({headers: {'Content-Type': 'test'}}, mockResponse);
      const httpResponse = new HttpResponse(_mockResponse);
      assert.ok(httpResponse.hasHeader('Content-Type'));
    });

    it('should return false if header has not been set', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.hasHeader('Content-Type'), false);
    });

    it('should throw an error if no header `name` specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(httpResponse.hasHeader, /Specify a header `name`/);
    });

    it('should throw an error if specified header `name` is not a string', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() => httpResponse.hasHeader({}), /The header `name` must be a string/);
    });
  });

  describe('getHeader()', () => {
    it('should return the header with the specified `name`', () => {
      const _mockResponse = Object.assign({headers: {'Content-Type': 'test'}}, mockResponse);
      const httpResponse = new HttpResponse(_mockResponse);
      assert.equal(httpResponse.getHeader('Content-Type'), 'test');
    });


    it('should return the default value if specified header does not exist', () => {
      const _mockResponse = Object.assign({headers: {}}, mockResponse);
      const httpResponse  = new HttpResponse(_mockResponse);

      const defaultValue = 'text/plain';

      assert.equal(httpResponse.getHeader('Content-Type', defaultValue), defaultValue);
    });

    it('should throw an error if no header `name` specified', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(httpResponse.getHeader, /Specify a header `name`/);
    });

    it('should throw an error if specified header `name` is not a string', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() => httpResponse.getHeader({}), /The header `name` must be a string/);
    });
  });

  describe('getHeaders()', () => {
    it('should return all headers', () => {
      const headers = {'Content-Type': ['test']};
      const _mockResponse = Object.assign({headers}, mockResponse);
      const httpResponse = new HttpResponse(_mockResponse);
      assert.deepEqual(httpResponse.getHeaders(), {'Content-Type': 'test'});
    });

    it('should return an empty set of headers when none are set', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.deepEqual(httpResponse.getHeaders(), {});
    });
  });

  describe('setHeader()', () => {
    it('should set a header in the httpResponse', () => {
      const httpResponse = new HttpResponse(mockResponse);
      httpResponse.setHeader('Content-Type', 'test');
      assert.ok(httpResponse.hasHeader('Content-Type'));
      assert.equal(httpResponse.getHeader('Content-Type'), 'test');
    });

    it('should throw an error if a header `name` is not defined', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() => httpResponse.setHeader(void 0, 'test'), /Specify a header `name`/);
    });

    it('should throw an error if a header `name` is not a string', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() =>
        httpResponse.setHeader(false, 'test'), /The header `name` must be a string/);
    });

    it('should throw an error if a header `value` is not defined', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() =>
        httpResponse.setHeader('Content-Type', void 0), /Specify a header `value`/);
    });

    it('should throw an error if a header `name` is not a string', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.throws(() => httpResponse.setHeader('Content-Type', []),
        /The header `value` must be a string/);
    });

    it('should register a new header as an array with 1 value', () => {
      const httpResponse = new HttpResponse(mockResponse);
      httpResponse.setHeader('X-Test', 'test');
      assert.ok(httpResponse.hasHeader('X-Test'));
      assert.deepEqual(httpResponse.getHeaderArray('X-Test'), ['test']);
    });
  });

  describe('hasBody()', () => {
    it('should determine if the httpResponse has a `body`', () => {
      const _mockResponse = Object.assign({body: ' '}, mockResponse);
      const httpResponse = new HttpResponse(_mockResponse);
      assert.ok(httpResponse.hasBody());
    });

    it('should return false if the esponse do not have a `body`', () => {
      const httpResponse = new HttpResponse(mockResponse);
      assert.equal(httpResponse.hasBody(), false);
    });
  });

  describe('getBody()', () => {
    it('should return the content of the httpResponse `body`', () => {
      const body = ' ';
      const _mockResponse = Object.assign({body}, mockResponse);
      const httpResponse = new HttpResponse(_mockResponse);
      assert.equal(httpResponse.getBody(), body);
    });
  });

  describe('setBody()', () => {
    it('should set the content of the httpResponse `body`', () => {
      const body = ' ';
      const httpResponse = new HttpResponse(mockResponse);
      httpResponse.setBody(body);
      assert.equal(httpResponse.getBody(), body);
    });
  });
});
