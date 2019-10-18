import { CloudFront } from 'aws-sdk';

const DistributionId = process.env.API_CLOUDFRONT;
const cloudfront = new CloudFront({ apiVersion: '2016-11-25' });

export class CDN {
  constructor(private cloudfront: CloudFront) {}

  invalidateCache(): Promise<any> {
    const params = {
      DistributionId,
      InvalidationBatch: {
        CallerReference: new Date().toUTCString(),
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    };
    console.log('Invalidating CDN with params', params);
    return this.cloudfront.createInvalidation(params).promise();
  }
}

export const cdn = new CDN(cloudfront);
