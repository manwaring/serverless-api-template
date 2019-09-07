// import { Chance } from 'chance';
import { DynamoDB } from 'aws-sdk';
import createEvent from '@serverless/event-mocks';
import { Chance } from 'chance';
import { handler } from './get-all-hellos';

const chance = new Chance();

jest.mock('aws-sdk');
const scan = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    Items: [
      {
        id: chance.guid(),
        message: chance.paragraph()
      }
    ]
  })
});
// @ts-ignore
DynamoDB.DocumentClient.mockImplementation(() => ({ scan }));

describe('Getting all hellos', () => {
  const headers = {
    'Test-Request': 'true'
    // 'Content-Type': 'application/json'
  };
  // @ts-ignore
  const event = createEvent('aws:apiGateway', { headers });

  it('Gets all hellos', () => {
    handler(event);
  });
});
