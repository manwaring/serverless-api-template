import 'source-map-support/register';
import { wrapper } from '@manwaring/lambda-wrapper';
import { Message } from './message';
import { messagesTable } from './table';

const records = require('../../snapshot-data/messages-10-18-2019.json');

export const handler = wrapper(async ({ success, error }) => {
  try {
    for (const record of records) {
      const message = new Message(record);
      await messagesTable.add(message);
    }
    success(`Successfully loaded ${records.length} messages from snapshot data`);
  } catch (err) {
    error(err);
  }
});
