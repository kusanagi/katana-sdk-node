'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const Api = require('./api');
const Component = require('./component');
const ServiceSchema = require('./service-schema');

describe('Api', () => {
  it('should create an instance', () => {
    const api = new Api('./test', 'name', '0.1', '1.0', {});
    assert.ok(api instanceof Api);
  });

  describe('isDebug()', () => {
    it('should expose an isDebug method', () => {
      const api = new Api(null, './test', 'name', '0.1', '1.0', {});
      assert.ok(typeof api.isDebug === 'function');
    });

    it('should return if in debug mode', () => {
      const debug = true;
      const api = new Api(null, null, null, null, null, null, debug);
      assert.equal(api.isDebug(), debug);
      assert.equal(api._debug, debug);
    });
  });

  describe('getFrameworkVersion()', () => {
    it('should expose a getFrameworkVersion method', () => {
      const api = new Api(null, './test', 'name', '0.1', '1.0', {});
      assert.ok(typeof api.getFrameworkVersion === 'function');
    });

    it('should return the framework version', () => {
      const frameworkVersion = '1.0';
      const api = new Api(null, null, null, null, frameworkVersion);
      assert.equal(api.getFrameworkVersion(), frameworkVersion);
      assert.equal(api._frameworkVersion, frameworkVersion);
    });
  });

  describe('getPath()', () => {
    it('should expose a getPath method', () => {
      const api = new Api(null, './test', 'name', '0.1', '1.0', {});
      assert.ok(typeof api.getPath === 'function');
    });

    it('should return the path of the file', () => {
      const path = './test';
      const api = new Api(null, path);
      assert.equal(api.getPath(), path);
      assert.equal(api._path, path);
    });
  });

  describe('getName()', () => {
    it('should expose a getName method', () => {
      const api = new Api(null, null, null, null, {});
      assert.ok(typeof api.getName === 'function');
    });

    it('should return the name of the component', () => {
      const name = 'name';
      const api = new Api(null, null, name);
      assert.equal(api.getName(), name);
      assert.equal(api._name, name);
    });
  });

  describe('getVersion()', () => {
    it('should expose a getVersion method', () => {
      const api = new Api(null, null, null, null, {});
      assert.ok(typeof api.getVersion === 'function');
    });

    it('should return the version of the component', () => {
      const version = '0.1';
      const api = new Api(null, null, null, version);
      assert.equal(api.getVersion(), version);
      assert.equal(api._version, version);
    });
  });

  describe('getVariables()', () => {
    it('should expose a getVariables method', () => {
      const api = new Api(null, null, null, null, {});
      assert.ok(typeof api.getVariables === 'function');
    });

    it('should return the variables', () => {
      const variables = {var: 'test'};
      const api = new Api(null, null, null, null, null, variables);
      assert.deepEqual(api.getVariables(), variables);
      assert.deepEqual(api._variables, variables);
    });
  });

  describe('getVariable()', () => {
    it('should expose a getVariable method', () => {
      const api = new Api(null, null, null, null, {});
      assert.ok(typeof api.getVariable === 'function');
    });

    it('should return a variable value', () => {
      const variables = {var: 'test'};
      const api = new Api(null, null, null, null, null, variables);
      assert.equal(api.getVariable('var'), variables.var);
    });

    it('should return null if a variable does not exist', () => {
      const variables = {var: 'test'};
      const api = new Api(null, null, null, null, variables);
      assert.equal(api.getVariable('unknown'), null);
    });
  });



  describe('hasResource()', () => {

    it('determine if a resource has been stored', () => {
      const component = new Component();
      const api = new Api(component);
      const fn        = function () { return true; };

      expect(api.hasResource('res')).to.equal(false);
      component.setResource('res', fn);
      expect(api.hasResource('res')).to.equal(true);
    });
  });


  describe('getResource', () => {

    it('returns a saved resource', () => {
      const component = new Component();
      const api = new Api(component);

      component.setResource('config', function () {
        return {config: {run: true}};
      });

      expect(api.getResource('config')).to.deep.equal({config: {run: true}});
    });

    it('fails when getting an inexistent resource', () => {
      const component = new Component();
      const api = new Api(component);

      function call() {
        api.getResource('config');
      }

      expect(call).to.throw(/Unknown resource 'config'/);
    });

  });


  describe('getServices', () => {

    const mockMapping = {
      'users': {
        '1.0': {
          'ac': {
            'list': {
              'D': false,
              'c': true,
              'f': {},
              'E': {
                'V': true,
                'f': [{'n': 'id', 't': 'integer'}, {'n': 'name', 't': 'string'}, {
                  'n': 'color',
                  't': 'string'
                }, {'n': 'nick', 't': 'string'}, {'n': 'weapon', 't': 'string'}]
              },
              'k': 'id',
              'x': 1,
              'h': {'g': true, 'i': 'query', 'p': '/1.0/users'},
              'p': {
                'users': {
                  'r': false,
                  'n': 'users',
                  't': 'string',
                  'h': {'g': true, 'i': 'query', 'p': 'users'}
                }
              }
            },
            'read': {
              'D': false,
              'c': false,
              'f': {},
              'E': {
                'V': true,
                'f': [{'n': 'id', 't': 'integer'}, {'n': 'name', 't': 'string'}, {
                  'n': 'color',
                  't': 'string'
                }, {'n': 'nick', 't': 'string'}, {'n': 'weapon', 't': 'string'}]
              },
              'k': 'id',
              'x': 1,
              'h': {'g': true, 'i': 'query', 'p': '/1.0/users/{id}'},
              'p': {
                'id': {
                  'r': true,
                  'n': 'id',
                  't': 'integer',
                  'h': {'g': true, 'i': 'path', 'p': 'id'}
                }
              }
            }
          }, 'a': '127.0.0.1:3334', 'f': true, 'h': {'g': true, 'b': '/1.0'}
        }
      }
    };

    it('returns a list of services stored schema mapping', () => {
      const component = new Component();
      const api = new Api(component);

      component._saveNewMapping(mockMapping);
      expect(api.getServices().length).to.equal(1);
      expect(api.getServices()[0].name).to.equal('users');
      expect(api.getServices()[0].version).to.equal('1.0');
    });

  });

  describe('getServiceSchema', () => {

    const mockMapping = {
      'users': {
        '1.0.0': {
          'ac': {
            'list': {
              'D': false,
              'c': true,
              'f': {},
              'E': {
                'V': true,
                'f': [{'n': 'id', 't': 'integer'}, {'n': 'name', 't': 'string'}, {
                  'n': 'color',
                  't': 'string'
                }, {'n': 'nick', 't': 'string'}, {'n': 'weapon', 't': 'string'}]
              },
              'k': 'id',
              'x': 1,
              'h': {'g': true, 'i': 'query', 'p': '/1.0/users'},
              'p': {
                'users': {
                  'r': false,
                  'n': 'users',
                  't': 'string',
                  'h': {'g': true, 'i': 'query', 'p': 'users'}
                }
              }
            },
            'read': {
              'D': false,
              'c': false,
              'f': {},
              'E': {
                'V': true,
                'f': [{'n': 'id', 't': 'integer'}, {'n': 'name', 't': 'string'}, {
                  'n': 'color',
                  't': 'string'
                }, {'n': 'nick', 't': 'string'}, {'n': 'weapon', 't': 'string'}]
              },
              'k': 'id',
              'x': 1,
              'h': {'g': true, 'i': 'query', 'p': '/1.0/users/{id}'},
              'p': {
                'id': {
                  'r': true,
                  'n': 'id',
                  't': 'integer',
                  'h': {'g': true, 'i': 'path', 'p': 'id'}
                }
              }
            }
          }, 'a': '127.0.0.1:3334', 'f': true, 'h': {'g': true, 'b': '/1.0'}
        }
      }
    };

    it('returns an instance of ServiceSchema', () => {
      const component = new Component();
      const api = new Api(component);

      component._saveNewMapping(mockMapping);
      expect(api.getServiceSchema('users', '1.0.*')).to.be.an.instanceOf(ServiceSchema);
    });

    it('returns an instance of ServiceSchema', () => {
      const component = new Component();
      const api = new Api(component);

      component._saveNewMapping(mockMapping);
      expect(api.getServiceSchema('users', '1.0.*').getName()).to.equal('users');
      expect(api.getServiceSchema('users', '1.0.*').getVersion()).to.equal('1.0.0');
    });

  });

  xdescribe('log()', () => {
    it('logs if in debug mode', () => {

    });
    it('does not log if in not debug mode', () => {

    });
    it('truncates the message if goes over the character limit', () => {

    });
    it('logs NULL values', () => {

    });
    it('logs boolean values', () => {

    });
    it('logs array values', () => {

    });
    it('logs object values', () => {

    });
    it('logs function values', () => {

    });
  });

});
