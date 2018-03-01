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
const Error  = require('./error');

describe('Error', () => {
  it('should create an instance', () => {
    const link = new Error(null, null, null, null, null, null);
    expect(link).to.be.an.instanceOf(Error);
  });

  describe('getAddress()', () => {
    it('should return the address of the service', () => {
      const error = new Error('test', null, null, null, null, null);
      expect(error.getAddress()).to.equal('test');
    });
  });

  describe('getName()', () => {
    it('should return the name of the service', () => {
      const error = new Error(null, 'test', null, null, null, null);
      expect(error.getName()).to.equal('test');
    });
  });

  describe('getVersion()', () => {
    it('should return the version of the service', () => {
      const error = new Error(null, null, 'test', null, null, null);
      expect(error.getVersion()).to.equal('test');
    });
  });

  describe('getMessage()', () => {
    it('should return the message of the error', () => {
      const error = new Error(null, null, null, 'test', null, null);
      expect(error.getMessage()).to.equal('test');
    });
  });

  describe('getCode()', () => {
    it('should return the code of the error', () => {
      const error = new Error(null, null, null, null, 42, null);
      expect(error.getCode()).to.equal(42);
    });
  });

  describe('getStatus()', () => {
    it('should return the status of the error', () => {
      const error = new Error(null, null, null, null, null, 'test');
      expect(error.getStatus()).to.equal('test');
    });
  });
});
