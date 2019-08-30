import 'source-map-support/register';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { helloTable } from './hello-table';

/**
 * @swagger
 * /hellos:
 *  delete:
 *    description: Delete a hello message
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Hello messages
 */
export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    await helloTable.delete(path.id);
    success();
  } catch (err) {
    error(err);
  }
});
