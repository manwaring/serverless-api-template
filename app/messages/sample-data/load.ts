import 'source-map-support/register';
import { wrapper } from '@manwaring/lambda-wrapper';
import { CreateMessageRequest } from '../message';
import { messagesTable } from '../table';

const records = require('./valid-messages.json');

export const handler = wrapper(async ({ success, error }) => {
  try {
    for (const record of records) {
      const message = new CreateMessageRequest(record);
      await messagesTable.add(message);
    }
    success(`Successfully loaded ${records.length} messages from snapshot data`);
  } catch (err) {
    error(err);
  }
});
