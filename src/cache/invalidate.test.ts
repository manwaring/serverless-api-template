import { context, dynamoDBStreamEvent } from 'serverless-plugin-test-helper';

const AWS = require('aws-sdk');
jest.mock('aws-sdk', () => ({
  CloudFront: jest.fn(() => ({
    createInvalidation: jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve({}) }))
  }))
}));

describe('Invalidate CDN', () => {
  const ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = ENV;
    console.log = jest.fn();
  });

  it('Successfully invalidates when CDN is present', async () => {
    process.env = { ...process.env, CLOUDFRONT: 'this is cloudfront' };
    const { handler } = require('./invalidate');
    const event = dynamoDBStreamEvent();
    const response = await handler(event, context);

    expect(response).toEqual('Successfully invalidated CDN');
  });

  it('Successfully ignores when no CDN is present', async () => {
    const { handler } = require('./invalidate');
    const event = dynamoDBStreamEvent();
    const response = await handler(event, context);

    expect(response).toEqual('No CDN to invalidate');
  });
});
