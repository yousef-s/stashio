import { StashIO } from '../../types';
import * as Redis from 'ioredis';

export class AdapterRedis implements StashIO.Adapter {
  constructor(private readonly client: Redis.Redis) {}
  async get(key: string): Promise<StashIO.Result> {
    const value = await this.client.get(key);
    if (value === null) return null;

    return {
      key,
      value: JSON.parse(value)
    };
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const pipeline = this.client.pipeline();
    pipeline.set(key, JSON.stringify(value));

    if (ttl !== 0) {
      pipeline.expire(key, ttl);
    }

    await pipeline.exec();
    return Promise.resolve(void 0);
  }
}
