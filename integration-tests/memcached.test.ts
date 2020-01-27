import * as Memcached from 'memcached';
import * as utils from './utils';
import { stashio, AdapterMemcached } from '../src';

const DOCKER_NETWORK_MEMCACHED_PORT = 11211;
const MEMCACHED_ADDR = `localhost:${DOCKER_NETWORK_MEMCACHED_PORT}`;

describe('Integration: Shuttle.js - Memcached', () => {
  const MemcachedClient = new Memcached(MEMCACHED_ADDR);
  const spy = jest.spyOn(utils, 'getEmojisByName');

  // Service related setup and teardown
  afterEach(async () => {
    spy.mockClear();
    await new Promise((resolve, reject) => {
      MemcachedClient.flush((err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  });

  afterAll(async () => {
    MemcachedClient.end();
  });

  const adapter = new AdapterMemcached(MemcachedClient);
  const wrapper = stashio({ adapter });

  it('should adhere to the TTL policy (15 secs)', async () => {
    const getEmojisByName = wrapper(utils.getEmojisByName, { ttl: 15 });

    // First call, uses function to compute, reads from filesystem
    const firstValue = await getEmojisByName('air');
    expect(firstValue).toEqual(utils.expectedObjectValueAir);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('air');

    // Second vall, retrieves value from cache
    const secondValue = await getEmojisByName('air');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('air');
    expect(secondValue).toEqual(utils.expectedObjectValueAir);

    // Third call, computes new value, reads from filesystem
    await utils.sleep(18);
    const thirdValue = await getEmojisByName('air');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('air');
    expect(thirdValue).toEqual(utils.expectedObjectValueAir);
  }, 20000);

  it('should adhere to the dynamic resolver policy', async () => {
    const getEmojisByName = wrapper(utils.getEmojisByName, {
      resolver: utils.resolverOnce()
    });

    // First call, uses function to compute, reads from filesystem
    const firstValue = await getEmojisByName('video');
    expect(firstValue).toEqual(utils.expectedObjectValueVideo);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('video');

    // Second vall, retrieves value from cache
    const secondValue = await getEmojisByName('video');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('video');
    expect(secondValue).toEqual(utils.expectedObjectValueVideo);

    // Third call, computes new value, reads from filesystem
    const thirdValue = await getEmojisByName('video');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('video');
    expect(thirdValue).toEqual(utils.expectedObjectValueVideo);
  }, 10000);
});
