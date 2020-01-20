import { Chance } from 'chance';
import { NonFunctionKeys } from 'utility-types';
import { v4 } from 'uuid';
import { CreateMessageRequest, MessageRecord } from '../message';

const chance = new Chance();

export const validCreateMessage: Pick<CreateMessageRequest, NonFunctionKeys<CreateMessageRequest>> = {
  text: chance.paragraph(),
  author: `${chance.first()} ${chance.last()}`
};

export const validUpdateMessage: Pick<CreateMessageRequest, NonFunctionKeys<CreateMessageRequest>> = {
  id: v4(),
  text: chance.paragraph(),
  author: `${chance.first()} ${chance.last()}`
};

export const validMessageRecord: Pick<MessageRecord, NonFunctionKeys<MessageRecord>> = {
  id: v4(),
  text: chance.paragraph(),
  author: `${chance.first()} ${chance.last()}`
};

export const invalidCreateMessage = {
  text: chance.bool() ? chance.integer() : chance.bool(),
  author: ''
};
