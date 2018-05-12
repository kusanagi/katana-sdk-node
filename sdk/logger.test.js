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

const assert = require('assert');
const logger = require('./logger');

const ISO_8601_REGEX = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

describe('logger', () => {
  let output;

  // Test setup
  const log = console.log; // backup native call

  beforeEach(() => {
    output = null; // stdout will be stored here
    console.log = (...args) => { // overwrite native call
      output = args.join(' ').trim(); // console.log is variadic, this should be too
    };
  });

  afterEach(() => {
    output = null; // cleanup
    console.log = log; // Restore log here to allow mocha logging test info
  });

  describe('log()', () => {
    // https://github.com/kusanagi/katana-sdk-spec#53-logging
    it('should log a message formatted according to the spec', () => {

      logger.log(6, 'test');

      const [timestamp, level, tag, message, requestId] = output.split(' ');

      assert.equal(true, ISO_8601_REGEX.test(timestamp));
      assert.equal(level, '[INFO]');
      assert.equal(tag, '[SDK]');
      assert.equal(message, 'test');
      assert.equal(requestId, undefined);
    });

    it('should not output the requestId if not set', () => {
      logger.setRequestId(null);
      logger.log(6, 'test');

      const [, , , , requestId] = output.split(' ');
      assert.equal(requestId, undefined);
    });

    it('should log the formatted Request Id if set', () => {
      const uuid = '55f33a09-3d00-40ac-8418-4c88c37679cb';

      logger.setRequestId(uuid);
      logger.log(6, 'test');

      const [, , , , requestId] = output.split(' ');
      assert.equal(requestId, `|${uuid}|`);
    });

    it('should set level as INFO when the level setting is invalid/unknown', () => {
      logger.setLevel('UNKNOWN');
      assert.equal(logger.getLevel(), 6);
    });

  });

  describe('debug()', () => {
    it('should log a DEBUG message when logger level setting is lower or equal DEBUG', () => {
      const message = 'test';

      logger.setLevel(7);
      logger.debug(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, '[DEBUG]');
      assert.equal(message, loggedMessage);
    });

    it('should not log a DEBUG message when logger level is higher than DEBUG', () => {
      logger.setLevel(logger.setLevel(6));

      logger.debug('test');

      assert.equal(null, output);
    });
  });

  describe('info()', () => {
    it('should log a INFO message when logger level setting is lower or equal INFO', () => {
      const message = 'test';

      logger.setLevel(6);
      logger.info(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, '[INFO]');
      assert.equal(message, loggedMessage);
    });

    it('should not log a INFO message when logger level is higher than INFO', () => {
      logger.setLevel(logger.setLevel(4));

      logger.info('test');

      assert.equal(null, output);
    });
  });

  describe('warning()', () => {
    it('should log a WARNING message when logger level setting is lower or equal WARNING', () => {
      const message = 'test';

      logger.setLevel(4);
      logger.warning(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, '[WARNING]');
      assert.equal(message, loggedMessage);
    });

    it('should not log a WARNING message when logger level is higher than WARNING', () => {
      logger.setLevel(logger.setLevel(3));

      logger.warning('test');

      assert.equal(null, output);
    });
  });

  describe('error()', () => {
    it('should always log ERROR messages', () => {
      const message = 'test';

      logger.error(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, '[ERROR]');
      assert.equal(message, loggedMessage);
    });
  });
});
