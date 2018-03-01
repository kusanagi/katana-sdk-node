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
const ActionData  = require('./action-data');

describe('ActionData', () => {
  it('should create an instance', () => {
    const actionData = new ActionData(null, {});
    expect(actionData).to.be.an.instanceOf(ActionData);
  });

  describe('getName()', () => {
    it('should return the name of the action', () => {
      const actionData = new ActionData('test', {});
      expect(actionData.getName()).to.equal('test');
    });
  });

  describe('set entity', () => {
    const entity = {test: 42};
    const actionData = new ActionData(null, entity);

    it('should not be a collection', () => {
      expect(actionData.isCollection()).to.equal(false);
    });

    it('should return an object', () => {
      expect(actionData.getData()).to.equal(entity);
    });
  });

  describe('set collection', () => {
    const collection = [{test: 42}];
    const actionData = new ActionData(null, collection);

    it('should be a collection', () => {
      expect(actionData.isCollection()).to.equal(true);
    });

    it('should return an array', () => {
      expect(actionData.getData()).to.equal(collection);
    });
  });

  describe('set invalid data', () => {
    const collection = [{test: 42}];
    const actionData = new ActionData(null, collection);

    it('should be a collection', () => {
      expect(actionData.isCollection()).to.equal(true);
    });

    it('should return an array', () => {
      expect(actionData.getData()).to.equal(collection);
    });
  });
});
