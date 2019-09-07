import { post, get, del } from 'request-promise-native';
import { Chance } from 'chance';
import { getDeployedUrl } from 'serverless-plugin-test-helper';

describe('Hello CRUD', () => {
  const URL = `${getDeployedUrl()}/hellos`;
  const chance = new Chance();
  let hello;

  it('Saves hello', async () => {
    const message = chance.paragraph();
    hello = await post(URL, { body: { message }, json: true });
    expect(hello).toHaveProperty('id');
    expect(hello).toHaveProperty('message');
    expect(hello.message).toBe(message);
  });

  it('Gets hellos', async () => {
    const hellos = await get(URL, { json: true });
    expect(hellos).toBeInstanceOf(Array);
    expect(hellos).toHaveLength(1);
    const helloResponse = hellos[0];
    expect(helloResponse).toHaveProperty('id');
    expect(helloResponse).toHaveProperty('message');
    expect(helloResponse).toEqual(hello);
  });

  it('Deletes hello', async () => {
    const response = await del(`${URL}/${hello.id}`);
  });

  it('Gets hellos after delete', async () => {
    const hellos = await get(URL, { json: true });
    expect(hellos).toBeInstanceOf(Array);
    expect(hellos).toHaveLength(0);
  });
});
