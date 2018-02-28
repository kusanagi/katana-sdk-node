'use strict';

const expect = require('chai').expect;
const Caller  = require('./caller');
const Callee  = require('./callee');

describe('Caller', () => {
  it('should create an instance', () => {
    const caller = new Caller(null, null, null, null);
    expect(caller).to.be.an.instanceOf(Caller);
  });


  describe('getName()', () => {
    it('should return the name of the service', () => {
      const caller = new Caller('test', null, null, null);
      expect(caller.getName()).to.equal('test');
    });
  });

  describe('getVersion()', () => {
    it('should return the version of the service', () => {
      const caller = new Caller(null, 'test', null, null);
      expect(caller.getVersion()).to.equal('test');
    });
  });

  describe('getAction()', () => {
    it('should return the action that generated the call', () => {
      const caller = new Caller(null, null, 'test', null);
      expect(caller.getAction()).to.equal('test');
    });
  });

  describe('getCallee()', () => {
    it('should return the target of the call', () => {
      const caller = new Caller(null, null, null, new Callee());
      expect(caller.getCallee()).to.be.an.instanceOf(Callee);
    });
  });
});
