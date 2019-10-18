import { wrapper } from '@manwaring/lambda-wrapper';
import { cdn } from './cdn';

export const handler = wrapper(async ({ success, error }) => {
  try {
    await cdn.invalidateCache();
    success('Successfully invalidated CDN');
  } catch (err) {
    error(err);
  }
});
