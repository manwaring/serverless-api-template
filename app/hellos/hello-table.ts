import { DynamoDB } from 'aws-sdk';
import { Hello } from './hello';

const TableName = process.env.HELLO_TABLE;
const client = new DynamoDB.DocumentClient({ region: process.env.REGION, apiVersion: '2012-08-10' });

export class HelloTable {
  constructor(private table: DynamoDB.DocumentClient) {}

  add(Item: Hello): Promise<any> {
    console.log('Adding hello', Item);
    return this.table.put({ TableName, Item }).promise();
  }

  async getAll(): Promise<Hello[]> {
    console.log('Getting all hellos');
    const res = await this.table.scan({ TableName }).promise();
    return <Hello[]>res.Items;
  }

  delete(id: string): Promise<any> {
    console.log('Deleting hello with id', id);
    return this.table.delete({ TableName, Key: { id } }).promise();
  }
}

export const helloTable = new HelloTable(client);
