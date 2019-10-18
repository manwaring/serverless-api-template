import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { messagesTable } from './table';

/**
 * @swagger
 * /messages:
 *    delete:
 *      description: Delete a message
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Message
 */
export const handler = api(async ({ path, success, error }) => {
  try {
    await messagesTable.del(path.id);
    success();
  } catch (err) {
    error(err);
  }
});
