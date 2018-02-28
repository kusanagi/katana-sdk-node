'use strict';

const expect = require('chai').expect;
const Relation  = require('./relation');

describe('Relation', () => {
  it('should create an instance', () => {
    const relation = new Relation(null, null, null, null);
    expect(relation).to.be.an.instanceOf(Relation);
  });

  describe('getAddress()', () => {
    it('should return the address of the service', () => {
      const relation = new Relation('test', null, null, null);
      expect(relation.getAddress()).to.equal('test');
    });
  });

  describe('getName()', () => {
    it('should return the name of the service', () => {
      const relation = new Relation(null, 'test', null, null);
      expect(relation.getName()).to.equal('test');
    });
  });

  describe('getPrimaryKey()', () => {
    it('should return the primary key', () => {
      const relation = new Relation(null, null, 'test', null);
      expect(relation.getPrimaryKey()).to.equal('test');
    });
  });

  describe('getForeignRelations()', () => {
    it('should return the foreign relations', () => {
      const relation = new Relation(null, null, null, []);
      expect(relation.getForeignRelations()).to.eql([]);
    });
  });
});
