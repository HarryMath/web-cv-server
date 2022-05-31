import crypto from 'crypto';

export const utils = {
  md5: (payload: string): string => {
    return crypto.createHash('MD5').update(payload).digest('hex');
  }
}
