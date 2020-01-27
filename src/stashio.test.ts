import * as crypto from 'crypto';
import { stashio } from './stashio';

describe('#stashio', () => {
  const mocks = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(void 0)
  };

  const AdapterMock = jest.fn().mockImplementation(() => ({
    get: mocks.get,
    set: mocks.set
  }));

  beforeEach(() => {
    (mocks.get = jest.fn().mockResolvedValue(null)),
      (mocks.set = jest.fn().mockResolvedValue(void 0));
  });

  describe('Behaviour: Default', () => {
    it('should have a default TTL of 60 seconds', async () => {
      // eslint-disable-next-line
      const wrap = stashio({ adapter: new AdapterMock() })(function noop() {});

      await wrap();

      expect(mocks.set.mock.calls[0][2]).toEqual(60);
    });

    it('should have a default resolver function which resolves to false', async () => {
      // eslint-disable-next-line
      const wrap = stashio({ adapter: new AdapterMock() })(function noop() {});
      mocks.get.mockResolvedValue({
        key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
        value: { a: 1, b: 2 }
      });
      await wrap();

      expect(mocks.set).not.toHaveBeenCalled();
    });

    it('should throw if an adapter is not passed', async () => {
      // eslint-disable-next-line
      expect(() => stashio()(function noop() {})).toThrow('No adapter given');
    });
  });

  describe('Behaviour: Expiration policies', () => {
    it('should compute a new value and set it in cache with the expected TTL when null is returned from the cache', async () => {
      const noop = jest.fn().mockResolvedValue('foo');
      const wrap = stashio({ adapter: new AdapterMock(), ttl: 120 })(noop);

      mocks.get.mockResolvedValue(null);
      await wrap();
      expect(noop).toHaveBeenCalled();
      expect(mocks.set.mock.calls[0][1]).toEqual('foo');
      expect(mocks.set.mock.calls[0][2]).toEqual(120);
    });

    it('should compute a new value and set it in cache with the expected TTL when the resolver resolves to true', async () => {
      const noop = jest.fn().mockReturnValue('foo');
      const wrap = stashio({
        adapter: new AdapterMock(),
        resolver: () => Promise.resolve(true)
      })(noop);

      mocks.get.mockResolvedValue({
        key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
        value: { a: 1, b: 2 }
      });

      await wrap();
      expect(noop).toHaveBeenCalled();
      expect(mocks.set.mock.calls[0][1]).toEqual('foo');
      expect(mocks.set.mock.calls[0][2]).toEqual(60);
    });

    it('should use an the cached value when it is not null and the resolver resolves to false', async () => {
      const noop = jest.fn();
      const wrap = stashio({
        adapter: new AdapterMock(),
        resolver: () => Promise.resolve(false)
      })(noop);

      mocks.get.mockResolvedValue({
        key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
        value: { a: 1, b: 2 }
      });
      const value = await wrap();
      expect(value).toEqual({ a: 1, b: 2 });
    });
  });

  describe('Behaviour: Argument proxying & Option overrides', () => {
    it('should pass on arguments from the returned wrapped function as expected', async () => {
      const noop = jest.fn();
      const wrap = stashio({
        adapter: new AdapterMock(),
        resolver: () => Promise.resolve(false)
      })(noop);

      await wrap(1, ['foo', 'bar']);
      expect(noop).toBeCalledWith(1, ['foo', 'bar']);
    });

    it('should pass the existing value and args to the resolver(value, args) function', async () => {
      const mockResolver = jest.fn().mockResolvedValue(false);
      const wrap = stashio({
        adapter: new AdapterMock(),
        ttl: 120,
        resolver: mockResolver
      })(
        // eslint-disable-next-line
        function noop() {}
      );

      mocks.get.mockResolvedValue({
        key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
        value: { a: 1, b: 2 }
      });

      await wrap('foo', 'bar', 'baz');
      expect(mockResolver).toHaveBeenCalledWith({ a: 1, b: 2 }, [
        'foo',
        'bar',
        'baz'
      ]);
    });

    it('should allow options to be overridden', async () => {
      const overideResolver = jest.fn().mockResolvedValue(false);
      const wrap = stashio({
        adapter: new AdapterMock(),
        ttl: 120,
        resolver: () => Promise.resolve(true)
      })(
        // eslint-disable-next-line
        function noop() {},
        {
          ttl: 60,
          adapter: new AdapterMock(),
          resolver: overideResolver
        }
      );

      mocks.get.mockResolvedValue({
        key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
        value: { a: 1, b: 2 }
      });

      await wrap();
      expect(overideResolver).toHaveBeenCalled();

      mocks.get.mockResolvedValue(null);
      await wrap();
      expect(mocks.set.mock.calls[0][2]).toEqual(60);
    });
  });

  describe('Behaviour: Key hashing', () => {
    it('should compute the expected key value using the sha1 algorithm', async () => {
      const functionToWrap = (x, y) => x + y;
      const wrap = stashio({
        adapter: new AdapterMock()
      })(functionToWrap);

      const args = [1, 'foo', () => []];

      const expectedKey = crypto
        .createHash('sha1')
        .update(
          `functionToWrap${functionToWrap.toString()}1foo${(() => []).toString()}`
        )
        .digest('hex');

      await wrap(...args);

      expect(mocks.set.mock.calls[0][0]).toEqual(expectedKey);
    });
  });
});
