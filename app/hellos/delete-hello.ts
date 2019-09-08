import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
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
export const handler = api(async ({ path, success, error }) => {
  try {
    await helloTable.del(path.id);
    success();
  } catch (err) {
    error(err);
  }
});
