import { DynamoDB } from 'aws-sdk';
import { Message } from './message';

const TableName = process.env.MESSAGES_TABLE;
const client = new DynamoDB.DocumentClient({ region: process.env.REGION, apiVersion: '2012-08-10' });

export class MessagesTable {
  constructor(private table: DynamoDB.DocumentClient) {}

  add(Item: Message): Promise<any> {
    console.log('Adding message', Item);
    return this.table.put({ TableName, Item }).promise();
  }

  async getAll(): Promise<Message[]> {
    console.log('Getting all messages');
    const res = await this.table.scan({ TableName }).promise();
    return <Message[]>res.Items;
  }

  async get(id: string): Promise<Message> {
    console.log('Getting message with id', id);
    const res = await this.table.get({ TableName, Key: { id } }).promise();
    return <Message>res.Item;
  }

  async update(Item: Message): Promise<Message> {
    console.log('Updating message', Item);
    await this.table.put({ TableName, Item }).promise();
    return Item;
  }

  del(id: string): Promise<any> {
    console.log('Deleting message with id', id);
    return this.table.delete({ TableName, Key: { id } }).promise();
  }
}

export const messagesTable = new MessagesTable(client);
