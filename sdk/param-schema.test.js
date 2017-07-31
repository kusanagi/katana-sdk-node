'use strict';

const expect      = require('chai').expect;
const ParamSchema = require('./param-schema');

describe('Param', () => {
  it('should create an instance', () => {
    const paramSchema = new ParamSchema();
    expect(paramSchema).to.be.an.instanceOf(ParamSchema);
  });
  describe('getName()', () => {
    it('should return the name of the parameter created in the schema', () => {
      const paramSchema = new ParamSchema('test', null, null, null);
      expect(paramSchema.getName()).to.equal('test');
    });
  });
});
