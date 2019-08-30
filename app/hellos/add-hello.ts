import 'source-map-support/register';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
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
export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const hello = new Hello(body);
    await helloTable.add(hello);
    success(hello);
  } catch (err) {
    error(err);
  }
});
