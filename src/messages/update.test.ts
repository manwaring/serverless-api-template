import { context, apiGatewayEvent } from 'serverless-plugin-test-helper';
import { validCreateMessage, invalidCreateMessage } from './sample-data/dynamic-messages';

const AWS = require('aws-sdk');
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve({}) }))
    }))
  }
}));
const headers = { 'content-type': 'application/json' };
const pathParameters = { id: 'id' };
describe('Add message', () => {
  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Return success response for valid add message request', async () => {
    const { handler } = require('./update');
    const event = apiGatewayEvent({ pathParameters, headers, body: JSON.stringify(validCreateMessage) });
    const response = await handler(event, context);

    expect(response.statusCode).toEqual(200);
    const message = JSON.parse(response.body);
    expect(message.text).toEqual(validCreateMessage.text);
    expect(message.author).toEqual(validCreateMessage.author);
    expect(typeof message.id).toBe('string');
  });

  it('Returns invalid response for invalid add message request', async () => {
    const { handler } = require('./update');
    const event = apiGatewayEvent({
      pathParameters,
      headers,
      body: JSON.stringify(invalidCreateMessage)
    });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(400);
  });

  it('Returns not found response when item not found', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          put: jest.fn().mockImplementation(() => ({
            promise: () => {
              throw { code: 'ConditionalCheckFailedException' };
            }
          }))
        }))
      }
    }));
    const { handler } = require('./update');
    const event = apiGatewayEvent({ pathParameters, headers, body: JSON.stringify(validCreateMessage) });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(404);
  });

  it('Returns error response for unhandled errors', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          put: jest.fn().mockImplementation(() => ({
            promise: () => {
              throw new Error();
            }
          }))
        }))
      }
    }));
    const { handler } = require('./update');
    const event = apiGatewayEvent({ pathParameters, headers, body: JSON.stringify(validCreateMessage) });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(500);
  });
});
