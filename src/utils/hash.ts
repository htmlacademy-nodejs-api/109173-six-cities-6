import * as crypto from 'node:crypto';

export function getSHA256Hash(value: string, salt: string) {
  const HMACDigets = crypto.createHmac('sha256', salt);

  return HMACDigets.update(value).digest('hex');
}
