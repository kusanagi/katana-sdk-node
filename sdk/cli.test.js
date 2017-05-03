'use strict';

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

const cli = require('./cli');

describe('cli', function () {
  let processArgv;

  before(() => {
    processArgv = process.argv;
    sinon.stub(process, 'exit');
    sinon.stub(process.stderr, 'write');
  });

  after(() => {
    process.argv = processArgv;
    process.exit.restore();
    process.stderr.write.restore();
  });

  it('has a parse method', () => {
    expect(cli.parse).to.be.a('function');
  });

  it('exits with an error when a required argument is not passed', function(done) {
    this.timeout(6000);
    process.argv = []; // Passing no arguments at all

    try {
      cli.parse(); // we don't care about other errors, just about the exit call and log message
    } catch (e) {
      void 0;
    }

    expect(process.exit).to.have.been.calledWith(1);
    expect(process.stderr.write).to.have.been.calledWith(
      'Missing required arguments: framework-version, component, name, version\n'
    );
    done();
  });

  it('exits with an error when passing an invalid component type', () => {
    process.argv = [
      '--framework-version', '0.0.0',
      '--version', '0.0.0',
      '--name', 'test',
      '--component', 'x',
    ]; // Passing no arguments at all

    try {
      cli.parse(); // we don't care about other errors, just about the exit call and log message
    } catch (e) {
      void 0;
    }

    expect(process.exit).to.have.been.calledWith(1);
    expect(process.stderr.write).to.have.been.calledWith(
      'Invalid values:\n  Argument: component, Given: "x", Choices: "service", "middleware"\n'
    );

  });

  it('generates a socket with a valid name when not provided', () => {

    process.argv = [
      '--framework-version', '1.0.0',
      '--component', 'service',
      '--name', 'example',
      '--version', '1.0.0'
    ];

    const args = cli.parse();
    expect(args.socket).to.equal('@katana-service-example-1-0-0');
  });

});
