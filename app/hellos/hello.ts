import * as v4 from 'uuid/v4';

export class Hello {
  id: string;
  message: string;
  testRequest: boolean;

  constructor(body: any, testRequest: boolean) {
    this.id = v4();
    this.message = body.message;
    this.testRequest = testRequest;
  }
}
