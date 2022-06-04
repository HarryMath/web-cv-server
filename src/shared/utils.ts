import { createHash } from 'crypto';

export const utils = {
  md5: (payload: string): string => {
    return createHash('MD5').update(payload).digest('hex');
  }
}
