import { CloudFront } from 'aws-sdk';

jest.mock('aws-sdk');

const createInvalidation = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

// @ts-ignore
CloudFront.mockImplementation(() => ({ createInvalidation }));

describe('CloudFront cache invalidation', () => {
  const ORIGINAL_ENVS = process.env;
  const DistributionId = 'CloudFrontDistributionId';
  process.env = { ...ORIGINAL_ENVS, ...{ API_CLOUDFRONT: DistributionId } };

  const { CDN } = require('./cdn');
  const cdn = new CDN(new CloudFront());

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
  });

  it('Publishes cache invalidation requests', async () => {
    await cdn.invalidateCache();
    expect(console.log).toHaveBeenCalled();
    expect(createInvalidation).toHaveBeenCalledWith({
      DistributionId,
      InvalidationBatch: {
        CallerReference: new Date().toUTCString(),
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    });
  });
});
