import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { messagesTable } from './table';

/**
 *  @swagger
 *  paths:
 *    /messages:
 *      get:
 *        summary: Get all messages
 *        description: Retreives all messages (doesn't currently handle database pagination and so may truncate large result sets)
 *        responses:
 *          200:
 *            description: Array of messages
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/MessageResponse'
 */
export const handler = api(async ({ success, error }) => {
  try {
    const messages = await messagesTable.getAll();
    success(messages);
  } catch (err) {
    error(err);
  }
});
