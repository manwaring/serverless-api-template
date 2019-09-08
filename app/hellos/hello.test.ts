import { Chance } from 'chance';
import { Hello } from './hello';

const chance = new Chance();

describe('Hello', () => {
  it('Valid properties are set correctly', async () => {
    const message = chance.paragraph();
    const hello = new Hello({ message }, true);
    expect(typeof hello.id).toEqual('string');
    expect(hello.message).toEqual(message);
    expect(hello.test).toEqual(true);
  });

  it('Invalid properties are ignored', async () => {
    const message = chance.paragraph();
    const recipient = chance.name();
    const hello = new Hello({ message, recipient }, true);
    expect(typeof hello.id).toEqual('string');
    expect(hello.message).toEqual(message);
    expect(hello.test).toEqual(true);
    // @ts-ignore
    expect(hello.recipient).toBeFalsy();
  });
});
