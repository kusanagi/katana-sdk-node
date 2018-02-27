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
      const d = {'': {users: {'1.0.0': {'get': [{foo: 'bar'}]}}}};
      const _mockTransport = _.merge({[m.data]: d}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getData(), d);
    });

    it('should return data specified by `service`', () => {
      const d = {'': {users: {'1.0.0': {'get': {}}}}};
      const _mockTransport = _.merge({[m.data]: d}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getData('users'), d[''].users);
    });

    it('should return data specified by `service` and `version`', () => {
      const d = {'': {users: {'1.0.0': {'get': {}}}}};
      const _mockTransport = _.merge({[m.data]: d}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getData('users', '1.0.0'), d[''].users['1.0.0']);
    });

    it('should return data specified by `service` and `version` and `action`', () => {
      const d = {'': {users: {'1.0.0': {'get': {}}}}};
      const _mockTransport = _.merge({[m.data]: d}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getData('users', '1.0.0', 'get'), d[''].users['1.0.0'].get);
    });

    it('should return empty array if no data', () => {
      const d = {'': ''};
      const _mockTransport = _.merge({[m.data]: d}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getData('users', '1.0.0', 'get'), []);
    });
  });

  describe('getRelations()', () => {
    it('should return all relations', () => {
      const relations = {};
      const _mockTransport = _.merge({relations}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getRelations(), relations);
    });

    it('should return relations specified by `service`', () => {
      const relations = {users: {}};
      const _mockTransport = _.merge({relations}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getRelations('users'), relations.users);
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
      console.log(transport);
      expect(transport.getLinks()).to.eql(expectedResult);
    });
  });

  describe('getCalls()', () => {
    it('should return all calls', () => {
      const calls = {};
      const _mockTransport = _.merge({calls}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getCalls(), calls);
    });

    it('should return calls specified by `service`', () => {
      const calls = {users: {}};
      const _mockTransport = _.merge({calls}, mockTransport);
      const transport = new Transport(_mockTransport);
      assert.deepEqual(transport.getCalls('users'), calls.users);
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
