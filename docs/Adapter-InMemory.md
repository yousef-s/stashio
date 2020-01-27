## In-Memory Adapter

### Usage

```ts
import { stashio, AdapterInMemory } from 'stashio'

const adapter = new AdapterInMemory();
const wrapper = stashio({ adapter });

const getDataFromMultipleDataSources = wrapper((userId) => {
  // 
})

const data = await getDataFromMultipleDataSources(1);
```