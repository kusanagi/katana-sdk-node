'use strict';

const expect = require('chai').expect;
// const m = require('./mappings');

const Middleware = require('./middleware');
const Request = require('./request');
const Response = require('./response');

describe('Middleware', () => {
  const argv = process.argv;
  const mockArgv = [
    '--name', 'example',
    '--version', '0.0.0',
    '--component', 'middleware',
    '--framework-version', '0.0.0',
    '--debug'
  ];

  beforeEach(() => {
    process.argv = mockArgv;
  });

  afterEach(() => {
    process.argv = argv;
  });

  it('should create an instance', () => {
    const middleware = new Middleware();
    expect(middleware).to.be.an.instanceOf(Middleware);
  });

  describe('request()', () => {

    xit('should accept a callable ', () => {

    });

    xit('should fail if passed something different than a callable ', () => {


    });

    it('should be run when processing a Request Command', (done) => {
      const middleware = new Middleware();

      middleware.request((request) => {
        expect(request).to.be.an.instanceOf(Request);
        done();
        return request;
      });

      const request = {
        'm': {'s': 'gateway'},
        'c': {
          'n': 'rest',
          'a': {
            'm': {
              'd': '2017-05-02T14:01:13.344278+00:00',
              'p': 'urn:katana:protocol:http',
              't': 1,
              'c': '10.0.2.2:64862',
              'i': '75fa1208-fd7a-4e47-ac05-f9359550392b',
              'v': '1.0.9',
              'g': ['127.0.0.1:4444', 'http://10.0.2.15:9999']
            },
            'r': {
              'b': '',
              'u': 'http://localhost:9999/1.0/users/1',
              'm': 'GET',
              'v': '1.1',
              'h': {'USER-AGENT': ['curl/7.51.0'], 'ACCEPT': ['*/*'], 'HOST': ['localhost:9999']}
            },
            'c': {'p': [], 'a': '', 's': '', 'v': ''}
          }
        }
      };

      middleware.run();
      middleware._processCommand('request', request);
      middleware._closeSocket();

    });

  });

  describe('response()', () => {

    xit('should accept a callable ', () => {

    });

    xit('should fail if passed something different than a callable ', () => {


    });

    it('should be run when processing a Response Command', (done) => {
      const middleware = new Middleware();

      middleware.response((response) => {
        expect(response).to.be.an.instanceOf(Response);
        done();
        return response;
      });

      const response = {
        'm': {
          'v': '1.0.0',
          'i': 'f1b27da9-240b-40e3-99dd-a567e4498ed7',
          'd': '2016-04-12T02:49:05.761',
          't': 2,
          'p': 'http',
          'g': ['12.34.56.78:1234', 'http://127.0.0.1:80']
        },
        'r': {
          'v': '1.1',
          'm': 'POST',
          'u': 'http://example.com/v1.0.0/users',
          'q': {
            'name': ['James'],/**/
            'age': ['32']
          },
          'h': {
            'Accept': 'application/json'
          },
          'b': ''
        },
        'R': {
          'v': '1.1',
          's': '200 OK',
          'h': {
            'Content-Type': 'application/json'
          },
          'b': '{"result":"OK","message":"Created new user"}'
        },
        'T': {
          'm': {
            'v': '1.0.0',
            'i': 'f1b27da9-240b-40e3-99dd-a567e4498ed7',
            'd': '2016-04-12T02:49:05.761',
            'g': ['12.34.56.78:1234', 'http://127.0.0.1:80'],
            'o': ['users', '1.0.0', 'list'],
            'l': 1,
            'f': [['users', '1.0.0', ['create', 'update']]],
            'p': {
              'foo': 'bar'
            }
          }
        }
      };

      middleware.run();
      middleware._processCommand('response', response);
      middleware._closeSocket();
    });

  });

});
