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

const _ = require('lodash');

/**
 * ActionData class
 */
class ActionData {
  /**
   * Create a ActionData instance
   *
   * @param {string} name Name of the action
   * @param {array|object} data The action data
   */
  constructor(name, data) {
    if (_.isArray(data)) {
      this._collection = true;
    } else if (_.isObject(data)) {
      this._collection = false;
    } else {
      throw new TypeError('The param `data` must be array or object');
    }

    this._name = name;
    this._data = data;
  }

  /**
   * Return the action name
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return true if the data is a collection
   *
   * @return {bool}
   */
  isCollection() {
    return this._collection;
  }

  /**
   * Return the data
   *
   * @return {array|object}
   */
  getData() {
    return this._data;
  }
}

module.exports = ActionData;
