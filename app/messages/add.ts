import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { Message } from './message';
import { messagesTable } from './table';

/**
 * @swagger
 * /messages:
 *  post:
 *    description: Add a new message
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Messages
 */
export const handler = api(async ({ body, testRequest, success, error }) => {
  try {
    const message = new Message(body, testRequest);
    await messagesTable.add(message);
    success(message);
  } catch (err) {
    error(err);
  }
});
