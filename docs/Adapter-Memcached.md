## Memcached Adapter

### Requirements

This adapter has been designed to be compatible with the Node.js Memcached client library "memcached" and as such it is listed as a peer dependency to avoid bundling it with the core library.

> ⚠️ **Note:** Currently tested against memcached@2.2.2 (client library)

To install it, please run:

```sh
npm i memcached
```

### Usage

```ts
import Memcached from 'memcached'
import { stashio, AdapterMemcached } from 'stashio'

const MemcachedClient = new Memcached('localhost:11211')
const adapter = new AdapterMemcached(MemcachedClient)

const wrapper = stashio({ adapter, ttl: 3600 });

const getDataFromMultipleDataSources = wrapper((userId) => {
  // 
})

const data = await getDataFromMultipleDataSources(1);
```