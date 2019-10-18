import { post, get, del } from 'request-promise-native';
import { Chance } from 'chance';
import { getOutput } from 'serverless-plugin-test-helper';

describe('Messages CRUD', () => {
  const CDN_URL = `${getOutput('CloudFrontEndpoint')}/messages`;
  const chance = new Chance();
  let message;

  it('Saves message', async () => {
    const text = chance.paragraph();
    message = await post(CDN_URL, { body: { message }, json: true });
    expect(message).toHaveProperty('id');
    expect(message).toHaveProperty('message');
    expect(message.text).toBe(text);
  });

  it('Gets messages', async () => {
    const messages = await get(CDN_URL, { json: true });
    expect(messages).toBeInstanceOf(Array);
    expect(messages).toHaveLength(1);
    const messageResponse = messages[0];
    expect(messageResponse).toHaveProperty('id');
    expect(messageResponse).toHaveProperty('message');
    expect(messageResponse).toEqual(message);
  });

  it('Deletes message', async () => {
    const response = await del(`${CDN_URL}/${message.id}`);
  });

  it('Gets messages after delete', async () => {
    const messages = await get(CDN_URL, { json: true });
    expect(messages).toBeInstanceOf(Array);
    expect(messages).not.toContain(message);
  });
});
