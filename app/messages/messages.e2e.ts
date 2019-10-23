import { post, get, del } from 'request-promise-native';
import { Chance } from 'chance';
import { getOutput } from 'serverless-plugin-test-helper';

describe('Messages CRUD', () => {
  const CDN_URL = `${getOutput('CloudFrontEndpoint')}/messages`;
  const chance = new Chance();
  let message;

  it('Saves message', async () => {
    const text = chance.paragraph();
    const author = chance.name();
    message = await post(CDN_URL, { body: { text, author }, json: true });
    expect(message).toHaveProperty('id');
    expect(message).toHaveProperty('text');
    expect(message).toHaveProperty('author');
    expect(message.text).toEqual(text);
    expect(message.author).toEqual(author);
  });

  it('Gets messages', async () => {
    const messages = await get(CDN_URL, { json: true });
    expect(messages).toBeInstanceOf(Array);
    expect(messages.length).toBeGreaterThan(0);
    const messageResponse = messages.find(mes => mes.id === message.id);
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
