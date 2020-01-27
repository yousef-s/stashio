export namespace StashIO {
  export interface Result {
    key: string;
    value: any;
  }

  export interface Adapter {
    get: (key: string) => Promise<Result | null>;
    set: (key: string, value: any, ttl: number) => Promise<void>;
  }
}
