'use strict';

const assert = require('assert');
const _ = require('lodash');
const Transport = require('./transport');
const File = require('./file');
const expect = require('chai').expect;

const m = require('./mappings');

describe('Transport', () => {
  const mockTransport = {
    [m.meta]: {
      [m.version]: '1.0.0',
      [m.level]: 0,
      [m.gateway]: ['', '']
    }
  };

  it('should create an instance', () => {
    const transport = new Transport(mockTransport);
    assert.ok(transport instanceof Transport);
  });

  describe('getRequestId()', () => {
    it('should return the UUID of the request', () => {
      const _id = '110ec58a-a0f2-4ac4-8393-c866d813b8d1';
      const _mockTransport = _.merge({}, mockTransport, {[m.meta]: {[m.id]: _id}});
      const transport = new Transport(_mockTransport);
      assert.equal(transport.getRequestId(), _id);
    });
  });

  describe('getRequestTimestamp()', () => {
    it('should return the creation datetime of the request', () => {
      const _datetime = '2016-10-03T12:57:18.363Z';
      const _mockTransport = _.merge({}, mockTransport, {[m.meta]: {[m.datetime]: _datetime}});
      const transport = new Transport(_mockTransport);
      assert.equal(transport.getRequestTimestamp(), _datetime);
    });
  });

  describe('getOriginService()', () => {
    it('should return the origin of the request', () => {
      const _origin = ['test', '1.2.0'];
      const _mockTransport = _.merge({}, mockTransport, {[m.meta]: {[m.origin]: _origin}});
      const transport = new Transport(_mockTransport);
      const [name, version] = _origin;
      const [originName, originVersion] = transport.getOriginService();
      assert.equal(name, originName);
      assert.equal(version, originVersion);
    });
  });

  describe('getProperty()', () => {
    it('should return the value of a property by `name`', () => {
      const properties = {test: true};
      const _mockTransport = _.merge({meta: {properties}}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.equal(transport.getProperty('test'), true);
    });

    it('should return the `defaultValue` when no property found with `name`', () => {
      const transport = new Transport(mockTransport);
      assert.equal(transport.getProperty('test', 'default'), 'default');
    });

    it('should throw an error if property `name` is not specified', () => {
      const transport = new Transport(mockTransport);
      assert.throws(() => transport.getProperty(void 0, 'default'), /Specify a property `name`/);
    });
  });

  describe('hasDownload()', () => {
    it('should determine if a file download has been registered for the response', () => {
      const _mockTransport = _.merge({[m.body]: ''}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.equal(transport.hasDownload(), true);
    });
  });

  describe('getDownload()', () => {
    it('should return the file registered for the response as a File instance', () => {
      const _body = {[m.path]: '', [m.token]: '', [m.filename]: '', [m.size]: '', [m.mime]: ''};
      const _mockTransport = _.merge({[m.body]: _body}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.ok(transport.getDownload() instanceof File);
    });

    it('should return null if no file registered', () => {
      const transport = new Transport(mockTransport);
      assert.equal(transport.getDownload(), null);
    });
  });

  describe('getData()', () => {
    it('should return all the data stored in the transport', () => {
      const d = {
        'address': {
          users: {
            '1.0.0': {
              'get': [
                {foo: 'bar'},
                [
                    {foo: 'bar'},
                    {foo: 'biz'}
                ]
              ]
            }
          }
        }
      };
      const expectedResult = [
          {
              ['_address']: 'address',
              ['_name']: 'users',
              ['_version']: '1.0.0',
              ['_actions']: [
                {
                  ['_name']: 'get',
                  ['_collection']: false,
                  ['_data']: {foo: 'bar'}
                },
                {
                  ['_name']: 'get',
                  ['_collection']: true,
                  ['_data']: [
                      {foo: 'bar'},
                      {foo: 'biz'}
                  ]
                }
              ],
          }
      ];

      const _mockTransport = _.merge({[m.data]: d}, mockTransport);
      const transport = new Transport(_mockTransport);
      expect(transport.getData()).to.eql(expectedResult);
    });

    it('should return empty array if no data', () => {
      const transport = new Transport(mockTransport);
      assert.deepEqual(transport.getData(), []);
    });
  });

  describe('getRelations()', () => {
    it('should return all relations', () => {
        const relations = {
            addressFrom: {
                serviceFrom: {
                    primaryKey: {
                        addressTo: {
                          serviceToSingle: 'singleKey',
                          serviceToMulti: ['key1', 'key2']
                        }
                    }
                }
            }
        };

        const expectedResult = [
            {
                ['_address']: 'addressFrom',
                ['_name']: 'serviceFrom',
                ['_primaryKey']: 'primaryKey',
                ['_foreignRelations']: [
                    {
                        ['_address']: 'addressTo',
                        ['_name']: 'serviceToSingle',
                        ['_type']: 'one',
                        ['_foreignKeys']: ['singleKey'],
                    },
                    {
                        ['_address']: 'addressTo',
                        ['_name']: 'serviceToMulti',
                        ['_type']: 'many',
                        ['_foreignKeys']: ['key1', 'key2'],
                    }
                ],
            }
        ];

        const _mockTransport = _.merge({relations}, mockTransport);
        const transport = new Transport(_mockTransport);
        expect(transport.getRelations()).to.eql(expectedResult);
    });
  });

  describe('getLinks()', () => {
    it('should return all links', () => {
      const links = {
        address: {
            name: {
                link1: 'http://example.com/1',
                link2: 'http://example.com/2'
            }
        }
      };
      const expectedResult = [
          {
                ['_address']: 'address',
                ['_name']: 'name',
                ['_link']: 'link1',
                ['_uri']: 'http://example.com/1',
          },
          {
                ['_address']: 'address',
                ['_name']: 'name',
                ['_link']: 'link2',
                ['_uri']: 'http://example.com/2',
          }
      ];

      const _mockTransport = _.merge({links}, mockTransport);
      const transport = new Transport(_mockTransport);
      expect(transport.getLinks()).to.eql(expectedResult);
    });
  });

  describe('getCalls()', () => {
    it('should return all calls', () => {

        const calls = {
            users: {
                '1.0.0': [
                    {
                        'D': 1120,
                        'x': 1500,
                        'g': 'address',
                        'n': 'posts',
                        'v': '1.2.0',
                        'a': 'list',
                        'C': 'read',
                        'p': [
                            {
                                'n': 'token',
                                'v': 'abcd',
                                't': 'string'
                            },
                            {
                                'n': 'user_id',
                                'v': 123,
                                't': 'integer'
                            }
                        ]
                    },
                    {
                        'n': 'comments',
                        'v': '1.2.3',
                        'a': 'find',
                        'C': 'read'
                    },
                ]
            }
        };

        const expectedResult = [
            {
                ['_name']: 'users',
                ['_version']: '1.0.0',
                ['_action']: 'read',
                ['_callee']: {
                    ['_duration']: 1120,
                    ['_timeout']: 1500,
                    ['_name']: 'posts',
                    ['_address']: 'address',
                    ['_version']: '1.2.0',
                    ['_action']: 'list',
                    ['_params']: [
                        {
                            ['_name']: 'token',
                            ['_value']: 'abcd',
                            ['_type']: 'string',
                            ['_exists']: true,
                        },
                        {
                            ['_name']: 'user_id',
                            ['_value']: 123,
                            ['_type']: 'integer',
                            ['_exists']: true,
                        },
                    ]
                },
            },
            {
                ['_name']: 'users',
                ['_version']: '1.0.0',
                ['_action']: 'read',
                ['_callee']: {
                    ['_duration']: undefined,
                    ['_timeout']: undefined,
                    ['_address']: undefined,
                    ['_name']: 'comments',
                    ['_version']: '1.2.3',
                    ['_action']: 'find',
                    ['_params']: [],
                },
            }
        ];

        const _mockTransport = _.merge({calls}, mockTransport);
        const transport = new Transport(_mockTransport);
        expect(transport.getCalls()).to.eql(expectedResult);
    });
  });

  describe('getTransactions()', () => {
    it('should return all transactions', () => {
      const transactions = {};
      const _mockTransport = _.merge({transactions}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getTransactions(), transactions);
    });

    it('should return transactions specified by `service`', () => {
      const transactions = {users: {}};
      const _mockTransport = _.merge({transactions}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getTransactions('users'), transactions.users);
    });
  });

  describe('getErrors()', () => {
    it('should return all errors', () => {
      const errors = {};
      const _mockTransport = _.merge({errors}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getErrors(), errors);
    });

    it('should return errors specified by `service`', () => {
      const errors = {users: {}};
      const _mockTransport = _.merge({errors}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getErrors('users'), errors.users);
    });
  });
});
