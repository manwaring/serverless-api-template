import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { CreateMessageRequest } from './message';
import { update, RecordNotFoundError } from './table';
import { validateOrReject, ValidationError } from 'class-validator';
import { notFound } from '@manwaring/lambda-wrapper/dist/api/responses';

/**
 *  @swagger
 *  paths:
 *    /messages/{id}:
 *      put:
 *        summary: Update message
 *        description: Updates and returns the given message
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID of the message to update
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreateMessageRequest'
 *        responses:
 *          200:
 *            description: The updated message
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/MessageResponse'
 */
export const handler = api(async ({ body, success, invalid, error }) => {
  try {
    const createMessageRequest = new CreateMessageRequest(body);
    await validateOrReject(createMessageRequest, { validationError: { target: false }, forbidNonWhitelisted: true });
    const message = await update(createMessageRequest);
    return success(message);
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      return notFound();
    } else if (isValidationError(err)) {
      return invalid(err);
    } else {
      return error(err);
    }
  }
});

function isValidationError(err: any) {
  return Array.isArray(err) && err[0] instanceof ValidationError;
}
