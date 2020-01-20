import { DynamoDB } from 'aws-sdk';
import { CustomError } from 'ts-custom-error';
import { CreateMessageRequest, MessageRecord, MessageResponse } from './message';

const TableName = process.env.MESSAGES_TABLE;
const table = new DynamoDB.DocumentClient({ region: process.env.REGION, apiVersion: '2012-08-10' });

export async function add(createMessageRequest: CreateMessageRequest): Promise<MessageResponse> {
  const Item = createMessageRequest.toMessageRecord();
  console.log('Adding message', Item);
  await table.put({ TableName, Item }).promise();
  return Item.toMessageResponse();
}

export async function getAll(): Promise<MessageResponse[]> {
  console.log('Getting all messages');
  const res = await table.scan({ TableName }).promise();
  return res.Items.map(item => new MessageRecord(item).toMessageResponse());
}

export async function get(id: string): Promise<MessageResponse> {
  console.log('Getting message with id', id);
  const res = await table.get({ TableName, Key: { id } }).promise();
  if (!res.Item) {
    throw new RecordNotFoundError();
  }
  return new MessageRecord(res.Item).toMessageResponse();
}

export async function update(createMessageRequest: CreateMessageRequest): Promise<MessageResponse> {
  try {
    // Do a conditional delete on there being an object with the specified ID - if the conditional check fails it indicates that the record didn't exist
    console.log('Updating message', createMessageRequest);
    const Item = createMessageRequest.toMessageRecord();
    const ConditionExpression = 'id = :id';
    const ExpressionAttributeValues = { ':id': Item.id };
    await table.put({ TableName, Item, ConditionExpression, ExpressionAttributeValues }).promise();
    return Item.toMessageResponse();
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      throw new RecordNotFoundError();
    } else {
      throw err;
    }
  }
}

export async function del(id: string): Promise<any> {
  try {
    // Do a conditional delete on there being an object with the specified ID - if the conditional check fails it indicates that the record didn't exist
    console.log('Deleting message with id', id);
    const ConditionExpression = 'id = :id';
    const ExpressionAttributeValues = { ':id': id };
    await table.delete({ TableName, Key: { id }, ConditionExpression, ExpressionAttributeValues }).promise();
    return;
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      throw new RecordNotFoundError();
    } else {
      throw err;
    }
  }
}

export class RecordNotFoundError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}
