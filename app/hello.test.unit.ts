import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import createEvent from '@serverless/event-mocks';
import { handler } from './hello';

Given('an http request', () => {
  const headers = {
    'Test-Request': 'true'
  };
  // @ts-ignore
  this.request = createEvent('aws:apiGateway', { headers });
});

When('the hello handler is invoked', () => {
  const event = this.request;
  this.response = handler(event);
});

Then('the hello message is returned', () => {
  expect(this.response).to.not.equal(undefined);
});
