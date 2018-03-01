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
