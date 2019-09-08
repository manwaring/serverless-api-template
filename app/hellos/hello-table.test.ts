import { DynamoDB } from 'aws-sdk';
import { Chance } from 'chance';
import { Hello } from './hello';
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

const del = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({})
});
// @ts-ignore
DynamoDB.DocumentClient.mockImplementation(() => ({ put, scan, delete: del }));

describe('Hello table', () => {
  const TableName = 'HellosTable';
  const ORIGINAL_ENVS = process.env;
  const TABLE_PROPS = { HELLO_TABLE: TableName };
  process.env = { ...ORIGINAL_ENVS, ...TABLE_PROPS };
  const { HelloTable } = require('./hello-table');
  const helloTable = new HelloTable(new DynamoDB.DocumentClient());

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Adds hellos', async () => {
    const message = chance.paragraph();
    const hello = new Hello({ message }, true);
    await helloTable.add(hello);
    expect(put).toHaveBeenCalledWith({ TableName, Item: hello });
  });

  it('Gets all hellos', async () => {
    const response = await helloTable.getAll();
    expect(response).toEqual([mockItem]);
    expect(scan).toHaveBeenCalledWith({ TableName });
  });

  it('Deletes hello', async () => {
    const id = chance.guid();
    await helloTable.del(id);
    expect(del).toHaveBeenCalledWith({ TableName, Key: { id } });
  });
});
