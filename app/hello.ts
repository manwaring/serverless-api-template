import 'source-map-support/register';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

/**
 * @swagger
 * /hello:
 *  get:
 *    description: Hello world endpoint
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: hello world
 */
export const handler = apiWrapper(async ({ event, success }: ApiSignature) => {
  success({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event
  });
});
