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
