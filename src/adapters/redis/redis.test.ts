import { AdapterRedis } from './redis';
import * as Redis from 'ioredis';

jest.mock('ioredis');

const TEST_SHA1 = '7323a5431d1c31072983a6a5bf23745b655ddf59';
const TEST_VALUE = { a: 1, b: 2 };
const TEST_VALUE_JSON = JSON.stringify(TEST_VALUE);

describe('AdapterRedis{}', () => {
  const MockRedisClient = new Redis('');
  describe('Behaviour: Setter', () => {
    const mocks = {
      set: jest.fn().mockResolvedValue(void 0),
      expire: jest.fn().mockResolvedValue(void 0),
      exec: jest.fn().mockResolvedValue(void 0)
    };

    MockRedisClient.pipeline = jest.fn().mockReturnValue(mocks);

    beforeEach(() => {
      Object.values(mocks).forEach(mock => {
        mock.mockClear();
      });
    });

    it('should SET a value in Redis as expected', async () => {
      const adapter = new AdapterRedis(MockRedisClient);
      await adapter.set(TEST_SHA1, TEST_VALUE, 0);

      expect(mocks.set).toHaveBeenCalledWith(TEST_SHA1, TEST_VALUE_JSON);
      expect(mocks.exec).toHaveBeenCalled();
    });

    it('should SET and EXPIRE a value in Redis as expected if the TTL > 0', async () => {
      const adapter = new AdapterRedis(MockRedisClient);
      await adapter.set(TEST_SHA1, TEST_VALUE, 60);

      expect(mocks.set).toHaveBeenCalledWith(TEST_SHA1, TEST_VALUE_JSON);
      expect(mocks.expire).toHaveBeenCalledWith(TEST_SHA1, 60);
      expect(mocks.exec).toHaveBeenCalled();
    });
  });

  describe('Behaviour: Getter', () => {
    const mocks = {
      get: jest.fn()
    };

    MockRedisClient.get = mocks.get;

    beforeEach(() => {
      mocks.get.mockClear();
    });

    it('should return null if no value is available', async () => {
      mocks.get.mockResolvedValue(null);
      const adapter = new AdapterRedis(MockRedisClient);
      const result = await adapter.get(TEST_SHA1);
      expect(mocks.get).toHaveBeenCalledWith(TEST_SHA1);
      expect(result).toBeNull();
    });

    it('should return { key, value } if a value is available', async () => {
      mocks.get.mockResolvedValue(TEST_VALUE_JSON);
      const adapter = new AdapterRedis(MockRedisClient);
      const result = await adapter.get(TEST_SHA1);
      expect(mocks.get).toHaveBeenCalledWith(TEST_SHA1);
      expect(result).toEqual({
        key: TEST_SHA1,
        value: TEST_VALUE
      });
    });
  });
});
