import { wrapper } from '@manwaring/lambda-wrapper';
import { invalidateCache } from './cdn';

export const handler = wrapper(async ({ success, error }) => {
  try {
    const results = await invalidateCache();
    return success(results);
  } catch (err) {
    return error(err);
  }
});
