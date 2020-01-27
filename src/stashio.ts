import * as crypto from 'crypto';
import { StashIO } from './types';

const CRYPTO_ALGO = 'sha1';

type ResolverFunction = (
  value: StashIO.Result['value'],
  args: any[]
) => Promise<boolean>;

type WrappableFunction<T> = (...args: any[]) => T;

interface Options {
  adapter: StashIO.Adapter;
  ttl: number;
  resolver: ResolverFunction;
}

export const stashio = <T>(options?: Partial<Options>) => (
  f: WrappableFunction<T>,
  overrideOptions?: Partial<Options>
): ((...args: any[]) => Promise<ReturnType<typeof f>>) => {
  const o = {
    ttl: 60,
    resolver: (): Promise<boolean> => Promise.resolve(false),
    ...options,
    ...overrideOptions
  };

  if (typeof o.adapter === 'undefined') {
    throw new Error('No adapter given');
  }

  return async (
    ...args: Parameters<typeof f>
  ): Promise<ReturnType<typeof f>> => {
    const { ttl, adapter, resolver } = o;

    // To avoid collisions, the key is combination of the wrapped function name,
    // source code and arguments, stringified and hashed
    const elements = [
      f.name,
      f.toString(),
      ...args.map(a => (typeof a === 'function' ? a.toString() : a))
    ].join('');

    const key = crypto
      .createHash(CRYPTO_ALGO)
      .update(elements)
      .digest('hex');

    const result = await adapter.get(key);

    if (result !== null && !(await resolver(result.value, args))) {
      return result.value;
    }

    const value = await f(...args);
    await adapter.set(key, value, ttl);

    return value;
  };
};

export default stashio;
