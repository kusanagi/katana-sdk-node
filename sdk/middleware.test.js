/*
 * NODE SDK for the KATANA(tm) Framework (http://katana.kusanagi.io)
 * Copyright (c) 2016-2018 KUSANAGI S.L. All rights reserved.
 *
 * Distributed under the MIT license
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code
 *
 * @link      https://github.com/kusanagi/katana-sdk-node
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @copyright Copyright (c) 2016-2018 KUSANAGI S.L. (http://kusanagi.io)
 */

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
        'm': {'s': 'gateway'},
        'c': {
          'n': 'rest',
          'a': {
            'm': {
              'v': '1.1.8',
              'i': 'f678ed17-896f-4431-8e60-d25c61d195ea',
              'd': '2017-07-21T10:50:17.710670+00:00',
              't': 2,
              'p': 'urn:katana:protocol:http',
              'g': ['127.0.0.1:4444', 'http://10.0.2.15:9999'],
              'c': '10.0.2.2:64708'
            },
            'R': {
              'b': '{"errors":[{"detail":"User not found","code":"1","status":"404 Not Found"}]}',
              'v': '1.1',
              's': '404 Not Found',
              'h': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/vnd.api+json'
              }
            },
            'r': {
              'b': '',
              'm': 'GET',
              'v': '1.1',
              'h': {
                'HOST': ['localhost:9999'],
                'ACCEPT': ['*/*'],
                'USER-AGENT': ['curl/7.51.0']
              },
              'u': 'http://localhost:9999/1.0/users/5'
            },
            'T': {
              'e': {
                'http://10.0.2.15:9999': {
                  'users': {
                    '1.0': [{
                      's': '404 Not Found',
                      'm': 'User not found',
                      'c': 404
                    }]
                  }
                }
              },
              't': {},
              'm': {
                'e': '2017-07-21T10:50:17.762899+00:00',
                's': '2017-07-21T10:50:17.748366+00:00',
                'd': '2017-07-21T10:50:17.709640+00:00',
                'g': ['127.0.0.1:4444', 'http://10.0.2.15:9999'],
                'v': '1.1.8',
                'i': 'f678ed17-896f-4431-8e60-d25c61d195ea',
                'D': 15,
                'o': ['users', '1.0', 'read'],
                'l': 1
              }
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
