'use strict';

class Schema {
  static readProperty(mapping, propertyName, defaultValue) {
    if (!mapping) {
      return defaultValue;
    }

    if (typeof mapping[propertyName] !== typeof undefined) {
      return mapping[propertyName];
    }

    if (typeof defaultValue === typeof undefined) {
      throw new Error(`Missing default value reading unset property name: '${propertyName}'.`);
    }

    return defaultValue;
  }
}

module.exports = Schema;
