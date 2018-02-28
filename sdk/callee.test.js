'use strict';

const expect = require('chai').expect;
const Callee  = require('./callee');

describe('Callee', () => {
  it('should create an instance', () => {
    const callee = new Callee(null, null, null, null, null, null, null);
    expect(callee).to.be.an.instanceOf(Callee);
  });

  describe('getTimeout()', () => {
    it('should return the timeout of the call', () => {
      const callee = new Callee(42, null, null, null, null, null, null);
      expect(callee.getTimeout()).to.equal(42);
    });
  });

  describe('getDuration()', () => {
    it('should return the duration of the call', () => {
      const callee = new Callee(null, 42, null, null, null, null, null);
      expect(callee.getDuration()).to.equal(42);
    });
  });

  describe('isRemote()', () => {
    it('should return true if there is address', () => {
      const callee = new Callee(null, null, 'test', null, null, null, null);
      expect(callee.isRemote()).to.equal(true);
    });
    it('should return true if there is no address', () => {
      const callee = new Callee(null, null, null, null, null, null, null);
      expect(callee.isRemote()).to.equal(false);
    });
  });

  describe('getAddress()', () => {
    it('should return the address of the service', () => {
      const callee = new Callee(null, null, 'test', null, null, null, null);
      expect(callee.getAddress()).to.equal('test');
    });
  });

  describe('getName()', () => {
    it('should return the name of the service', () => {
      const callee = new Callee(null, null, null, 'test', null, null, null);
      expect(callee.getName()).to.equal('test');
    });
  });

  describe('getVersion()', () => {
    it('should return the version of the service', () => {
      const callee = new Callee(null, null, null, null, 'test', null, null);
      expect(callee.getVersion()).to.equal('test');
    });
  });

  describe('getAction()', () => {
    it('should return the called action', () => {
      const callee = new Callee(null, null, null, null, null, 'test', null);
      expect(callee.getAction()).to.equal('test');
    });
  });

  describe('getParams()', () => {
    it('should return the parameters of the call', () => {
      const callee = new Callee(null, null, null, null, null, null, []);
      expect(callee.getParams()).to.eql([]);
    });
  });
});
