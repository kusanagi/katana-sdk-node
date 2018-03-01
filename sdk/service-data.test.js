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
const ServiceData  = require('./service-data');
const ActionData  = require('./action-data');

describe('ServiceData', () => {
  it('should create an instance', () => {
    const serviceData = new ServiceData(null, null, null, null);
    expect(serviceData).to.be.an.instanceOf(ServiceData);
  });

  describe('getAddress()', () => {
    it('should return the address of the service', () => {
      const serviceData = new ServiceData('test', null, null, null);
      expect(serviceData.getAddress()).to.equal('test');
    });
  });

  describe('getName()', () => {
    it('should return the name of the service', () => {
      const serviceData = new ServiceData(null, 'test', null, null);
      expect(serviceData.getName()).to.equal('test');
    });
  });

  describe('getVersion()', () => {
    it('should return the version of the service', () => {
      const serviceData = new ServiceData(null, null, 'test', null);
      expect(serviceData.getVersion()).to.equal('test');
    });
  });

  describe('getActions()', () => {
    it('should return the actions of the service with data', () => {
      const actions = [
          new ActionData(null, {})
      ];
      const serviceData = new ServiceData(null, null, null, actions);
      expect(serviceData.getActions()).to.equal(actions);
    });
  });
});
