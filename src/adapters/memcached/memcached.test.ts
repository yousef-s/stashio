import { AdapterMemcached } from './memcached';
import * as Memcached from 'memcached';

const mocks = {
  get: jest.fn(),
  set: jest
    .fn()
    .mockImplementation((key, value, ttl, callback) => callback(null, void 0))
};

jest.mock('memcached');

const TEST_SHA1 = '7323a5431d1c31072983a6a5bf23745b655ddf59';
const TEST_VALUE = { a: 1, b: 2 };
const TEST_VALUE_JSON = JSON.stringify(TEST_VALUE);

describe('AdapterMemcached{}', () => {
  const mocks = {
    get: jest
      .fn()
      .mockImplementation((key, callback) => callback(false, void 0)),
    set: jest
      .fn()
      .mockImplementation((key, value, ttl, callback) => callback(null, void 0))
  };

  const MockMemcachedClient = new Memcached('');
  MockMemcachedClient.get = mocks.get;
  MockMemcachedClient.set = mocks.set;

  beforeEach(() => {
    Object.values(mocks).forEach(mock => {
      mock.mockClear();
    });
  });

  describe('Behaviour: Setter', () => {
    it('should set a value in Memcached as expected', async () => {
      const adapter = new AdapterMemcached(MockMemcachedClient);
      await adapter.set(TEST_SHA1, TEST_VALUE, 0);

      expect(mocks.set.mock.calls[0][0]).toEqual(TEST_SHA1);
      expect(mocks.set.mock.calls[0][1]).toEqual(TEST_VALUE_JSON);
      expect(mocks.set.mock.calls[0][2]).toEqual(0);
    });

    it('should throw if the TTL > 30 days', async () => {
      const adapter = new AdapterMemcached(MockMemcachedClient);

      const ttlOver30Days = 60 * 60 * 24 * 30 + 120; // 30 days + 120 seconds in seconds

      expect(adapter.set(TEST_SHA1, TEST_VALUE, ttlOver30Days)).rejects.toThrow(
        'Maximum lifetime supported by Memcached client is 30 days (2592000 seconds)'
      );
    });
  });

  describe('Behaviour: Getter', () => {
    it('should return null if no value is available', async () => {
      mocks.get.mockImplementation((key, callback) => {
        callback('Some random error from Memcached', false);
      });

      const adapter = new AdapterMemcached(MockMemcachedClient);
      const result = await adapter.get(TEST_SHA1);

      expect(result).toBeNull();
    });

    it('should return { key, value } if a value is available', async () => {
      mocks.get.mockImplementation((key, callback) => {
        callback(false, TEST_VALUE_JSON);
      });

      const adapter = new AdapterMemcached(MockMemcachedClient);
      const result = await adapter.get(TEST_SHA1);

      expect(result).toEqual({
        key: TEST_SHA1,
        value: TEST_VALUE
      });
    });
  });
});
