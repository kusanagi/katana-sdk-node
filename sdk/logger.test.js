'use strict';

const assert = require('assert');
const logger = require('./logger');

const ISO_8601_REGEX = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

describe('logger', () => {
  let output;
  logger.setDelay(null); // Disable workaround for missing stdout lines in katana-1.0.0

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

      logger.log(logger.levels.INFO, 'test');

      const [timestamp, level, tag, message, requestId] = output.split(' ');

      assert.equal(true, ISO_8601_REGEX.test(timestamp));
      assert.equal(level, `[${logger.levels.INFO}]`);
      assert.equal(tag, '[SDK]');
      assert.equal(message, 'test');
      assert.equal(requestId, undefined);
    });

    it('should not output the requestId if not set', () => {
      logger.setRequestId(null);
      logger.log(logger.levels.INFO, 'test');

      const [, , , , requestId] = output.split(' ');
      assert.equal(requestId, undefined);
    });

    it('should log the formatted Request Id if set', () => {
      const uuid = '55f33a09-3d00-40ac-8418-4c88c37679cb';

      logger.setRequestId(uuid);
      logger.log(logger.levels.INFO, 'test');

      const [, , , , requestId] = output.split(' ');
      assert.equal(requestId, `|${uuid}|`);
    });

    it('should set level as INFO when the level setting is invalid/unknown', () => {
      logger.setLevel('UNKNOWN');
      assert.equal(logger.getLevel(), logger.levels.INFO);
    });

    it('should use INFO level when calling log() with an unknown level', () => {
      logger.log('UNKOWN', 'test');
      const [, level] = output.split(' ');
      assert.equal(level, `[${logger.levels.INFO}]`);
    });

  });

  describe('debug()', () => {
    it('should log a DEBUG message when logger level setting is lower or equal DEBUG', () => {
      const message = 'test';

      logger.setLevel(logger.levels.DEBUG);
      logger.debug(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, `[${logger.levels.DEBUG}]`);
      assert.equal(message, loggedMessage);
    });

    it('should not log a DEBUG message when logger level is higher than DEBUG', () => {
      logger.setLevel(logger.setLevel(logger.levels.INFO));

      logger.debug('test');

      assert.equal(null, output);
    });
  });
  
  describe('info()', () => {
    it('should log a INFO message when logger level setting is lower or equal INFO', () => {
      const message = 'test';

      logger.setLevel(logger.levels.INFO);
      logger.info(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, `[${logger.levels.INFO}]`);
      assert.equal(message, loggedMessage);
    });

    it('should not log a INFO message when logger level is higher than INFO', () => {
      logger.setLevel(logger.setLevel(logger.levels.WARNING));

      logger.info('test');

      assert.equal(null, output);
    });
  });

  describe('warning()', () => {
    it('should log a WARNING message when logger level setting is lower or equal WARNING', () => {
      const message = 'test';

      logger.setLevel(logger.levels.WARNING);
      logger.warning(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, `[${logger.levels.WARNING}]`);
      assert.equal(message, loggedMessage);
    });

    it('should not log a WARNING message when logger level is higher than WARNING', () => {
      logger.setLevel(logger.setLevel(logger.levels.ERROR));

      logger.warning('test');

      assert.equal(null, output);
    });
  });

  describe('error()', () => {
    it('should always log ERROR messages', () => {
      const message = 'test';

      logger.error(message);

      const [, level, , loggedMessage] = output.split(' ');

      assert.equal(level, `[${logger.levels.ERROR}]`);
      assert.equal(message, loggedMessage);
    });
  });
});
