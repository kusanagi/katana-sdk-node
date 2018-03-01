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

// https://github.com/chimurai/http-proxy-middleware/blob/master/lib/logger.js
// http://mongodb.github.io/node-mongodb-native/2.2/api/node_modules_mongodb-core_lib_connection_logger.js.html

// Logger levels
const DEBUG   = 'DEBUG';
const INFO    = 'INFO';
const WARNING = 'WARNING';
const ERROR   = 'ERROR';

const levelPriorities = {
  DEBUG: -1,
  INFO: 0,
  WARNING: 1,
  ERROR: 2,
};

let _level = null;
let _delay  = 1000;
let _requestId  = null;

/**
 * Logger
 */
class Logger {
  /**
   * Create default logger
   */
  constructor() {
    this.levels = {INFO, DEBUG, WARNING, ERROR};
    _level      = this.levels.INFO;
    _delay      = 1000; // In ms
  }

  /**
   * Set the logger level
   *
   * @param {string} level Some available logger level or back to default
   */
  setLevel(level) {
    _level = this.levels[level] || _level;
  }

  /**
   * Get the logger level
   *
   * @return {string} Logger level
   */
  getLevel() {
    return _level;
  }

  /**
   * Set the logger delay
   *
   * @param {string} delay Some available logger delay or back to default
   */
  setDelay(delay) {
    _delay = delay;
  }

  /**
   * Get the logger delay
   *
   * @return {string} Logger delay
   */
  getDelay() {
    return _delay;
  }

  /**
   * Set the logger requestId
   *
   * @param {string} requestId Some available logger requestId or back to default
   */
  setRequestId(requestId) {
    _requestId = requestId;
  }

  /**
   * Get the logger requestId
   *
   * @return {string} Logger requestId
   */
  getRequestId() {
    return _requestId;
  }

  /**
   * Log a message with default format
   *
   * @param {string} level Log level name
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  log(level, message, ...extra) {

    if (levelPriorities[_level] > levelPriorities[level]) {
      return; // Skip logging if message level is below current level
    }

    const parts = [this.getFormattedMessage(level, message), ...extra];
    if (_requestId) {
      parts.push(`|${_requestId}|`);
    }

    function writeLine() {
      // console.log adds a space between arguments
      console.log.apply(console, parts);
    }

    if (!_delay) {
      return writeLine();
    }

    // workaround for missing messages at the start of the process
    setTimeout(function () {
      writeLine();
      _delay = 0; // After the initial delay, we don't need it anymore
    }, _delay);
  }

  /*
   * Format a message
   *
   * @param {string} level Log level name
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   *
   * @return {string} The formatted log line
   */
  getFormattedMessage(level, message) {
    const levelName = this.levels[level] || _level;
    const timestamp = (new Date()).toISOString();

    return  `${timestamp} [${levelName}] [SDK] ${message.trim()}`;
  }

  getFormattedRequestId() {
    if (_requestId) {
     return `|${_requestId}|`;
    }
  }

  /**
   * Logs a message with DEBUG level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  debug(message, ...extra) {
    this.log(DEBUG, message, ...extra);
  }

  /**
   * Logs a message with INFO level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  info(message, ...extra) {
    this.log(INFO, message, ...extra);
  }

  /**
   * Logs a message with WARNING level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  warning(message, ...extra) {
    this.log(WARNING, message, ...extra);
  }

  /**
   * Logs a message with ERROR level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  error(message, ...extra) {
    this.log(ERROR, message, ...extra);
  }
}

// Export singleton
module.exports = new Logger();
