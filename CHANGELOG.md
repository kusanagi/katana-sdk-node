# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.6] - 2017-08-03
## Fixed
- Improve param schema retrieval
- Refactor transport set methods to pseudo private

## Added
- Added this changelog file to repository

## [1.1.5] - 2017-07-27
## Fixed
- Add number parsing to getValue to avoid always getting Strings
- Improve test coverage for getParam

## [1.1.4] - 2017-07-26
## Fixed
- Remove unnecessary list creation on setData

## [1.1.3] - 2017-07-26
## Fixed
- Fix eslint rule break

## [1.1.2] - 2017-07-25
## Note
- Version 1.1.1 was skipped due to technical issues with npm build tool

## Fixed
- Remove Action.has_return() since not specified
- Fix param handling in payload for request
- Correct return value implementation
- Remove return methods not present in the spec for Action
- Check if headers exist before returning them
- Check if headers exist before returning them
- Parse HTTP status text correctly
- Parse response data from the right part of the payload
- Avoid sending Inmutable Lists as results of getHeader

## Added
- Add a guard clause
- Add semver check to getServiceSchema

## [1.1.0] - 2017-06-02
## Fixed
- Response.setReturn() wasn't actually setting the return value

## Added
- Add support for service call duration tracking
- Enable standalone action execution from the CLI
- Add Action.getReturn()

## [1.0.0] - 2017-05-31
- Initial release
