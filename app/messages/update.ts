import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { CreateMessageRequest } from './message';
import { messagesTable } from './table';
import { validateOrReject, ValidationError } from 'class-validator';

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
    const message = await messagesTable.update(createMessageRequest);
    success(message);
  } catch (err) {
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
      invalid(err);
    } else {
      error(err);
    }
  }
});
