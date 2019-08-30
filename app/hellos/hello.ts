import * as v4 from 'uuid/v4';

export class Hello {
  id: string;
  message: string;

  constructor(body: any) {
    this.id = v4();
    this.message = body.message;
  }
}
