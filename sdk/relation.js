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

/**
 * Relation class
 */
class Relation {
  /**
   * Create a Relation instance
   *
   * @param {string} address Address of the service
   * @param {string} name Name of the service
   * @param {string} primaryKey Primary key of the relation
   * @param {ForeignRelation[]} foreignRelations Targets of the relation
   */
  constructor(address, name, primaryKey, foreignRelations) {
    this._address = address;
    this._name = name;
    this._primaryKey = primaryKey;
    this._foreignRelations = foreignRelations;
  }

  /**
   * Return the service address
   *
   * @return {string}
   */
  getAddress() {
    return this._address;
  }

  /**
   * Return the service name
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the primary key
   *
   * @return {string}
   */
  getPrimaryKey() {
    return this._primaryKey;
  }

  /**
   * Return the foreign relation
   *
   * @returns {ForeignRelation[]}
   */
  getForeignRelations() {
    return this._foreignRelations;
  }
}

module.exports = Relation;
