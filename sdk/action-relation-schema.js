'use strict';

const Schema = require('./schema');
const m = require('./mappings');

class ActionRelationSchema extends Schema {
  static parseMapping(mapping) {
    return {
      name: mapping[m.name],
      type: this.readProperty(mapping, m.type, 'one'),
    };
  }
}

module.exports = ActionRelationSchema;
