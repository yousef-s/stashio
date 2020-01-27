import * as Memcached from 'memcached';
import { StashIO } from '../../types';

const MEMCACHED_MAX_LIFETIME = 2592000;

export class AdapterMemcached implements StashIO.Adapter {
  constructor(private readonly client: Memcached) {}
  async get(key: string): Promise<StashIO.Result> {
    const getAsync = (key: string): Promise<any> =>
      new Promise((resolve, reject) => {
        return this.client.get(key, (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve(data);
        });
      });

    try {
      const value = (await getAsync(key)) as string;

      return {
        key,
        value: JSON.parse(value)
      };
    } catch (e) {
      return null;
    }
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    if (ttl > MEMCACHED_MAX_LIFETIME) {
      throw new Error(
        `Maximum lifetime supported by Memcached client is 30 days (${MEMCACHED_MAX_LIFETIME} seconds)`
      );
    }

    const setAsync = (key: string, value: any, ttl: number): Promise<any> =>
      new Promise((resolve, reject) => {
        return this.client.set(key, value, ttl, (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve(data);
        });
      });

    try {
      await setAsync(key, JSON.stringify(value), ttl);
    } catch (e) {}
    return Promise.resolve(void 0);
  }
}
