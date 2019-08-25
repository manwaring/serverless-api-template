import { Given, When, Then } from 'cucumber';
import { ApiSignature } from '@manwaring/lambda-wrapper';
import { expect } from 'chai';
import { handler } from './hello';

Given('an http request', () => {
  this.request = {};
});

When('the hello handler is invoked', () => {
  const success = response => JSON.stringify(response);
  const error = response => JSON.stringify(response);
  const invalid = response => JSON.stringify(response);
  const redirect = response => JSON.stringify(response);
  const body = {};
  const path = {};
  const query = {};
  const headers = {};
  const testRequest = false;
  const auth = {};

  const signature: ApiSignature = {
    event: this.request,
    success,
    error,
    body,
    path,
    query,
    headers,
    testRequest,
    auth,
    invalid,
    redirect
  };
  this.response = handler(signature);
});

Then('the hello message is returned', () => {
  expect(this.response).to.not.equal(undefined);
});
