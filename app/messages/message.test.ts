import { Chance } from 'chance';
import { Message } from './message';

const chance = new Chance();

describe('Message', () => {
  it('Valid properties are set correctly', async () => {
    const text = chance.paragraph();
    const message = new Message({ text }, true);
    expect(typeof message.id).toEqual('string');
    expect(message.text).toEqual(text);
    expect(message.test).toEqual(true);
  });

  it('Invalid properties are ignored', async () => {
    const text = chance.paragraph();
    const recipient = chance.name();
    const message = new Message({ text, recipient }, true);
    expect(typeof message.id).toEqual('string');
    expect(message.text).toEqual(text);
    expect(message.test).toEqual(true);
    // @ts-ignore
    expect(message.recipient).toBeFalsy();
  });
});
