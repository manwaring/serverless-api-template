import { post, get, del } from 'request-promise-native';
import { getOutput, getDeployedUrl } from 'serverless-plugin-test-helper';
import { validCreateMessage } from './sample-data/dynamic-messages';
import { MessageResponse } from './message';

describe('Messages CRUD', () => {
  const CDN_URL = getOutput('CloudFrontEndpoint');
  const URL = `${CDN_URL || getDeployedUrl()}/v1/messages`;
  const options = {
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };
  let message: MessageResponse;

  it('Adds the message', async () => {
    const body = validCreateMessage;
    const response = await post(URL, { body, ...options });
    expect(response.statusCode).toEqual(200);
    assertMessagePropertiesMatch(response.body, validCreateMessage);
    message = response.body;
  });

  it('Gets the message', async () => {
    if (CDN_URL) {
      // Allow some time for the cache to clear
      await sleep(8000);
    }
    const response = await get(`${URL}/${message.id}`, options);
    assertMessagePropertiesMatch(response.body, validCreateMessage);
  }, 12000);

  it('Gets all messages', async () => {
    if (CDN_URL) {
      // Allow some time for the cache to clear
      await sleep(8000);
    }
    const response = await get(URL, options);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    const messageResponse = response.body.find(mes => mes.id === message.id);
    expect(messageResponse).toEqual(message);
  }, 12000);

  it('Deletes message', async () => {
    const response = await del(`${URL}/${message.id}`, options);
    expect(response.statusCode).toEqual(200);
  });

  it('Message no longer found', async () => {
    if (CDN_URL) {
      // Allow some time for the cache to clear
      await sleep(8000);
    }
    const response = await get(`${URL}/${message.id}`, options);
    expect(response.statusCode).toEqual(404);
  }, 12000);

  it('Gets all messages after delete', async () => {
    if (CDN_URL) {
      // Allow some time for the cache to clear
      await sleep(8000);
    }
    const messages = await get(URL, options);
    expect(messages.body).toBeInstanceOf(Array);
    expect(messages.body).not.toContain(message);
  }, 12000);

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
