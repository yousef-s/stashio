## Redis Adapter

### Requirements

This adapter has been designed to be compatible with the Node.js Redis client library "ioredis" and as such as listed as a peer dependency to avoid bundling it with the core library.

> ⚠️ **Note:** Currently tested against ioredis@4.14.1 (client library)

To install it, please run:

```sh
npm i ioredis
```

### Usage

```ts
import RedisClient from 'ioredis'
import { stashio, AdapterRedis } from 'stashio'

const RedisClient = new Redis('redis://:password@127.0.0.1:6380/0');
const adapter = new AdapterRedis(RedisClient);

const wrapper = stashio({ adapter });

const getDataFromMultipleDataSources = wrapper((userId) => {
  // 
})

const data = await getDataFromMultipleDataSources(1);
```