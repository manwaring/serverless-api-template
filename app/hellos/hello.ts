import { v4 } from 'uuid';

export class Hello {
  id: string;
  message: string;
  test: boolean;

  constructor(body: any, test: boolean) {
    this.id = v4();
    this.message = body.message;
    this.test = test;
  }
}
