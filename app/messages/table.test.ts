import { DynamoDB } from 'aws-sdk';
import { Chance } from 'chance';
import { Message } from './message';
jest.mock('aws-sdk');

const chance = new Chance();

const mockItem = {
  id: chance.guid(),
  message: chance.paragraph(),
  test: chance.bool()
};
const scan = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    Items: [mockItem]
  })
});
const put = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({})
});
const get = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    Item: mockItem
  })
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
    const text = chance.paragraph();
    const message = new Message({ text }, true);
    await messagesTable.add(message);
    expect(put).toHaveBeenCalledWith({ TableName, Item: message });
  });

  it('Gets all messages', async () => {
    const response = await messagesTable.getAll();
    expect(response).toEqual([mockItem]);
    expect(scan).toHaveBeenCalledWith({ TableName });
  });

  it('Gets message by id', async () => {
    const response = await messagesTable.get(mockItem.id);
    expect(response).toEqual(mockItem);
    expect(get).toHaveBeenCalledWith({ TableName, Key: { id: mockItem.id } });
  });

  it('Updates a message', async () => {
    const response = await messagesTable.update(mockItem);
    expect(response).toEqual(mockItem);
    expect(put).toHaveBeenCalledWith({ TableName, Item: mockItem });
  });

  it('Deletes message', async () => {
    const id = chance.guid();
    await messagesTable.del(id);
    expect(del).toHaveBeenCalledWith({ TableName, Key: { id } });
  });
});
