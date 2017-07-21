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
        null, '', '', '', '', {}, false, null, null, transport, '', '', null
      );
      expect(response.getTransport()).to.be.an.instanceOf(Transport);
    });
  });
});
