import { v4 } from 'uuid';

/**
 * @swagger
 *    definitions:
 *      MessageResponse:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          text:
 *            type: string
 *          author:
 *            type: string
 *          test:
 *            type: boolean
 *
 *      CreateMessageRequest:
 *        type: object
 *        required:
 *          - text
 *          - author
 *        properties:
 *          text:
 *            type: string
 *          author:
 *            type: string
 *          test:
 *            type: boolean
 */

export class Message {
  id: string;
  text: string;
  author: string;
  test: boolean;

  constructor(body: any, test: boolean = false) {
    this.id = v4();
    this.text = body.text;
    this.author = body.author;
    this.test = test;
  }
}
