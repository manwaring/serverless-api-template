import 'source-map-support/register';
import { wrapper } from '@manwaring/lambda-wrapper';
import { Message } from './message';
import { messagesTable } from './table';

const snapshotRecords = require('../../snapshot-data/messages-10-18-2019.json');

export const handler = wrapper(async ({ success, error }) => {
  try {
    const records = JSON.parse(snapshotRecords);
    for (const record of records) {
      const message = new Message(record);
      await messagesTable.add(message);
    }
    success('Successfully loaded snapshot message data');
  } catch (err) {
    error(err);
  }
});
