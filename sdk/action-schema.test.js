'use strict';

const ActionSchema = require('./action-schema');
const HttpActionSchema = require('./http-action-schema');
const expect = require('chai').expect;

describe('ActionSchema', () => {

  it('should create an instance', () => {
    const actionSchema = new ActionSchema();
    expect(actionSchema).to.be.an.instanceOf(ActionSchema);
  });


  xdescribe('isDeprecated()', () => {

    it('determines if the action has been deprecated', () => {

    });

  });

  xdescribe('isCollection()', () => {

    it('determines if the action returns a collection of entities.', () => {

    });

  });

  xdescribe('getName()', () => {

    it('return the unique name of the action', () => {

    });

  });

  xdescribe('getEntityPath()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('getPathDelimiter()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('get_primary_key()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('resolve_entity()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_entity()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('getEntity()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_relations()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('get_relations()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_call()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_calls()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('get_calls()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_defer_call()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_defer_calls()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('get_defer_calls()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_remote_call()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('has_remote_calls()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('get_remote_calls()', () => {

    it('return the path to the entity', () => {

    });

  });

  xdescribe('hasReturn()', () => {

    it('determines if a return value is defined for the action', () => {

    });

  });

  xdescribe('getReturnType()', () => {

    it('returns the data type of the returned value', () => {

    });

  });

  xdescribe('getParams()', () => {

    it('returns an array with the parameters defined for the action', () => {

    });

  });

  xdescribe('hasParam()', () => {

    it('determines if a parameter schema exists', () => {

    });

  });

  xdescribe('getParamSchema()', () => {

    it('returns an instance of the ParamSchema class for the parameter', () => {

    });

  });

  xdescribe('getFiles()', () => {

    it('returns an array with the files defined for the action', () => {

    });

  });

  xdescribe('hasFile()', () => {

    it('determines if a file parameter schema exists ', () => {

    });

  });

  xdescribe('getFileSchema()', () => {

    it('returns an instance of the FileSchema class for the file parameter', () => {

    });

  });

  describe('getHttpSchema()', () => {

    it('return an instance of the HttpActionSchema', () => {
      const mockActionMapping = {
        'D': false,
        'c': true,
        'f': {},
        'E': {
          'V': true,
          'f': [
            {
              'n': 'id',
              't': 'integer'
            },
            {
              'n': 'name',
              't': 'string'
            },
            {
              'n': 'color',
              't': 'string'
            },
            {
              'n': 'nick',
              't': 'string'
            },
            {
              'n': 'weapon',
              't': 'string'
            }
          ]
        },
        'k': 'id',
        'x': 1,
        'h': {
          'g': true,
          'i': 'query',
          'p': '/1.0/users'
        },
        'p': {
          'users': {
            'r': false,
            'n': 'users',
            't': 'string',
            'h': {
              'g': true,
              'i': 'query',
              'p': 'users'
            }
          }
        }
      };

      const actionSchema = ActionSchema.fromMapping('list', mockActionMapping);
      expect(actionSchema.getHttpSchema()).to.be.an.instanceOf(HttpActionSchema);
    });

  });

});
