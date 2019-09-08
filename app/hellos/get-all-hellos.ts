import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { helloTable } from './hello-table';

/**
 * @swagger
 * /hellos:
 *  get:
 *    description: Get all hello messages
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Hello messages
 */
export const handler = api(async ({ success, error }) => {
  try {
    const hellos = await helloTable.getAll();
    success(hellos);
  } catch (err) {
    error(err);
  }
});
