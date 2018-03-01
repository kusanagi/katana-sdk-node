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
