import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { Hello } from './hello';
import { helloTable } from './hello-table';

/**
 * @swagger
 * /hellos:
 *  post:
 *    description: Add a new hello message
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Hello messages
 */
export const handler = api(async ({ body, testRequest, success, error }) => {
  try {
    const hello = new Hello(body, testRequest);
    await helloTable.add(hello);
    success(hello);
  } catch (err) {
    error(err);
  }
});
