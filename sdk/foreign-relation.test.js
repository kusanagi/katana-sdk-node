'use strict';

const expect = require('chai').expect;
const ForeignRelation  = require('./foreign-relation');

describe('ForeignRelation', () => {
  it('should create an instance', () => {
    const foreignRelation = new ForeignRelation(null, null, 'one', null);
    expect(foreignRelation).to.be.an.instanceOf(ForeignRelation);
  });

  const badConstructor = () => new ForeignRelation(null, null, 'foo', null);
  it('should throw error with invalid types', () => {
    expect(badConstructor).to.throw(TypeError);
  });

  describe('getAddress()', () => {
    it('should return the address of the service', () => {
      const foreignRelation = new ForeignRelation('test', null, 'one', null);
      expect(foreignRelation.getAddress()).to.equal('test');
    });
  });

  describe('getName()', () => {
    it('should return the name of the service', () => {
      const foreignRelation = new ForeignRelation(null, 'test', 'one', null);
      expect(foreignRelation.getName()).to.equal('test');
    });
  });

  describe('getType()', () => {
    it('should return the type of the relation', () => {
      const foreignRelation = new ForeignRelation(null, null, 'one', null);
      expect(foreignRelation.getType()).to.equal('one');
    });
  });

  describe('getForeignKeys()', () => {
    it('should return the foreign keys of the relation', () => {
      const foreignRelation = new ForeignRelation(null, null, 'one', []);
      expect(foreignRelation.getForeignKeys()).to.eql([]);
    });
  });
});
