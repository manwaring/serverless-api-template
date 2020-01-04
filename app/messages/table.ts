import { DynamoDB } from 'aws-sdk';
import { CreateMessageRequest, MessageRecord, MessageResponse } from './message';

const TableName = process.env.MESSAGES_TABLE;

export class MessagesTable {
  constructor(private table: DynamoDB.DocumentClient) {}

  async add(createMessageRequest: CreateMessageRequest): Promise<MessageResponse> {
    const Item = createMessageRequest.toMessageRecord();
    console.log('Adding message', Item);
    await this.table.put({ TableName, Item }).promise();
    return Item.toMessageResponse();
  }

  async getAll(): Promise<MessageResponse[]> {
    console.log('Getting all messages');
    const res = await this.table.scan({ TableName }).promise();
    // @ts-ignore
    return res.Items.map(item => new MessageRecord(item).toMessageResponse());
  }

  async get(id: string): Promise<MessageResponse> {
    console.log('Getting message with id', id);
    const res = await this.table.get({ TableName, Key: { id } }).promise();
    // @ts-ignore
    return new MessageRecord(res.Item).toMessageResponse();
  }

  async update(createMessageRequest: CreateMessageRequest): Promise<MessageResponse> {
    const Item = createMessageRequest.toMessageRecord();
    console.log('Updating message', Item);
    await this.table.put({ TableName, Item }).promise();
    return Item.toMessageResponse();
  }

  del(id: string): Promise<any> {
    console.log('Deleting message with id', id);
    return this.table.delete({ TableName, Key: { id } }).promise();
  }
}

const client = new DynamoDB.DocumentClient({ region: process.env.REGION, apiVersion: '2012-08-10' });
export const messagesTable = new MessagesTable(client);
