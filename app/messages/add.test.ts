import createEvent from '@serverless/event-mocks';
import { context } from 'serverless-plugin-test-helper';
import { validCreateMessage } from './sample-data/dynamic-messages';

describe('Add message', () => {
  // @ts-ignore
  const event = createEvent('aws:apiGateway', {
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(validCreateMessage)
  });
  const callback = jest.fn((err, result) => (err ? new Error(err) : result));

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Handles success responses correctly', async () => {
    const mockAdd = jest.fn(() => {});
    jest.mock('./table', () => ({ messagesTable: { add: mockAdd } }));
    const { handler } = require('./add');
    await handler(event, context, callback);
    expect(callback).not.toThrow();
  });

  it('Handles errors correctly', async () => {
    const mockAdd = jest.fn(() => {
      throw new Error('error');
    });
    jest.mock('./table', () => ({ messagesTable: { add: mockAdd } }));
    const { handler } = require('./add');
    await handler(event, context, callback);
    expect(callback).toHaveBeenCalledWith(new Error('error'));
  });
});
