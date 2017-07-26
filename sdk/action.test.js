'use strict';

const assert = require('assert');
const Action = require('./action');
const Transport = require('./transport');
const Param = require('./param');
const File = require('./file');
const expect = require('chai').expect;

const m = require('./mappings');

describe('Action', () => {
  it('should create an instance', () => {
    const action = new Action(null, null, null, null, {}, false, '', {params: {}}, {});
    assert.ok(action instanceof Action);
  });

  describe('isOrigin()', () => {
    it('should determine whether or not the current Service is the initial Service called', () => {
      const mockTransport = {
        [m.meta]: {
          [m.origin]: ['users', '1.0']
        }
      };
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'users', '1.0', null, {}, false, 'get', {}, transport);
      assert.ok(action.isOrigin());
    });

    it('should return false if the current Service is not the initial Service called ', () => {
      const mockTransport = {[m.meta]: {[m.origin]: ['users', '1.0']}};
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'peers', '1.0', null, {}, false, 'get', {}, transport);
      assert.strictEqual(action.isOrigin(), false);
    });
  });

  describe('getActionName()', () => {
    it('should return the action name', () => {
      const action = new Action(null, null, 'users', null, null, null, false, 'get');
      expect(action.getActionName()).to.equal('get');
    });
  });

  describe('setProperty()', () => {
    it('should set a custom property', () => {
      const mockTransport = {[m.meta]: {[m.origin]: ['users', '1.0']}};
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', {}, transport);
      assert.ok(action.setProperty('custom', 'value'));
      assert.equal(transport.getProperty('custom'), 'value');
    });

    it('should throw an error if property `name` not specified', () => {
      const mockTransport = {[m.meta]: {[m.origin]: ['users', '1.0']}};
      const transport = new Transport(mockTransport);
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, transport);
      assert.throws(() => action.setProperty(null, 'value'), /Specify a property `name`/);
    });

    it('should throw an error if property `name` is not a string', () => {
      const mockTransport = {[m.meta]: {[m.origin]: ['users', '1.0']}};
      const transport = new Transport(mockTransport);
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, transport);
      assert.throws(() => action.setProperty({}, 'value'), /The property `name` must be a string/);
    });
  });

  describe('hasParam()', () => {
    it('should determine if a parameter was provided for the action', () => {
      const mockParams = {
          name: {
            [m.value]: 'James',
            [m.type]: 'string'
        }
      };
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', mockParams, {});
      expect(action.hasParam('name')).to.equal(true);
    });

    it('should return false if the parameter was not provided', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      expect(action.hasParam('name')).to.equal(false);
    });

    it('should throw an error if the param `name` is not specified', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      expect(() => action.hasParam(null)).to.throw(/Specify a param `name`/);
    });

    it('should throw an error if the specified param `name` is not a string', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      expect(() => action.hasParam(true)).to.throw(/The param `name` must be a string/);
    });
  });

  describe('getParam()', () => {
    it('should get a parameter with the specified name', () => {
      const mockParams = {
          name: {
            [m.value]: 'James',
            [m.type]: 'string'
          }
      };
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', mockParams, {});
      const param = action.getParam('name');
      expect(param).to.be.an.instanceOf(Param);
      expect(param.getValue()).to.equal('James');
    });

    it('should throw an error if the param `name` is not specified', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      expect(() => action.getParam(null)).to.throw(/Specify a param `name`/);
    });

    it('should throw an error if the specified param `name` is not a string', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      expect(() => action.getParam(true)).to.throw(/The param `name` must be a string/);
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
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', mockParams, {});
      // Value comparison
      expect(action.getParams()).to.eql([expectedResult.name]);
    });
  });


  describe('newParam()', () => {
    it('should create a new parameter with the specified name', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      const param = action.newParam('name');
      assert.ok(param instanceof Param);
      assert.equal(param.getName(), 'name');
    });

    it('should throw an error if the param `name` is not specified', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newParam(null), /Specify a param `name`/);
    });

    it('should throw an error if the specified param `name` is not a string', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newParam(true), /The param `name` must be a string/);
    });

    it('should create a new parameter with the specified name, value and type', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      const param = action.newParam('name', 'James', 'string');
      expect(param).to.be.an.instanceOf(Param);
      expect(param.getName()).to.equal('name');
      expect(param.getValue()).to.equal('James');
      expect(param.getType()).to.equal('string');
    });
  });

  describe('hasFile()', () => {
    it('should determine if a file was provided for the action', () => {
      const mockTransport = {
        [m.meta]: {
          [m.gateway]: [
            'http://127.0.0.1:9000', // internal
            'http://192.0.0.3:80', // public
          ]
        },
        [m.files]: {
          'http://192.0.0.3:80': {
            pics: {
              '1.0': {
                get: {
                  avatar: {
                    [m.path]: 'http://foo/avatar.jpg',
                    [m.token]: '123',
                    [m.filename]: 'avatar.jpg',
                    [m.size]: 100,
                    [m.mime]: 'image/jpeg'
                  }
                }
              }
            }
          }
        }
      };
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'pics', '1.0', null, {}, false, 'get', null, transport);
      expect(action.hasFile('avatar')).to.equal(true);
    });

    it('should return false if the file was not provided for the action', () => {
      const transport = new Transport();
      const action = new Action(null, null, 'users', '1.0', null, {}, false, 'get', {}, transport);
      assert.equal(action.hasFile('avatar'), false);
    });

    it('should throw an error if the file `name` is not specified', () => {
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.hasFile(null), /Specify a file `name`/);
    });

    it('should throw an error if the specified file `name` is not a string', () => {
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.hasFile(true), /The file `name` must be a string/);
    });
  });

  describe('getFile()', () => {
    it('should get a file by name', () => {
      const mockTransport = {
        [m.meta]: {
          [m.gateway]: ['http://127.0.0.1:9000', 'http://192.0.0.1:80']
        },
        [m.files]: {
          'http://192.0.0.1:80': {
            pics: {
              '1.0': {
                get: {
                  avatar: {
                    [m.path]: 'http://foo/avatar.jpg',
                    [m.token]: '123',
                    [m.filename]: 'avatar.jpg',
                    [m.size]: 100,
                    [m.mime]: 'image/jpeg'
                  }
                }
              }
            }
          }
        }
      };
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'pics', '1.0', null, {}, false, 'get', {}, transport);
      const file = action.getFile('avatar');
      assert.ok(file instanceof File);
      assert.equal(file.getFileName(), 'avatar.jpg');
    });

    it('should return an empty File if not provided for the action', () => {
      const transport = new Transport();
      const action = new Action(null, null, null, null, null, {}, false, '', {}, transport);
      const file = action.getFile('avatar');
      assert.ok(file instanceof File);
      assert.equal(file.getName(), 'avatar');
    });

    it('should throw an error if the file `name` is not specified', () => {
      const action = new Action(null, null, null, null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.getFile(null), /Specify a file `name`/);
    });

    it('should throw an error if the specified file `name` is not a string', () => {
      const action = new Action(null, null, null, null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.getFile(true), /The file `name` must be a string/);
    });
  });

  xdescribe('getFiles()', () => {
    it('returns an array of File objects', () => {
      const mockTransport = {
        [m.meta]: {
          [m.gateway]: ['http://127.0.0.1:9000', 'http://192.0.0.1:80']
        },
        [m.files]: {
          'http://192.0.0.1:80': {
            pics: {
              '1.0': {
                get: {
                  avatar: {
                    [m.path]: 'http://foo/avatar.jpg',
                    [m.token]: '123',
                    [m.filename]: 'avatar.jpg',
                    [m.size]: 100,
                    [m.mime]: 'image/jpeg'
                  }
                }
              }
            }
          }
        }
      };
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'pics', '1.0', null, {}, false, 'get', {}, transport);
      expect(action.getFiles().length).to.equal(1);
    });

    it('should return an empty array if not files are provided for the action', () => {

    });
  });

  describe('newFile()', () => {
    it('should create a new file', () => {
      const action = new Action(null, null, null, null, {}, false, '', {params: {}}, {});
      const file = action.newFile('test', `${__dirname}/action.test.js`);
      expect(file).to.be.an.instanceOf(File);
      expect(file.getName()).to.equal('test');
    });

    it('should throw an error if the file `name` is not specified', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newFile(null), /Specify a file `name`/);
    });

    it('should throw an error if the specified file `name` is not a string', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newFile(true), /The file `name` must be a string/);
    });

    it('should throw an error if the file `path` is not specified', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newFile('', null), /Specify a file `path`/);
    });

    it('should throw an error if the specified file `path` is not a string', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newFile('', true), /The file `path` must be a string/);
    });

    it('should throw an error if the `mime` type is not a string', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.newFile('', '', true), /The file `mime` type must be a string/);
    });
  });

  xdescribe('setDownload()', () => {
    it('registers a file to be downloaded', () => {

    });
  });

  xdescribe('setReturn()', () => {
    it('define the value type to be returned to a Service', () => {

    });
  });

  describe('setEntity()', () => {
    it('should register an entity object in the transport', () => {
      const mockTransport = {[m.meta]: {[m.origin]: ['users', '1.0'], [m.gateway]: ['', '']}};
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'dev', '1.0', null, {}, false, 'read', {}, transport);
      const entity =
        {
          'user': 'James',
          'id': 1
        };
      assert.ok(action.setEntity(entity));
      assert.deepEqual(transport.getData('dev', '1.0', 'read'), entity);
    });

    it('should throw an error if the `entity` is not specified', () => {
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(action.setEntity, /Specify an `entity`/);
    });

    it('should throw an error if the `entity` is not an object', () => {
      const action = new Action(null, null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() => action.setEntity([]), /The `entity` must be an object/);
    });
  });

  describe('setCollection()', () => {
    it('should register an array of entity objects in the transport', () => {
      const mockTransport = {[m.meta]: {[m.origin]: ['users', '1.0'], [m.gateway]: ['', '']}};
      const transport = new Transport(mockTransport);
      const action = new Action(null, null, 'dev', '1.0', null, {}, false, 'list', {}, transport);
      const collection = [
        {
          'user': 'James',
          'id': 1
        }
      ];
      assert.ok(action.setCollection(collection));
      assert.deepEqual(transport.getData('dev', '1.0', 'list'), collection);
    });

    it('should throw an error if the `collection` is not specified', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(action.setCollection, /Specify a `collection` of entities/);
    });

    it('should throw an error if the `collection` is not an object', () => {
      const action = new Action(null, 'users', '1.0', null, {}, false, '', {params: {}}, {});
      assert.throws(() =>
        action.setCollection({}), /The `collection` of entities must be an array/);
    });
  });

  xdescribe('relateOne()', () => {
    it('registers a "one-to-one" relation', () => {

    });
  });


  xdescribe('relateMany()', () => {
    it('registers a "one-to-many" relation ', () => {

    });
  });


  xdescribe('relateOneRemote()', () => {
    it('registers a "one-to-one" relation with a remote Service from another Realm', () => {

    });
  });


  xdescribe('relateManyRemote()', () => {
    it('registers a "one-to-many" relation with a remote Service from another Realm', () => {

    });
  });


  xdescribe('setLink()', () => {
    it('should register a "complete" transaction', () => {

    });
  });


  xdescribe('commit()', () => {
    it('should register a "commit" transaction call', () => {

    });
  });


  xdescribe('rollback()', () => {
    it('should register a "rollback" transaction call', () => {

    });
  });


  xdescribe('complete()', () => {
    it('should register a "complete" transaction call', () => {

    });
  });


  xdescribe('call()', () => {
    it('performs a run-time Service call within the same Realm ', () => {

    });
  });


  xdescribe('deferCall()', () => {
    it('registers a deferred Service call within the same Realm ', () => {

    });
  });


  xdescribe('remoteCall()', () => {
    it('registers a remote Service call to a service within another Realm', () => {

    });
  });



  xdescribe('error()', () => {
    it('registers an error', () => {

    });
  });


});
