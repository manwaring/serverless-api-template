import { post, get, del } from 'request-promise-native';
import { getOutput } from 'serverless-plugin-test-helper';
import { validCreateMessage } from './sample-data/dynamic-messages';

describe('Messages CRUD', () => {
  const CDN_URL = `${getOutput('CloudFrontEndpoint')}/messages`;
  let message;

  it('Saves message', async () => {
    const response = await post(CDN_URL, { body: validCreateMessage, json: true });
    assertMessagePropertiesMatch(response, validCreateMessage);
    message = response;
  });

  it('Gets message', async () => {
    // Allow some time for the cache to clear
    await sleep(4000);
    const response = await get(`${CDN_URL}/${message.id}`, { json: true });
    assertMessagePropertiesMatch(response, validCreateMessage);
  });

  it('Gets messages', async () => {
    // Allow some time for the cache to clear
    await sleep(4000);
    const messages = await get(CDN_URL, { json: true });
    expect(messages).toBeInstanceOf(Array);
    expect(messages.length).toBeGreaterThan(0);
    const messageResponse = messages.find(mes => mes.id === message.id);
    expect(messageResponse).toEqual(message);
  });

  it('Deletes message', async () => {
    await del(`${CDN_URL}/${message.id}`);
  });

  it('Gets messages after delete', async () => {
    // Allow some time for the cache to clear
    await sleep(4000);
    const messages = await get(CDN_URL, { json: true });
    expect(messages).toBeInstanceOf(Array);
    expect(messages).not.toContain(message);
  });

  function assertMessagePropertiesMatch(actual, expected) {
    expect(actual).toHaveProperty('id');
    expect(actual.text).toEqual(expected.text);
    expect(actual.author).toEqual(expected.author);
  }

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
});
