# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
## Changed
- Adapted logger for katana 2

## Fixed
- Fix array parameter parse

## [2.0.0] - 2018-03-01
## Added
- Support for transport API

## Changed
- Move primary key to the schema entity

## [1.2.3] - 2017-09-07
## Fixed
- Fix error in response.setHeader when no other headers are present

## [1.2.2] - 2017-09-07
## Fixed
- Fix error in response.setHeader adding wrong type of value

## Added
- getHeaderArray and getHeadersArray on httpResponse

## [1.2.1] - 2017-09-06
## Fixed
- Fix error in actionschema object.keys

## Added
- Fix Travis badge link

## [1.2.0] - 2017-09-01
## Added
- Support for `katana 1.2`

## Fixed
- Update links

## [1.1.10] - 2017-08-30
## Added
- Support for Param type object

## [1.1.9] - 2017-08-30
## Fixed
- Fix #30
- Fixed action/response.getTransport() to return copied freezed objects

## [1.1.8] - 2017-08-28
## Fixed
- Fixed transport.getData() to return empty array on empty data
- Fixed ActionSchema.getFiles()

## Added
- Added request.getId() and getTimestamp()
- More unit tests
- Added getHeadersArray() and getHeaderArray()
- Added better control to private object and method access
- Added Transport freezing to avoid KATANA unhandled failures

## [1.1.7] - 2017-08-18
## Fixed
- Added request.done() handler to child responses to avoid async issues

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
