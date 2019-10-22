import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { Message } from './message';
import { messagesTable } from './table';

/**
 * @swagger
 * /messages/{id}:
 *  put:
 *    summary: Update message
 *    description: Updates and returns the given message
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/definitions/CreateMessageRequest'
 *    responses:
 *      200:
 *        description: The updated message
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/definitions/MessageResponse'
 */
export const handler = api(async ({ body, success, error, testRequest }) => {
  try {
    const message = new Message(body, testRequest);
    await messagesTable.update(message);
    success(message);
  } catch (err) {
    error(err);
  }
});
