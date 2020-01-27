import { StashIO } from '../../types';

export class AdapterInMemory implements StashIO.Adapter {
  private store: { [key: string]: { value: any; ttl: number } } = {};
  constructor() {
    setInterval(this.clear, 1000);
  }
  async get(key: string): Promise<StashIO.Result> {
    const item = this.store[key];

    return typeof item !== 'undefined' ? { key, value: item.value } : null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    this.store[key] = {
      value,
      ttl: ttl === 0 ? 0 : ttl * 1000 + Date.now()
    };
    return Promise.resolve(void 0);
  }

  private clear = (): void => {
    const now = Date.now();
    this.store = Object.entries(this.store).reduce((o, [key, item]) => {
      if (item.ttl !== 0 && now > item.ttl) {
        return o;
      }

      return {
        ...o,
        [key]: item
      };
    }, {});
  };
}
