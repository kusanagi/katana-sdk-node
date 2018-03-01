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

const expect      = require('chai').expect;
const ParamSchema = require('./param-schema');

describe('ParamSchema', () => {
  const mockMapping = {
                'r': true,
                'n': 'slug',
                't': 'string',
                'd': 'test',
                'xl': 255,
                'e': false,
                'f': 'slug',
                'h': {'g': true, 'i': 'path', 'p': 'slug'}
  };
  it('should create an instance', () => {
    const paramSchema = new ParamSchema();
    expect(paramSchema).to.be.an.instanceOf(ParamSchema);
  });
  describe('getName()', () => {
    it('should return the name of the parameter created in the schema', () => {
      const paramSchema = new ParamSchema('test', null, null, null);
      expect(paramSchema.getName()).to.equal('test');
    });
  });
  describe('getType()', () => {
    it('should return the type of the parameter created from the mapping', () => {
      const paramSchema = ParamSchema.fromMapping('slug', mockMapping);
      expect(paramSchema.getType()).to.equal('string');
    });
  });
  describe('getDefaultValue()', () => {
    it('should return the default value of the parameter created from the mapping', () => {
      const paramSchema = ParamSchema.fromMapping('slug', mockMapping);
      expect(paramSchema.getDefaultValue()).to.equal('test');
    });
  });
  describe('isRequired()', () => {
    it('should return if the parameter is required when created from the mapping', () => {
      const paramSchema = ParamSchema.fromMapping('slug', mockMapping);
      expect(paramSchema.isRequired()).to.equal(true);
    });
  });
  describe('getMaxLength()', () => {
    it('should return the max length is required created from the mapping', () => {
      const paramSchema = ParamSchema.fromMapping('slug', mockMapping);
      expect(paramSchema.getMaxLength()).to.equal(255);
    });
  });
  describe('allowEmpty()', () => {
    it('should return if the parameter is allowed empty when created from the mapping', () => {
      const paramSchema = ParamSchema.fromMapping('slug', mockMapping);
      expect(paramSchema.allowEmpty()).to.equal(false);
    });
  });
  describe('getFormat()', () => {
    it('should return the format of the parameter when created from the mapping', () => {
      const paramSchema = ParamSchema.fromMapping('slug', mockMapping);
      expect(paramSchema.getFormat()).to.equal('slug');
    });
  });
});
