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

const m = require('./mappings');

const HttpServiceSchema = require('./http-service-schema');
const ActionSchema      = require('./action-schema');
const ServiceSchema     = require('./service-schema');

const mockServiceMapping = {
  [m.http]: {
    [m.gateway]: true,
    [m.base_path]: '/1.0'
  },
  [m.address]: '127.0.0.1:3334',
  [m.files]: true,
  [m.actions]: {
    'read': {
      [m.http]: {
        [m.gateway]: true,
        [m.path]: '/1.0/users/{id}',
        [m.input]: 'query'
      },
      [m.files]: [],
      [m.timeout]: 1,
      [m.collection]: false,
      [m.primary_key]: 'id',
      [m.params]: {
        'id': {
          [m.type]: 'integer',
          [m.name]: 'id',
          [m.required]: true,
          [m.http]: {
            [m.gateway]: true,
            [m.param]: 'id',
            [m.input]: 'path'
          }
        }
      },
      [m.entity]: {
        [m.validate]: true,
        [m.fields]: [
          {[m.type]: 'integer', [m.name]: 'id'},
          {[m.type]: 'string', [m.name]: 'name'},
        ]
      },
      [m.deprecated]: false
    },
  }
};


describe('ServiceSchema', () => {

  it('can be instantiated', () => {
    const serviceSchema = new ServiceSchema();
    expect(serviceSchema).to.be.an.instanceOf(ServiceSchema);
  });


  describe('fromMapping()', () => {

    it('parses the first level correctly', () => {

      const name    = 'users';
      const version = '1.0.0';

      const schema = ServiceSchema.fromMapping(name, version, mockServiceMapping);
      expect(schema).to.be.an.instanceOf(ServiceSchema);

      expect(schema.getName()).to.equal(name);
      expect(schema.getVersion()).to.equal(version);
      expect(schema.getAddress()).to.equal('127.0.0.1:3334');
      expect(schema.hasFileServer()).to.equal(true);
    });

    it('parses the HttServiceSchema correctly', () => {

      const name    = 'users';
      const version = '1.0.0';

      const schema = ServiceSchema.fromMapping(name, version, mockServiceMapping);
      expect(schema).to.be.an.instanceOf(ServiceSchema);

      expect(schema.getHttpSchema().isAccessible()).to.equal(true);
      expect(schema.getHttpSchema().getBasePath()).to.equal('/1.0');
    });

    it('parses the Actions correctly', () => {

      const name    = 'users';
      const version = '1.0.0';

      const schema = ServiceSchema.fromMapping(name, version, mockServiceMapping);
      expect(schema).to.be.an.instanceOf(ServiceSchema);

      expect(schema.getActions()[0]).to.equal('read');
      expect(schema.hasAction('read')).to.equal(true);
    });

  });


  describe('getName()', () => {

    it('returns the given name', () => {

      const serviceName   = 'users';
      const serviceSchema = new ServiceSchema(serviceName);
      expect(serviceSchema.getName()).to.equal(serviceName);
    });

  });


  describe('getVersion()', () => {

    it('returns the given version', () => {

      const serviceVersion = '1.0.0';
      const serviceSchema  = new ServiceSchema(null, serviceVersion);
      expect(serviceSchema.getVersion()).to.equal(serviceVersion);
    });

  });


  describe('getAddress()', () => {

    it('returns the given address', () => {

      const serviceAddress = 'http://192.168.0.1:8000';
      const serviceSchema  = new ServiceSchema(null, null, serviceAddress);
      expect(serviceSchema.getAddress()).to.equal(serviceAddress);
    });

  });

  describe('hasFileServer()', () => {

    it('returns the appropriate value', () => {
      let serviceSchema = new ServiceSchema(null, null, null, null, null, true);
      expect(serviceSchema.hasFileServer()).to.equal(true);

      serviceSchema = new ServiceSchema();
      expect(serviceSchema.hasFileServer()).to.equal(false);
    });

  });

  describe('getActions()', () => {

    it('returns an array of given action names', () => {
      const actions     = {'list': null, 'create': null};
      let serviceSchema = new ServiceSchema(null, null, null, null, actions);
      expect(serviceSchema.getActions()[0]).to.equal('list');
      expect(serviceSchema.getActions()[1]).to.equal('create');
    });

  });

  describe('hasAction()', () => {

    it('returns true if given an existing action', () => {
      const actions     = {'create': null};
      let serviceSchema = new ServiceSchema(null, null, null, null, actions);
      expect(serviceSchema.hasAction('create')).to.equal(true);
    });

    it('returns false if given an non-existing action', () => {
      const actions     = {'list': null, 'create': null};
      let serviceSchema = new ServiceSchema(null, null, null, null, actions);
      expect(serviceSchema.hasAction('delete')).to.equal(false);
    });

  });

  describe('getHttpSchema()', () => {

    it('returns the given HttpSchema', () => {
      const httpSchema  = new HttpServiceSchema(true, '/');
      let serviceSchema = new ServiceSchema(null, null, null, httpSchema);
      expect(serviceSchema.getHttpSchema()).to.equal(httpSchema);
      expect(serviceSchema.getHttpSchema().isAccessible()).to.equal(true);
      expect(serviceSchema.getHttpSchema().getBasePath()).to.equal('/');
    });

  });

  describe('getActionSchema()', () => {

    it('returns the ActionSchema for the given action', () => {
      const actionSchema = new ActionSchema('list', 101);
      const actions      = {list: actionSchema};
      let serviceSchema  = new ServiceSchema(null, null, null, null, actions);
      expect(serviceSchema.getActionSchema('list')).to.equal(actionSchema);
      expect(serviceSchema.getActionSchema('list').getTimeout()).to.equal(101);
    });

  });

});
