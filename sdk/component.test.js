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

const Component = require('./component');

const sinon        = require('sinon');
const sinonChai    = require('sinon-chai');
const chai         = require('chai');
const EventEmitter = require('events').EventEmitter;
const expect       = chai.expect;

chai.use(sinonChai);

describe('Component', () => {
  const argv     = process.argv;
  const mockArgv = [
    '--framework-version', '0.0.0',
    '--component', 'service',
    '--name', 'test',
    '--version', '0.0.0',
  ];

  beforeEach(() => {
    process.argv = mockArgv;
  });

  afterEach(() => {
    process.argv = argv;
  });

  function mockProcess() {
    const processMock = new EventEmitter();
    processMock.exit  = () => {};
    sinon.stub(processMock, 'exit');
    processMock.argv = ['node', 'component.test.js'];

    return processMock;
  }

  function mockComponent(processHandle) {
    const component = new Component(processHandle);
    sinon.stub(component, '_closeSocket');

    return component;
  }

  function restoreComponent(component) {
    component._closeSocket.restore();
    component._closeSocket();
    component = null;
  }

  it('should create an instance', () => {
    const component = new Component();
    expect(component).to.be.an.instanceof(Component);
  });

  it('should terminate on SIGTERM', (done) => {
    const processMock = mockProcess();
    const component   = mockComponent(processMock);

    component.run(null);
    processMock.emit('SIGTERM');

    expect(component._closeSocket).to.have.been.calledWith();
    expect(processMock.exit).to.have.been.calledWith(0);

    restoreComponent(component);
    done();
  });

  it('should terminate on SIGINT', (done) => {
    const processMock = mockProcess();
    const component   = mockComponent(processMock);

    component.run(null);
    processMock.emit('SIGINT');

    expect(component._closeSocket).to.have.been.calledWith();
    expect(processMock.exit).to.have.been.calledWith(0);

    restoreComponent(component);
    done();
  });

  describe('setResource()', () => {

    it('saves a resource as the result of a function execution', () => {
      const component = mockComponent();
      const fn        = function () { return true; };

      expect(component.setResource('res', fn)).to.equal(true);
      restoreComponent(component);
    });

    it('fails when passing a wrong callable type', () => {
      const component = mockComponent();

      function call() {
        component.setResource('res', '');
      }

      expect(call).to.throw(/Argument `callable` must be of type 'function'/);
      restoreComponent(component);
    });

    it('fails when the callable does not return a value', () => {
      const component = mockComponent();
      const noop = function() {};
      function call() {
        component.setResource('res', noop);
      }

      expect(call).to.throw(/Argument `callable` must be a function returning a value/);
      restoreComponent(component);
    });

  });


  describe('hasResource()', () => {

    it('determine if a resource has been stored', () => {
      const component = mockComponent();
      const fn        = function () { return true; };

      expect(component.hasResource('res')).to.equal(false);
      component.setResource('res', fn);
      expect(component.hasResource('res')).to.equal(true);

      restoreComponent(component);
    });
  });


    describe('getResource', () => {

    it('returns a saved resource', () => {
      const component = mockComponent();

      component.setResource('config', function () {
        return {config: {run: true}};
      });

      expect(component.getResource('config')).to.deep.equal({config: {run: true}});
      restoreComponent(component);
    });

    it('fails when getting an inexistent resource', () => {
      const component = mockComponent();

      function call() {
        component.getResource('config');
      }

      expect(call).to.throw(/Unknown resource 'config'/);
      restoreComponent(component);
    });

  });

  describe('startup()', () => {

    it('takes a callable function ', () => {
      const component = mockComponent();

      function call() {
        component.startup(() => {});
      }

      expect(call).to.not.throw(Error);
      restoreComponent(component);
    });

    it('returns the current instance', () => {
      const component = mockComponent();
      const returned = component.startup(() => {});
      expect(returned).to.deep.equal(component);
      restoreComponent(component);
    });

    it('fails when callable is not a function', () => {
      const component = mockComponent();

      function call() {
        component.startup(false);
      }

      expect(call).to.throw(/Argument `callable` must be of type 'function'/);
      restoreComponent(component);
    });

    it('executes startup on run() passing the current component instance', () => {
      const component = mockComponent();

      const mock = {
        call: () => {
        }
      };
      sinon.stub(mock, 'call');

      component.startup(mock.call);
      expect(mock.call).to.not.have.been.called;
      component.run();
      expect(mock.call).to.have.been.calledWith(component);
      restoreComponent(component);
    });

  });

  describe('shutdown()', () => {

    it('takes a callable function ', () => {
      const component = mockComponent();

      function call() {
        component.shutdown(() => {});
      }

      expect(call).to.not.throw(Error);
      restoreComponent(component);
    });

    it('returns the current instance', () => {
      const component = mockComponent();
      const returned = component.shutdown(() => {});
      expect(returned).to.deep.equal(component);
      restoreComponent(component);
    });

    it('fails when callable is not a function', () => {
      const component = mockComponent();

      function call() {
        component.shutdown(false);
      }

      expect(call).to.throw(/Argument `callable` must be of type 'function'/);
      restoreComponent(component);
    });

    it('executes shutdown on SIGINT passing the current component instance', (done) => {
      const processMock = mockProcess();
      const component   = mockComponent(processMock);

      const mock = {
        call: () => {
        }
      };
      sinon.stub(mock, 'call');

      component.shutdown(mock.call);
      component.run(null);

      expect(mock.call).to.not.have.been.called;

      processMock.emit('SIGINT');
      expect(mock.call).to.have.been.calledWith(component);

      restoreComponent(component);
      done();
    });

  });

  describe('error()', () => {
    it('takes a callable function ', () => {
      const component = mockComponent();

      function call() {
        component.error(() => {});
      }

      expect(call).to.not.throw(Error);
      restoreComponent(component);
    });

    it('returns the current instance', () => {
      const component = mockComponent();
      const returned = component.error(() => {});
      expect(returned).to.deep.equal(component);
      restoreComponent(component);
    });

    it('fails when callable is not a function', () => {
      const component = mockComponent();

      function call() {
        component.error(false);
      }

      expect(call).to.throw(/Argument `callable` must be of type 'function'/);
      restoreComponent(component);
    });

    xit('runs when userland code fails', () => {
      const component = mockComponent();

      // function call() {
      //   throw new Error('whoops');
      // }

      // component.ac('fail', call);

      // expect(call).to.have.been.called;
      restoreComponent(component);
    });
  });

  describe('run()', () => {
    it('initializes the long running process to receive incoming messages', () => {
      const component = mockComponent();

      expect(component.socket).to.equal(undefined);
      component.run();
      expect(component.socket).to.not.equal(undefined);

      restoreComponent(component);
    });
  });

  xdescribe('log()', () => {
    it('logs if in debug mode', () => {

    });
    it('does not log if in not debug mode', () => {

    });
    it('truncates the message if goes over the character limit', () => {

    });
    it('logs NULL values', () => {

    });
    it('logs boolean values', () => {

    });
    it('logs array values', () => {

    });
    it('logs object values', () => {

    });
    it('logs function values', () => {

    });
  });
});
