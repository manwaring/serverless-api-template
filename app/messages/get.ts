import 'source-map-support/register';
import { api, ApiSignature } from '@manwaring/lambda-wrapper';
import { messagesTable } from './table';

/**
 *  @swagger
 *  paths:
 *    /messages/{id}:
 *      get:
 *        summary: Get message
 *        description: Get message by ID
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID of the message to get
 *        responses:
 *          200:
 *            description: The specified message
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/MessageResponse'
 */

export const handler = api(async ({ path, success, error }: ApiSignature) => {
  try {
    const trainer = await messagesTable.get(path.id);
    success(trainer);
  } catch (err) {
    error(err);
  }
});
