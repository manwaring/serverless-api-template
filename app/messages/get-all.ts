import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { messagesTable } from './table';

/**
 * @swagger
 * /messages:
 *  get:
 *    description: Get all messages
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Messages
 */
export const handler = api(async ({ success, error }) => {
  try {
    const messages = await messagesTable.getAll();
    success(messages);
  } catch (err) {
    error(err);
  }
});
