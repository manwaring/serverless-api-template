import { DynamoDB } from 'aws-sdk';
import { CreateMessageRequest } from './message';
import { validUpdateMessage } from './sample-data/dynamic-messages';

// Mock out the DynamoDB.DocumentClient calls
jest.mock('aws-sdk');
const mockCreateRequest = new CreateMessageRequest(validUpdateMessage);
const mockRecord = mockCreateRequest.toMessageRecord();
const scan = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({ Items: [mockRecord] })
});
const put = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({ mockRecord })
});
const get = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({ Item: mockRecord })
});
const del = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({})
});
// @ts-ignore
DynamoDB.DocumentClient.mockImplementation(() => ({ put, scan, get, delete: del }));

describe('Message table', () => {
  const TableName = 'MessagesTable';
  const ORIGINAL_ENVS = process.env;
  const TABLE_PROPS = { MESSAGES_TABLE: TableName };
  process.env = { ...ORIGINAL_ENVS, ...TABLE_PROPS };
  const { MessagesTable } = require('./table');
  const messagesTable = new MessagesTable(new DynamoDB.DocumentClient());

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Adds message', async () => {
    await messagesTable.add(mockCreateRequest);
    expect(put).toHaveBeenCalledWith({ TableName, Item: mockRecord });
  });

  it('Gets all messages', async () => {
    const response = await messagesTable.getAll();
    expect(response).toEqual([mockRecord]);
    expect(scan).toHaveBeenCalledWith({ TableName });
  });

  it('Gets message by id', async () => {
    const response = await messagesTable.get(mockRecord.id);
    expect(response).toEqual(mockRecord);
    expect(get).toHaveBeenCalledWith({ TableName, Key: { id: mockRecord.id } });
  });

  it('Updates a message', async () => {
    const response = await messagesTable.update(mockCreateRequest);
    expect(response).toEqual(mockRecord.toMessageResponse());
    expect(put).toHaveBeenCalledWith({ TableName, Item: mockRecord });
  });

  it('Deletes message', async () => {
    const id = mockCreateRequest.id;
    await messagesTable.del(id);
    expect(del).toHaveBeenCalledWith({ TableName, Key: { id } });
  });
});
