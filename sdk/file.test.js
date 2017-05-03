'use strict';

const assert = require('assert');
const fs = require('fs');
const File = require('./file');
const chai = require('chai');
const expect = chai.expect;

describe('File', () => {
  it('should create an instance', () => {
    const file = new File();
    expect(file).to.be.an.instanceOf(File);
  });

  describe('getName()', () => {
    it('should return the name of the parameter', () => {
      const name = 'avatar';
      const file = new File(name);
      expect(file.getName()).to.equal(name);
    });
  });

  describe('getPath()', () => {
    it('should return the path of the file', () => {
      const path = 'test/qwe.txt';
      const file = new File(null, path);
      expect(file.getPath()).to.equal(path);
    });
  });

  describe('getMime()', () => {
    it('should return the mime of the file', () => {
      const mime = 'text/plain';
      const file = new File(null, null, mime);
      expect(file.getMime()).to.equal(mime);
    });
  });

  describe('getFileName()', () => {
    it('should return the fileName of the file', () => {
      const fileName = 'myFileName';
      const file = new File(null, null, null, fileName);
      expect(file.getFileName()).to.equal(fileName);
    });
  });

  describe('getSize()', () => {
    it('should return the size of the file', () => {
      const size = 1024;
      const file = new File(null, null, null, null, size);
      expect(file.getSize()).to.equal(size);
    });
  });

  describe('getToken()', () => {
    it('should return the token of the file', () => {
      const token = 'token123';
      const file = new File(null, null, null, null, null, token);
      expect(file.getToken()).to.equal(token);
    });
  });

  describe('exists()', () => {
    it('should determine if a file exists at the current path', () => {
      const file = new File('', `${__dirname}/file.js`, null, null, null, null);
      expect(file.exists()).to.equal(true);
    });

    it('should return false if the path was not specified', () => {
      const file = new File('', '', null, null, null, null);
      assert.equal(file.exists(), false);
    });
  });

  describe('read()', () => {
    it('should return the content of a file', () => {
      const filePath = `${__dirname}/file.js`;
      const file = new File('', filePath, null, null, null, null);
      assert.equal(file.read(), fs.readFileSync(filePath).toString());
    });
  });

  describe('copyWithName()', () => {
    it('should return a new file with the specified `name`', () => {
      const file = new File('file', null, null, null, null, null, null);
      const fileCopy = file.copyWithName('fileCopy');
      assert.notDeepStrictEqual(file, fileCopy);
      assert.notDeepStrictEqual(file.getName(), fileCopy.getName());
      assert.deepStrictEqual(file.getName(), 'file');
      assert.deepStrictEqual(fileCopy.getName(), 'fileCopy');
    });

    it('should throw an error if `name` is not specified', () => {
      const file = new File('file', null, null, null, null, null, null);
      assert.throws(file.copyWithName, /Specify a file `name`/);
    });

    it('should throw an error if `name` is not a string', () => {
      const file = new File('file', null, null, null, null, null, null);
      assert.throws(() => file.copyWithName({}), /The file `name` must be a string/);
    });
  });

  describe('copyWithMime()', () => {
    it('should return a new file with the specified `mime` type', () => {
      const file = new File(null, null, 'text/csv', null, null, null, null);
      const fileCopy = file.copyWithMime('application/pdf');
      assert.notDeepStrictEqual(file, fileCopy);
      assert.notDeepStrictEqual(file.getMime(), fileCopy.getMime());
      assert.deepStrictEqual(file.getMime(), 'text/csv');
      assert.deepStrictEqual(fileCopy.getMime(), 'application/pdf');
    });

    it('should throw an error if the `mime` type is not specified', () => {
      const file = new File('file', null, null, null, null, null, null);
      assert.throws(file.copyWithMime, /Specify a file `mime` type/);
    });

    it('should throw an error if the `mime` type is not a string', () => {
      const file = new File('file', null, null, null, null, null, null);
      assert.throws(() => file.copyWithMime({}), /The file `mime` type must be a string/);
    });
  });
});
