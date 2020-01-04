import { v4 } from 'uuid';
import { NonFunctionKeys } from 'utility-types';
import { IsString } from 'class-validator';

/**
 *  @swagger
 *  components:
 *    schemas:
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
 */

export class CreateMessageRequest {
  id?: string;

  @IsString()
  text: string;

  @IsString()
  author: string;

  constructor(init: Pick<CreateMessageRequest, NonFunctionKeys<CreateMessageRequest>>) {
    this.id = v4();
    this.text = init.text;
    this.author = init.author;
  }

  toMessageRecord(): MessageRecord {
    return new MessageRecord(this);
  }
}

export class MessageRecord {
  id?: string;
  text: string;
  author: string;
  constructor(init: Pick<MessageRecord, NonFunctionKeys<MessageRecord>>) {
    this.id = init.id;
    this.text = init.text;
    this.author = init.author;
  }

  toMessageResponse(): MessageResponse {
    return new MessageResponse(this);
  }
}

/**
 *  @swagger
 *  components:
 *    schemas:
 *      MessageResponse:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          text:
 *            type: string
 *          author:
 *            type: string
 */
export class MessageResponse {
  id?: string;
  text: string;
  author: string;
  constructor(init: Pick<MessageResponse, NonFunctionKeys<MessageResponse>>) {
    this.id = init.id;
    this.text = init.text;
    this.author = init.author;
  }
}
