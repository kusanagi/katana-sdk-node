'use strict';

const chai = require('chai');
const Service = require('./service');
const Action = require('./action');
const Transport = require('./transport');

const expect = chai.expect;

describe('Service', function () {
  const argv = process.argv;
  const mockArgv = [
    '--name', 'example',
    '--version', '0.0.0',
    '--component', 'service',
    '--framework-version', '0.0.0',
    '-d'
  ];

  beforeEach(() => {
    process.argv = mockArgv;
  });

  afterEach(() => {
    process.argv = argv;
  });

  it('should create an instance', () => {
    const service = new Service();
    expect(service).to.be.an.instanceof(Service);
  });

  it('should fail when trying to run unknown actions', () => {
    const service = new Service();
    const transport = new Transport();

    const action = new Action(
      this, argv[0], 'example', '0.0.0', '0.0.0', {}, true, 'read', {}, transport
    );

    try {
      service.runAction(action);
    } catch (e) {
      expect(e.message).to.equal("Unknown action 'read'");
      return;
    }

    throw new Error('Calling an unknown action did not trigger an error');
  });

  it('should run defined actions', (done) => {
    const service = new Service();
    const transport = new Transport();

    const mockMapping = {
      'users': {
        '1.0': {
          'f': true,
          'a': '127.0.0.1:3334',
          'ac': {
            'read': {
              'h': {'p': '/1.0/users/{id}', 'i': 'query', 'g': true},
              'p': {
                'id': {
                  't': 'integer',
                  'h': {'p': 'id', 'i': 'path', 'g': true},
                  'n': 'id',
                  'r': true
                }
              },
              'k': 'id',
              'D': false,
              'c': false,
              'f': [],
              'x': 1,
              'E': {
                'f': [{'t': 'integer', 'n': 'id'}, {'t': 'string', 'n': 'name'}, {
                  't': 'string',
                  'n': 'color'
                }, {'t': 'string', 'n': 'nick'}, {'t': 'string', 'n': 'weapon'}], 'V': true
              }
            },
            'list': {
              'h': {'p': '/1.0/users', 'i': 'query', 'g': true},
              'p': {
                'users': {
                  't': 'string',
                  'h': {'p': 'users', 'i': 'query', 'g': true},
                  'n': 'users',
                  'r': false
                }
              },
              'k': 'id',
              'D': false,
              'c': true,
              'f': [],
              'x': 1,
              'E': {
                'f': [{'t': 'integer', 'n': 'id'}, {'t': 'string', 'n': 'name'}, {
                  't': 'string',
                  'n': 'color'
                }, {'t': 'string', 'n': 'nick'}, {'t': 'string', 'n': 'weapon'}], 'V': true
              }
            }
          },
          'h': {'b': '/1.0', 'g': true}
        }
      }
    };

    service._saveNewMapping(mockMapping);

    service.action('read', (action) => {
      action.setEntity({foo: 'bar'});

      expect(action).to.be.an.instanceof(Action);
      done();

      return action;
    });

    const action = new Action(
      service, argv[0], 'users', '1.0', '1.0.0', {}, true, 'read', {}, transport, null
    );

    service.run();
    service.runAction(action);
    service._closeSocket();
  });
});
