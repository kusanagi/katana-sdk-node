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
const Transaction  = require('./transaction');

describe('Transaction', () => {
  it('should create an instance', () => {
    const transaction = new Transaction('commit', null, null, null, null, null);
    expect(transaction).to.be.an.instanceOf(Transaction);
  });

  const badConstructor = () => new Transaction('foo', null, null, null, null, null);
  it('should throw error with invalid types', () => {
      expect(badConstructor).to.throw(TypeError);
  });

  describe('getType()', () => {
    it('should return the type of transaction', () => {
      const transaction = new Transaction('commit', null, null, null, null, null);
      expect(transaction.getType()).to.equal('commit');
    });
  });

  describe('getName()', () => {
    it('should return the name of the service', () => {
      const transaction = new Transaction('commit', 'test', null, null, null, null);
      expect(transaction.getName()).to.equal('test');
    });
  });

  describe('getVersion()', () => {
    it('should return the version of the service', () => {
      const transaction = new Transaction('commit', null, 'test', null, null, null);
      expect(transaction.getVersion()).to.equal('test');
    });
  });

  describe('getCallerAction()', () => {
    it('should return the action that called the transaction', () => {
      const transaction = new Transaction('commit', null, null, 'test', null, null);
      expect(transaction.getCallerAction()).to.equal('test');
    });
  });

  describe('getCalleeAction()', () => {
    it('should return the called action', () => {
      const transaction = new Transaction('commit', null, null, null, 'test', null);
      expect(transaction.getCalleeAction()).to.equal('test');
    });
  });

  describe('getParams()', () => {
    it('should return the parameters of the transaction', () => {
      const transaction = new Transaction('commit', null, null, null, null, []);
      expect(transaction.getParams()).to.eql([]);
    });
  });
});
