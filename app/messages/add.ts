import 'source-map-support/register';
import { api } from '@manwaring/lambda-wrapper';
import { CreateMessageRequest } from './message';
import { messagesTable } from './table';
import { validateOrReject, ValidationError } from 'class-validator';

/**
 *  @swagger
 *  paths:
 *    /messages:
 *      post:
 *        summary: Save message
 *        description: Creates and returns a new message
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreateMessageRequest'
 *        responses:
 *          200:
 *            description: The newly created message
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/MessageResponse'
 */
export const handler = api(async ({ body, success, invalid, error }) => {
  try {
    const createMessageRequest = new CreateMessageRequest(body);
    await validateOrReject(createMessageRequest, { validationError: { target: false }, forbidNonWhitelisted: true });
    const messageResponse = await messagesTable.add(createMessageRequest);
    success(messageResponse);
  } catch (err) {
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
      invalid(err);
    } else {
      error(err);
    }
  }
});
