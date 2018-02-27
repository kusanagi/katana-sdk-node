'use strict';

const expect = require('chai').expect;
const Link  = require('./link');

describe('Link', () => {
  it('should create an instance', () => {
    const link = new Link(null, null, null, null);
    expect(link).to.be.an.instanceOf(Link);
  });

  describe('getAddress()', () => {
    it('should return the address of the link service', () => {
      const link = new Link('test', null, null, null);
      expect(link.getAddress()).to.equal('test');
    });
  });

  describe('getName()', () => {
    it('should return the name of the link service', () => {
      const link = new Link(null, 'test', null, null);
      expect(link.getName()).to.equal('test');
    });
  });

  describe('getLink()', () => {
    it('should return the name of the link', () => {
      const link = new Link(null, null, 'test', null);
      expect(link.getLink()).to.equal('test');
    });
  });

  describe('getUri()', () => {
    it('should return the uri of the link', () => {
      const link = new Link(null, null, null, 'test');
      expect(link.getUri()).to.equal('test');
    });
  });
});
