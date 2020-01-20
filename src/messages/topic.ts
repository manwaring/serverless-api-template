import { SNS } from 'aws-sdk';

const TopicArn = process.env.INVALIDATE_CACHE_TOPIC;
const sns = new SNS({
  region: process.env.REGION,
  apiVersion: '2010-03-31'
});

export class CacheInvalidationTopic {
  constructor(private sns: SNS) {}

  publishCacheInvalidationRequest(): Promise<any> {
    const params = { Message: 'Invalidate CDN', TopicArn };
    console.log('Publishing cache invalidation request with params', params);
    return this.sns.publish(params).promise();
  }
}

const topic = new CacheInvalidationTopic(sns);

export const publishCacheInvalidationRequest = topic.publishCacheInvalidationRequest;
