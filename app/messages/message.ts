import { v4 } from 'uuid';

/**
 * @swagger
 *    definitions:
 *      Message:
 *        type: object
 *        required:
 *          -
 *        properties:
 *          id:
 *            type: string
 *          message:
 *            type: string
 *          test:
 *            type: boolean
 *
 */

export class Message {
  id: string;
  text: string;
  test: boolean;

  constructor(body: any, test: boolean = false) {
    this.id = v4();
    this.text = body.text;
    this.test = test;
  }
}
