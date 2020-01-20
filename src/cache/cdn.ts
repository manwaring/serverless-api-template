import { CloudFront } from 'aws-sdk';

const DistributionId = process.env.CLOUDFRONT;
const cloudfront = new CloudFront({ apiVersion: '2019-03-26' });

export async function invalidateCache(): Promise<any> {
  if (DistributionId) {
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
    await cloudfront.createInvalidation(params).promise();
    return 'Successfully invalidated CDN';
  } else {
    console.log('No CDN to invalidate');
    return 'No CDN to invalidate';
  }
}
