KATANA SDK for Node.js
=========================

[![version](https://img.shields.io/npm/v/katana.sdk.svg)](https://npm.im/katana.sdk)
[![Build Status](https://img.shields.io/travis/kusanagi/katana-sdk-node.svg)](https://travis-ci.com/kusanagi/katana-sdk-node)
[![Coveralls Coverage Status](https://img.shields.io/coveralls/kusanagi/katana-sdk-node.svg)](https://coveralls.io/github/kusanagi/katana-sdk-node?branch=coverage)
[![license](https://img.shields.io/npm/l/katana.sdk.svg)](https://npm.im/katana.sdk)

Node.js v6 SDK to interface with the **KATANA**™ framework (https://kusanagi.io).

Requirements
------------

* KATANA Framework 1.2
* [Node.js](https://nodejs.org/en/download/) 6.0+
* python ([a node-gyp requirement](https://github.com/nodejs/node-gyp#installation)) (`v2.7` recommended, `v3.x.x` is not supported) 
* [libzmq](http://zeromq.org/intro:get-the-software) 4.1.5+ (including headers, you probably need a `libzmq-dev` package)

Installation
------------

Make sure the system dependencies are met.

Use the following command to install the SDK from the NPM repository and add it to your dependencies:

```sh
$ npm install katana.sdk --save
```

Alternatively, you might want to install through the [yarn](https://yarnpkg.com) package manager:

```sh
$ yarn add katana.sdk
```

To run the tests, determine the code coverage, and pass the linter, run the following:

```sh
$ npm run test
```

Or, you can simply run the tests:

```sh
$ npm run test:unit
```

You can also run the tests and watch for changes, which can be useful when developing:

```sh
$ npm run test:dev
```

If you'd like to generate a code coverage report, run the following:

```sh
$ npm run coverage
$ open coverage/lcov-report/index.html
```

Also, to run the linter on the code base, run the following:

```sh
$ npm run lint
```

Finally, if you'd like to build the technical documentation for the code base, you can generate it with the following:

```sh
$ npm run docs
```

Troubleshooting
---------------

Make sure these are met before installing the `katana.sdk` npm package. Some of its dependencies need to be compiled through `node-gyp`, and these depend on the `libzmq` headers being present. That means you probably need to install `zqm-devel` or a similar package ([read more](https://github.com/JustinTulloss/zeromq.node#installing-on-unixposix-and-osx)). If the `katana.sdk` npm package was installed before the `libzmq` header files were present, you'll need to nuke your project's `node_modules` folder and reinstall `katana.sdk`.

```sh
rm -Rf node_modules
npm install
```

Getting Started
---------------

Include the **KATANA**™ SDK library and set up **Service** or **Middleware** instances, for example:

```js
const Service = require('katana.sdk').Service;

const service = new Service();
```

Examples
--------

The following is a simple **Middleware** implementation to handle CORS.

**KATANA** configurations can be defined as *XML*, *YAML* or *JSON*. For this example we're using *JSON*.

First, we'll create a new config file for the **Middleware** as the following:

```json
{
  "@context": "urn:katana:middleware",
  "name": "cors",
  "version": "1.0.0",
  "request": true,
  "engine": {
    "runner": "urn:katana:runner:node",
    "path": "cors.js"
  }
}
```

Note that you can also use a remote debugger by adding the `--debug-brk` flag as the value of the `interpreter-options` property of the `engine` element of the configuration, for example:

```json
{
  "@context": "urn:katana:middleware",
  "name": "cors",
  "version": "1.0.0",
  "request": true,
  "engine": {
    "runner": "urn:katana:runner:node",
    "path": "cors.js",
    "interpreter-options": "--debug-brk=8888"
  }
}
```

Now we'll need to create the logic for the **Middleware** in the `cors.js` file, as defined in the config file:

```js
const Middleware = require('katana.sdk').Middleware;

const middleware = new Middleware();

middleware.request((request) => {
  const httpRequest = request.getHttpRequest();
  const httpMethod  = httpRequest.getMethod();
  const urlPath     = httpRequest.getUrlPath();
  if (httpMethod === 'OPTIONS') {
    const response     = request.newResponse(200, 'OK');
    const httpResponse = response.getHttpResponse();
    httpResponse.setHeader('Access-Control-Allow-Origin', '*');
    httpResponse.setHeader('Access-Control-Allow-Headers', 'cache-control');
    httpResponse.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    return response; // exit early
  }
  return request;
});

middleware.run();
```

This **Middleware** can now be included in any **Gateway** to enable CORS processing.

In the following example we'll create a **Service** which provides a simple CRUD interface for users:

```json
{
  "@context": "urn:katana:service",
  "name": "users",
  "version": "1.0.0",
  "http-base-path": "/1.0.0/users",
  "info": {
    "title": "Users Service"
  },
  "engine": {
    "runner": "urn:katana:runner:node",
    "path": "users.js"
  },
  "action": [
    {
      "name": "list",
      "collection": true,
      "http-method": "get"
    },
    {
      "name": "create",
      "http-method": "post",
      "http-input": "form-data",
      "param": [
        {"name": "name", "required": true}
      ]
    },
    {
      "name": "read",
      "http-method": "get",
      "http-path": "/{id}",
      "param": [
        {"name": "id", "type": "integer", "required": true, "http-input": "path"}
      ]
    },
    {
      "name": "update",
      "http-method": "put",
      "http-path": "/{id}",
      "param": [
        {"name": "id", "type": "integer", "required": true, "http-input": "path"},
        {"name": "name", "required": true, "http-input": "form-data"}
      ]
    },
    {
      "name": "delete",
      "http-method": "delete",
      "http-path": "/{id}",
      "param": [
        {"name": "id", "type": "integer", "required": true, "http-input": "path"}
      ]
    }
  ]
}
```

And as before, we'll create the **Service** logic in a file named `users.js`, as we had defined in the config file:

```js
const Service = require('katana.sdk').Service;

const service = new Service();

service.action('list', (action) => {
  // get all entities from the data store
  action.setCollection(collection);
  return action;
});

service.action('create', (action) => {
  const name = action.getParam('name').getValue();
  // create entity in data store with "name"
  action.setEntity(entity);
  return action;
});

service.action('read', (action) => {
  const id = action.getParam('id').getValue();
  // get entity from data store with "id"
  action.setEntity(entity);
  return action;
});

service.action('update', (action) => {
  const id = action.getParam('id').getValue();
  const name = action.getParam('name').getValue();
  // update "name" in data store for "id"
  return action;
});

service.action('delete', (action) => {
  const id = action.getParam('id').getValue();
  // delete from data store with "id"
  return action;
});

service.run();
```

Documentation
-------------

See the [API](https://app.kusanagi.io#katana/docs/sdk) for a technical reference of the SDK.

For help using the framework see the [documentation](https://app.kusanagi.io#katana/docs).

Support
-------

Please first read our [contribution guidelines](https://app.kusanagi.io#katana/open-source/contributing).

* [Requesting help](https://app.kusanagi.io#katana/open-source/help)
* [Reporting a bug](https://app.kusanagi.io#katana/open-source/bug)
* [Submitting a patch](https://app.kusanagi.io#katana/open-source/patch)
* [Security issues](https://app.kusanagi.io#katana/open-source/security)

We use [milestones](https://github.com/kusanagi/katana-sdk-node/milestones) to track upcoming releases inline with our [versioning](https://app.kusanagi.io#katana/docs/framework/versions) strategy, and as defined in our [roadmap](https://app.kusanagi.io#katana/docs/framework/roadmap).

For commercial support see the [solutions](https://app.kusanagi.io#solutions) available or [contact us](https://app.kusanagi.io#contact) for more information.

Contributing
------------

If you'd like to know how you can help and support our Open Source efforts see the many ways to [get involved](https://app.kusanagi.io#katana/open-source).

Please also be sure to review our [community guidelines](https://app.kusanagi.io#katana/open-source/conduct).

License
-------

Copyright 2016-2017 KUSANAGI S.L. (https://kusanagi.io). All rights reserved.

KUSANAGI, the sword logo, KATANA and the "K" logo are trademarks and/or registered trademarks of KUSANAGI S.L. All other trademarks are property of their respective owners.

Licensed under the [MIT License](https://app.kusanagi.io#katana/open-source/license). Redistributions of the source code included in this repository must retain the copyright notice found in each file.
