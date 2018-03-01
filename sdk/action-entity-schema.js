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

const Schema = require('./schema');
const m      = require('./mappings');
// const logger      = require('./logger');

class ActionEntitySchema extends Schema {
  static parseMapping(mapping) {

    const entity = {
      validate: this.readProperty(mapping, m.validate, false),
    };

    if (mapping[m.field]) {
      entity.field = this.readProperty(mapping, m.field, []).map(this._parseField);
    }

    if (mapping[m.fields]) {
      entity.fields = this.readProperty(mapping, m.fields, []).map(this._parseFields);
    }

    return entity;
  }

  static _parseField(definition) {
    const field = {
      name: definition[m.name],
      type: definition[m.type],
    };

    // Spec doesn't say it should be left out if not specified, but we're only including it if it is
    if (definition[m.optional]) {
      field.optional = definition[m.optional];
    }

    return field;
  }

  static _parseFields(definition) {
    const fields = {
      name: definition[m.name],
    };

    // Spec doesn't say it should be left out if not specified, but we're only including it if it is
    if (definition[m.optional]) {
      fields.optional = definition[m.optional];
    }

    if (definition[m.field]) {
      fields.field = this._parseField(definition[m.field]);
    }

    if (definition[m.fields]) {
      fields.fields = this._parseField(definition[m.fields]);
    }

    return fields;
  }
}

module.exports = ActionEntitySchema;
