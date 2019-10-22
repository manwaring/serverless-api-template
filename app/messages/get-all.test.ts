import createEvent from '@serverless/event-mocks';
import { context } from 'serverless-plugin-test-helper';
import { Chance } from 'chance';

const chance = new Chance();

describe('Get all messages', () => {
  // @ts-ignore
  const event = createEvent('aws:apiGateway', {
    headers: { 'content-type': 'application/json', 'Test-Request': 'true' }
  });
  const callback = jest.fn((err, result) => (err ? new Error(err) : result));

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Success handled correctly', async () => {
    const mockMessage = { id: chance.guid(), message: chance.paragraph() };
    const mockGetAll = jest.fn(() => [mockMessage]);
    jest.mock('./table', () => ({ messagesTable: { getAll: mockGetAll } }));
    const { handler } = require('./get-all');

    await handler(event, context, callback);
    expect(callback).not.toThrow();
  });

  it('Errors handled correctly', async () => {
    jest.mock('./table', () => ({
      messagesTable: {
        getAll: jest.fn(() => {
          throw new Error('error');
        })
      }
    }));
    const { handler } = require('./get-all');

    await handler(event, context, callback);
    expect(callback).toHaveBeenCalledWith(new Error('error'));
  });
});
