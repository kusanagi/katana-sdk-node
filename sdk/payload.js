'use strict';

const Request = require('./request');
const Response = require('./response');
const Action = require('./action');

module.exports = {
  getRequestResponse(request) {
    return {
      command_reply: {
        name: 'test',
        response: {
          call: {
            service: request.getServiceName(),
            version: request.getServiceVersion(),
            action: request.getActionName()
          }
        }
      }
    };
  },

  getResponseResponse(response) {
    const message = {
      command_reply: {
        name: 'test',
        response: {
          response: {
            version: response.getProtocolVersion(),
            status: response.getStatus(),
            body: response.getBody()
          }
        }
      }
    };

    if (response.getHeaders()) {
      message.command_reply.response.response.headers = response.getHeaders();
    }

    return message;
  },

  getActionResponse(action) {
    const transport = action._getTransport();

    const message = {
      command_reply: {
        name: 'example',
        result: {
          transport
        }
      }
    };

    return message;
  },

  getResponse(api) {
    if (api instanceof Request) {
      return this.getRequestResponse(api);
    } else if (api instanceof Response) {
      return this.getResponseResponse(api);
    } else if (api instanceof Action) {
      return this.getActionResponse(api);
    }
  }
};
