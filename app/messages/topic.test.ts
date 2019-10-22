import { SNS } from 'aws-sdk';

jest.mock('aws-sdk');

const publish = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

// @ts-ignore
SNS.mockImplementation(() => ({ publish }));

describe('Cache invalidation topic client', () => {
  const ORIGINAL_ENVS = process.env;
  const TopicArn = 'CacheInvalidationTopic';
  process.env = { ...ORIGINAL_ENVS, ...{ INVALIDATE_CACHE_TOPIC: TopicArn } };

  const { CacheInvalidationTopic } = require('./topic');
  const topic = new CacheInvalidationTopic(new SNS());

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Publishes cache invalidation requests', async () => {
    await topic.publishCacheInvalidationRequest();
    expect(console.log).toHaveBeenCalled();
    expect(publish).toHaveBeenCalledWith({ Message: 'Invalidate CDN', TopicArn });
  });
});
