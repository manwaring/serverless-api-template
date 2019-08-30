import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import { Chance } from 'chance';
import createEvent from '@serverless/event-mocks';
import { handler } from './get-all-hellos';

const chance = new Chance();

Given('a valid add hello request', function() {
  const headers = {
    'Test-Request': 'true',
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify({ message: chance.sentence({ words: 10 }) });
  // @ts-ignore
  this.request = createEvent('aws:apiGateway', { headers, body });
});

When('the add hello handler is invoked', function() {
  const event = this.request;
  this.response = handler(event);
});

Then('the hello message is returned', function() {
  console.log(this.response);
  expect(this.response).to.not.equal(undefined);
});
