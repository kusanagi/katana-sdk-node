'use strict';

const fs = require('fs');
const _ = require('lodash');
const request = require('sync-request');

/**
 * File class
 */
class File {
  /**
   * Create a File instance
   *
   * @param {string} name The name of the parameter
   * @param {string} path The path of the file
   * @param {string} [mime=''] The MIME type of the file
   * @param {string} fileName The name of the file
   * @param {number} size The size of the file in bytes
   * @param {string} token The token to access the server where the file is hosted
   */
  constructor(name, path = '', mime = 'text/plain', fileName = '', size = 0, token = '') {
    this._name = name;
    this._path = path;
    this._mime = mime;
    this._fileName = fileName;
    this._size = size;
    this._token = token;

    if (this.isRemote()) {
      ['mime', 'fileName', 'size', 'token'].forEach((param) => {
        if (!this[`_${param}`]) {
          throw new Error(`Argument required for remote file: ${param}`);
        }
      });
    }

    if (this.isLocal() && ! this._localExists()) {
      throw new Error(`File does not exist in path: ${path}`);
    }
  }

  /**
   * Return the name of the parameter for the file
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the path of the file
   *
   * @return {string}
   */
  getPath() {
    return this._path;
  }

  /**
   * Return the MIME type fo the file
   *
   * @return {string}
   */
  getMime() {
    return this._mime;
  }

  /**
   * Return the name of the file
   *
   * @return {string}
   */
  getFileName() {
    return this._fileName;
  }

  /**
   * Return the size of the file in bytes
   *
   * @return {number}
   */
  getSize() {
    return this._size;
  }

  /**
   * Return the token for the server where the file is hosted
   *
   * @return {string}
   */
  getToken() {
    return this._token;
  }

  /**
   * Determine if the path is defined for the file
   *
   * @return {boolean}
   */
  exists() {
    return this._path && true;
  }

  /**
   * Determine if the file is a local file starting with file://
   *
   * @return {boolean}
   */
  isLocal() {
    return this._path && this._path.startsWith('file://');
  }

  /**
   * Return the content of the file
   *
   * @return {string}
   */
  read() {
    return this.isRemote() ? this._remoteRead() : this._localRead();
  }

  /**
   * Return a new {@link File} instance with the given `name`
   *
   * @param {string} name THe name of the parameter
   * @return {File}
   */
  copyWithName(name) {
    if (_.isNil(name)) {
      throw new Error('Specify a file `name`');
    } else if (!_.isString(name)) {
      throw new Error('The file `name` must be a string');
    }
    return new File(name, this._path, this._mime, this._fileName, this._size, this._token);
  }

  /**
   * Return a new {@link File} instance with the given `mime` type
   *
   * @param {string} mime The MIME type of the file
   * @return {File}
   */
  copyWithMime(mime) {
    if (_.isNil(mime)) {
      throw new Error('Specify a file `mime` type');
    } else if (!_.isString(mime)) {
      throw new Error('The file `mime` type must be a string');
    }
    return new File(this._name, this._path, mime, this._fileName, this._size, this._token);
  }

  /**
   * Determine if the file is a remote file starting with http:// or https://
   *
   * @return {boolean}
   */
  isRemote() {
    return (/https?:\/\//).test(this._path);
  }

  _localExists() {
    try {
      return fs.statSync(this._path).isFile();
    } catch (err) {
      return false;
    }
  }

  _remoteRead() {
    const options = {
      'headers': {
        'x-token': this._token
      }
    };

    return request('GET', this._path, options).getBody().toString();
  }

  _localRead() {
    return fs.readFileSync(this._path).toString();
  }
}

module.exports = File;
