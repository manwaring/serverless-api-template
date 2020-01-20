import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { del, RecordNotFoundError } from './table';

/**
 *  @swagger
 *  paths:
 *    /messages/{id}:
 *      delete:
 *        summary: Delete message
 *        description: Deletes the message with specified ID
 *        parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the message to delete
 *            schema:
 *              type: string
 *        responses:
 *          200:
 *            description: Success response
 */
export const handler = api(async ({ path, success, notFound, error }) => {
  try {
    await del(path.id);
    return success();
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      return notFound();
    } else {
      return error(err);
    }
  }
});
