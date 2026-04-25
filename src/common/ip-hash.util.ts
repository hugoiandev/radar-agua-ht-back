import * as crypto from 'crypto';

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || '').digest('hex');
}
