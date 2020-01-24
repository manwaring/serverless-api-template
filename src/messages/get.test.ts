import { context, apiGatewayEvent } from 'serverless-plugin-test-helper';
import { validMessageRecord as mockRecord } from './sample-data/dynamic-messages';

const AWS = require('aws-sdk');
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve({ Item: mockRecord }) }))
    }))
  }
}));

describe('Gets message', () => {
  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Successfully returns specified message', async () => {
    const { handler } = require('./get');
    const event = apiGatewayEvent({ pathParameters: { id: 'id' } });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(200);
  });

  it('Returns not found response when item not found', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          get: jest.fn().mockImplementation(() => ({
            promise: () => Promise.resolve({ Item: undefined })
          }))
        }))
      }
    }));
    const { handler } = require('./get');
    const event = apiGatewayEvent({ pathParameters: { id: 'id' } });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(404);
  });

  it('Returns error response when unhandled error', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          get: jest.fn().mockImplementation(() => ({
            promise: () => {
              throw new Error();
            }
          }))
        }))
      }
    }));
    const { handler } = require('./get');
    const event = apiGatewayEvent({ pathParameters: { id: 'id' } });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(500);
  });
});
