'use strict';

const expect = require('chai').expect;
const Param  = require('./param');

describe('Param', () => {
  it('should create an instance', () => {
    const param = new Param(null, null, null, null);
    expect(param).to.be.an.instanceOf(Param);
  });

  describe('getName()', () => {
    it('should return the name of the parameter', () => {
      const param = new Param('test', null, null, null);
      expect(param.getName()).to.equal('test');
    });
  });

  describe('getValue()', () => {
    it('should return the value of the parameter', () => {
      const param = new Param('test', 'val');
      expect(param.getValue()).to.equal('val');
    });

    it('should return the casted value of the parameter', () => {
      const param = new Param('test', 'true', Param.types.BOOLEAN);
      expect(param.getValue()).to.equal(true);
    });
  });

  describe('getType()', () => {
    it('should return the type of the parameter', () => {
      const param = new Param('test');
      expect(param.getType()).to.equal(Param.types.STRING);
    });
  });

  describe('exists()', () => {
    it('a param does not exist by default', () => {
      const param = new Param('test');
      expect(param.exists()).to.equal(false);
    });
    it('a param exists when specified', () => {
      const param = new Param('test', null, null, true);
      expect(param.exists()).to.equal(true);
    });
  });

  describe('copyWithName()', () => {
    it('should create a new instance of Param with a new name', () => {
      const param     = new Param('param');
      const paramCopy = param.copyWithName('paramCopy');
      // Different instances
      expect(param).to.not.deep.equal(paramCopy);
      // Different names
      expect(param.getName()).to.not.equal(paramCopy.getName());
      // Original name intact
      expect(param.getName()).to.equal('param');
      // New param different name
      expect(paramCopy.getName()).to.equal('paramCopy');
    });

    it('should throw an error if `name` is not specified', () => {
      const param = new Param('param');
      expect(param.copyWithName).to.throw(/Specify a param `name`/);
    });

    it('should throw an error if `name` is not a string', () => {
      const param = new Param('param');
      expect(() => param.copyWithName({})).to.throw(/The param `name` must be a string/);
    });
  });

  describe('copyWithValue()', () => {
    it('should create a new instance of Param with a new value', () => {
      const param     = new Param('test', 'param');
      const paramCopy = param.copyWithValue('paramCopy');
      // Different instances
      expect(param).to.not.deep.equal(paramCopy);
      // Different values
      expect(param.getValue()).to.not.deep.equal(paramCopy.getValue());
      // Same original value
      expect(param.getValue()).to.equal('param');
      // New param different value
      expect(paramCopy.getValue()).to.equal('paramCopy');
    });

    it('should throw an error if `value` is not specified', () => {
      const param = new Param('param');
      expect(param.copyWithValue).to.throw(/Specify a param `value`/);
    });

    it('should throw an error if `value` is not a string', () => {
      const param = new Param('param');
      expect(() => param.copyWithValue({})).to.throw(/The param `value` must be a string/);
    });
  });

  describe('copyWithType()', () => {
    it('should create a new instance of Param with a new type', () => {
      const param     = new Param('test', 'param', Param.types.STRING);
      const paramCopy = param.copyWithType(Param.types.BOOLEAN);
      // Different params
      expect(param).to.not.equal(paramCopy);
      // Different types
      expect(param.getType()).to.not.equal(paramCopy.getType());
      // Original type intact
      expect(param.getType()).to.equal(Param.types.STRING);
      // New type changed
      expect(paramCopy.getType()).to.equal(Param.types.BOOLEAN);
    });

    it('should throw an error if `type` is not specified', () => {
      const param = new Param('param');
      expect(param.copyWithType).to.throw(/Specify a param `type`/);
    });

    it('should throw an error if `type` is not a string', () => {
      const param = new Param('param');
      expect(() => param.copyWithType({})).to.throw(/The param `type` must be a string/);
    });
  });
});
