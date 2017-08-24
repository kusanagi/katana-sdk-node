'use strict';

const Response = require('./response');
const Transport = require('./transport');
const expect = require('chai').expect;

describe('Response', () => {
  // const mockResponse = {
  //   version: '1.0',
  //   status: '200 OK'
  // };

  it('should create an instance', () => {
    const response = new Response();
    expect(response).to.be.an.instanceOf(Response);
  });

  describe('getTransport()', () => {
    it('should return an instance of the transport', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', null, null
      );
      expect(response.getTransport()).to.be.an.instanceOf(Transport);
    });
  });

  describe('getReturn()', () => {
    it('should return the return value of the response', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', 'test_return', null
      );
      expect(response.getReturn()).to.equal('test_return');
    });
  });

  describe('hasReturn()', () => {
    it('should return an instance of the transport', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', null, null
      );
      expect(response.hasReturn()).to.equal(false);
    });
  });

  describe('getRequestAttributes()', () => {
    it('should return all of the request attributes', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', null, null, {foo: 'bar'}
      );
      expect(response.getRequestAttributes()).to.include({foo: 'bar'});
    });
  });

  describe('getRequestAttribute()', () => {
    it('should return the request attribute by name', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', null, null, {foo: 'bar'}
      );
      expect(response.getRequestAttribute('foo')).to.equal('bar');
    });
    it('should throw an error if the param `name` is not specified', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', null, null, {foo: 'bar'}
      );
      expect(() => response.getRequestAttribute(null)).to.throw(/Specify an attribute `name`/);
    });

    it('should throw an error if the param `defaultValue` is not a string', () => {
      const transport = new Transport();
      const response = new Response(
        null, '', '', '', '', {}, false, null, null, transport, '', '', null, null, {}
      );
      expect(() => response.getRequestAttribute('foo', 1))
        .to.throw(/The param `defaultValue` must be a string/);
    });
  });
});
