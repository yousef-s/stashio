import { AdapterInMemory } from './in-memory';

const TEST_SHA1 = '7323a5431d1c31072983a6a5bf23745b655ddf59';
const TEST_VALUE = { a: 1, b: 2 };

describe('AdapterInMemory{}', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Behaviour: Getter', () => {
    it('should return null if no value is available', async () => {
      const adapter = new AdapterInMemory();
      const result = await adapter.get(TEST_SHA1);

      expect(result).toBeNull();
    });

    it('should return { key, value } if a value is available', async () => {
      const adapter = new AdapterInMemory();
      await adapter.set(TEST_SHA1, TEST_VALUE, 60);
      const result = await adapter.get(TEST_SHA1);

      expect(result).toEqual({
        key: TEST_SHA1,
        value: TEST_VALUE
      });
    });
  });

  describe('Behaviour: Clear', () => {
    // In order to provide behaviourial parity with most external caching mechanisms
    it('should clear expired items from the cache every 1 second', async () => {
      const ttl = 60;
      const ms = ttl * 1000;
      const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(0);

      const adapter = new AdapterInMemory();
      await adapter.set(TEST_SHA1, TEST_VALUE, ttl);

      // Push forward UNIX timestamp so that it is > TTL, and advance setInterval() function
      mockDateNow.mockReturnValue(ms + 1);
      jest.advanceTimersByTime(ms);

      // Result should now be cleared, as the expiry of 60 seconds has elapsed and clear is called every second
      const result = await adapter.get(TEST_SHA1);

      expect(result).toBeNull();
      mockDateNow.mockRestore();
    });

    it('should never clear items with a TTL of 0', async () => {
      const ttl = 0;
      const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1);

      const adapter = new AdapterInMemory();
      await adapter.set(TEST_SHA1, TEST_VALUE, ttl);

      // Despite the UNIX timestamp being > 0, and at least one clear cycle happening
      // the item remains in private store as TTL is set to 0
      jest.advanceTimersByTime(1000);

      const result = await adapter.get(TEST_SHA1);

      expect(result).toEqual({
        key: TEST_SHA1,
        value: TEST_VALUE
      });
      mockDateNow.mockRestore();
    });
  });
});
