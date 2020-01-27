# 🗄 StashIO

StashIO is a utility library designed for simple drop-in of function level caching in Node.js. It provides out of the box adapters for in-memory, Memcached and Redis and supports time-based and dynamic resolver expiry policies.

## Features

- Time based expiration
- Dynamic resolver expiration
- Redis adapter
- Memcached adapter
- In-memory adapter


## 🔥 Quickfire Usage

```sh
npm install stashio ## Standalone with in memory adapter
npm install ioredis ## Only if using Redis
npm install memcached ## Only if using Memcached
```

```ts
import { stashio, AdapterInMemory } from 'stashio'
// Create a new stashio wrapper function, using the in-memory adapter with an expiry of 60s 
const wrapper = stashio({ adapter: new AdapterInMemory(), ttl: 60});

// Wrap the function with the stashio wrapper function
const getSomeData = wrapper(async(id, ref) => {
  //... Do some heavy lifting, read some files, make some network requests
})

// First call will compute as expected
const expensive = await getSomeData(1, 'foo');
// If called within 60s, second call will return the result from cache as arguments to the function are the same
const cheap = await getSomeData(1, 'foo');
```


> ⚠️ **Note:** It's recommended that you name functions rather than keep them anonymous as keys are computed partially based on function names, however likelihood of a key collision is still VERY low. 

## 👀 Why is this useful?

Often when building applications, there are cases in which utilising a pre-computed value can significantly improve performance. This takes on two forms, **caching** and **memoization**.

### Caching

Typically employed when data is retrieved from one or many I/O calls (e.g. network requests, file system reads), caching is designed to reduce the throughput to the underlying data sources by storing that data in a place that is cheaper to read from.

It's often used on a case-by-case basis (e.g. using Redis) or at an inter-service level (e.g. an API Gateway) and is associated with time based expirations

<ins>What are the downsides</ins>

* Case-by-case or relatively blanket approach make it more expensive to implement or unpick.
* If implemented at the application layer requires interfacing with a selected caching technology.
* Dynamic expiry based on conditions may not be supported.

### Memoization

Utilised when computing a deterministic value which is expensive (think many array iterations, etc), memoization is used to return the same value without performing those computations.

This is usually applied at a application level by comparing function arguments, wherein if a call to the function is made with the same arguments, a pre-computed value is returned from memory.

<ins>What are the downsides?</ins>

* Not designed for non-deterministic results
* Value stored in-memory only

### And then there's StashIO

StashIO is designed as a cross-breed, operating at the function level but providing the ability to store pre-computed results in a variety of data stores. It's API is lightweight and non-intrusive making it easy to add performance gains to an existing project, without the overhead of setting up verbose caching mechanisms or blanket policies.

By supporting a "dynamic resolver policy", you can subject your data to expire based on conditions beyond that of just time.


## 🗞 Deep Dive API

The library exposes the `stashio([options])([functionToWrap, options?])` function - which will return a new function with the same signature as `functionToWrap`. You can pass options to the returned function in order to override those of the first call to `stashio([options])`

> ⚠️ **Note:** The function being wrapped must return or resolve to a serializable value.


## 🎛️ Options

| Property   | Value Types                     | Default Value     | Description                                                                                            |
|------------|---------------------------------|-------------------|--------------------------------------------------------------------------------------------------------|
| `ttl`     | number  | 60 (1 minute)  | A second based value to expire the cache. See "TTL (Time) Policy" below.                   |
| `adapter`    | new AdapterX(...)       | In-Memory Adapter | An adapter for the data store where results will be cached. See "Adapters" below.                      |
| `resolver` | *function(value, args)* \| null | null | A function which resolves to `true` to expire or `false` to use the existing value if available. |


## 🔐 Policies

Policies determine whether or not cached value should be used..

> ⚠️ **Note:** If both policies are in use, precedence will be given to the dynamic resolver.

### ⏰ TTL (Time) Policy
Express in seconds, when your function is called, if a cached result is available that has not expired it will be used - otherwise a new value will be computed.


### 🍄 Dynamic Resolver Policy

Expressed in the form of a function (signature and example below), when your function is called, if a cached result is available, it and the arguments your function was called with are provided to your dynamic resolver function. Using these arguments, you can determine whether to resolve to `true` to expire the value and return a new one, or `false` to used existing value.

**Example**

```ts
const resolver = async(value, args) => {
  const filename = args[0];
  // Check if some other service has updated results
  if (await S3Service.hasNewPrimaryFileBeenUploaded(filename)) {
    return true;
  }

  return false;
}
```


## 🔌 Adapters

Below is a table of the currently supported adapters with links to respective configurations.

| Adapter                                   | Configuration                                                                                         |
|-------------------------------------------|------------------------------------------------------------------------------------------------------|
| `new AdapterInMemory()`      | [An in-memory adapter.](docs/Adapter-InMemory.md) |
| `new AdapterRedis(RedisClient)`         | [An optimised adapter for Redis.](docs/Adapter-Redis.md)                                                                      |
| `new AdapterMemcached(MemcachedClient)`      | [An optimised adapter for Memcached.](docs/Adapter-Memcached.md)                                                                |


## 😄 Contributions

Contributions are greatly appreciated - especially for creating additional adapters.

Please see [contribution guidelines here.](docs/Contributions.md)

## 🙋 FAQ & Troubleshooting

**How does this work?**

Under the hood, name of, source code (`toString()` value) and arguments to the function want to wrap are serialised and then hashed in order to generate a key against which the return/resolved value of the function is looked up.

The `sha1` algorithm is used, which of those natively supported by Node.js built-in "crypto" is a good option when considering trade-offs between performance and collisions.

**What's the best use case for stashio.js?**

As a rule of thumb, if your function doesn't perform any I/O (e.g. network requests, file system reads, etc) to retrieve data, then it probably only needs memoization.

However, if those things are applicable it's a good choice.

