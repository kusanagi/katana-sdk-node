'use strict';

const expect    = require('chai').expect;
const Transport = require('./transport');
const Mapper    = require('./mapper');
const m         = require('./mappings');

const mockRequestTransport = {
  'm': {'s': 'gateway'},
  'c': {
    'a': {
      'm': {
        'g': ['127.0.0.1:4444', 'http://10.0.2.15:9999'],
        'c': '10.0.2.2:64276',
        't': 1,
        'p': 'urn:katana:protocol:http',
        'v': '1.0.9',
        'd': '2017-04-26T22:14:52.385850+00:00',
        'i': '003969a5-bb24-4d68-8bf1-079ae7419d32'
      },
      'c': {'a': '', 'p': [], 's': '', 'v': ''},
      'r': {
        'h': {'ACCEPT': ['*/*'], 'HOST': ['localhost:9999'], 'USER-AGENT': ['curl/7.51.0']},
        'm': 'GET',
        'v': '1.1',
        'b': '',
        'u': 'http://localhost:9999/1.0/users'
      }
    }, 'n': 'rest'
  }
};

describe('mapper', () => {

  it('should create an instance', () => {
    const mapper = new Mapper();
    expect(mapper).to.be.an.instanceOf(Mapper);
  });

  describe('getTransport', () => {

    it('should return a Transport instance', () => {
      const mapper    = new Mapper();
      const transport = mapper.getTransport(mockRequestTransport[m.command][m.arguments]);
      expect(transport).to.be.an.instanceOf(Transport);
      expect(transport.getMeta()[m.gateway][1]).to.equal('http://10.0.2.15:9999');
    });

  });

});
