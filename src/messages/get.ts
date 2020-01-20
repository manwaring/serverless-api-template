import 'source-map-support/register';
import { api, ApiSignature } from '@manwaring/lambda-wrapper';
import { get, RecordNotFoundError } from './table';

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

export const handler = api(async ({ path, success, notFound, error }: ApiSignature) => {
  try {
    const trainer = await get(path.id);
    return success(trainer);
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      return notFound();
    } else {
      return error(err);
    }
  }
});
