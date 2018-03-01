/*
 * NODE SDK for the KATANA(tm) Framework (http://katana.kusanagi.io)
 * Copyright (c) 2016-2018 KUSANAGI S.L. All rights reserved.
 *
 * Distributed under the MIT license
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code
 *
 * @link      https://github.com/kusanagi/katana-sdk-node
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @copyright Copyright (c) 2016-2018 KUSANAGI S.L. (http://kusanagi.io)
 */

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
