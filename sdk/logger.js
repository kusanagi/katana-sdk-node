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
const EMERGENCY = 0;
const ALERT     = 1;
const CRITICAL  = 2;
const ERROR     = 3;
const WARNING   = 4;
const NOTICE    = 5;
const INFO      = 6;
const DEBUG     = 7;

let _level = null;
let _requestId  = null;

/**
 * Logger
 */
class Logger {
  /**
   * Create default logger
   */
  constructor() {
    this.levels = [
      'EMERGENCY',
      'ALERT',
      'CRITICAL',
      'ERROR',
      'WARNING',
      'NOTICE',
      'INFO',
      'DEBUG'
    ];
    _level = INFO;
  }

  /**
   * Set the logger level
   *
   * @param {string} level Some available logger level or back to default
   */
  setLevel(level) {
    if (typeof level === 'number') {
      _level = level;
    } else {
      level = this.levels.indexOf(level);
      _level = level >= 0 ? level : _level;
    }
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
   * @param {number} level Log level name
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  log(level, message, ...extra) {
    if (_level < level) {
      return; // Skip logging if message level is above current level
    }

    const parts = [this.getFormattedMessage(level, message), ...extra];
    if (_requestId) {
      parts.push(`|${_requestId}|`);
    }

    function writeLine() {
      // console.log adds a space between arguments
      console.log.apply(console, parts);
    }

    return writeLine();
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
    const levelName = this.levels[level];
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
   * Logs a message with NOTICE level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  notice(message, ...extra) {
    this.log(NOTICE, message, ...extra);
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

  /**
   * Logs a message with CRITICAL level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  critical(message, ...extra) {
    this.log(CRITICAL, message, ...extra);
  }

  /**
   * Logs a message with ALERT level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
  alert(message, ...extra) {
    this.log(ALERT, message, ...extra);
  }

  /**
   * Logs a message with EMERGENCY level
   *
   * @param {string} message Log message
   * @param extra Optional extra arguments to log
   */
   emergency(message, ...extra) {
     this.log(EMERGENCY, message, ...extra);
  }
}

// Export singleton
module.exports = new Logger();
