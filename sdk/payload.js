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
