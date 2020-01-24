import { context, apiGatewayEvent } from 'serverless-plugin-test-helper';

const AWS = require('aws-sdk');
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      delete: jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve({}) }))
    }))
  }
}));

describe('Deletes message', () => {
  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Successfully deletes specified message', async () => {
    const { handler } = require('./delete');
    const event = apiGatewayEvent({ pathParameters: { id: 'id' } });
    const response = await handler(event, context);

    expect(response && response.statusCode).toBe(200);
  });

  it('Returns not found response when item not found', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          delete: jest.fn().mockImplementation(() => ({
            promise: () => {
              throw { code: 'ConditionalCheckFailedException' };
            }
          }))
        }))
      }
    }));
    const { handler } = require('./delete');
    const event = apiGatewayEvent({ pathParameters: { id: 'id' } });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(404);
  });

  it('Returns error response when unhandled error', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          delete: jest.fn().mockImplementation(() => ({
            promise: () => {
              throw new Error();
            }
          }))
        }))
      }
    }));
    const { handler } = require('./delete');
    const event = apiGatewayEvent({ pathParameters: { id: 'id' } });
    const response = await handler(event, context);

    expect(response.statusCode).toBe(500);
  });
});
