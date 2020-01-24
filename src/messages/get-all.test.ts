import { context, apiGatewayEvent } from 'serverless-plugin-test-helper';
import { validMessageRecord as mockRecord } from './sample-data/dynamic-messages';

const AWS = require('aws-sdk');
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      scan: jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve({ Items: [mockRecord] }) }))
    }))
  }
}));

describe('Get all messages', () => {
  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Successfully returns all messages', async () => {
    const { handler } = require('./get-all');
    const event = apiGatewayEvent();
    const response = await handler(event, context);

    expect(response.statusCode).toBe(200);
  });

  it('Returns error response for unhandled errors', async () => {
    jest.mock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          scan: jest.fn().mockImplementation(() => ({
            promise: () => {
              throw new Error();
            }
          }))
        }))
      }
    }));
    const { handler } = require('./get-all');
    const event = apiGatewayEvent();
    const response = await handler(event, context);

    expect(response.statusCode).toBe(500);
  });
});
