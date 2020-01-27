# ⛓️ Integration Tests

## Purpose

- Test against real back-ends for those adapters which connect to an external back-end
- Prevent underlying client library implementation issues/compatibility test
- Simulate a real use case with I/O
- Ensure the public API against breaking changes

## Test structure

Each test underlying adapter should have two tests which follow a similar pattern:

### ⏰ TTL Tests

1) A function which reads the co-located file `data.json` is wrapped with the appropriate `stashio()` function, with a TTL of 15 seconds.
2) The function is called, with the expectation that the underlying function is called.
3) The function is called again, with the expectation that the underlying function is not called, but the returned value is the same.
4) A 18 second wait is put in place to block the next function call (allow for a bit of latency in test run).
5) The function is called again, with the expectation that the underlying function call is made, again.


### 🍄 Dynamic Resolver Tests

1) A function which reads the co-located file `data.json` is wrapped with the appropriate `stashio()` function for the build, with a TTL of 0 seconds **(never expire)** and a resolver function which resolves to true after the second call.
2) The function is called, with the expectation that the underlying function is called.
3) The function is called again, with the expectation that the underlying function is not called, but the returned value is the same.
4) The function is called again, with the expectation that the underlying function call is made, again.


## Running the tests

>  ⚠️ **Note:** These tests are designed to be run against real implementations of the services, therefore for all but the in-memory adapter a a publically available (Docker Hub) docker image for the service should be used. You must have docker installed on your machine to run these tests.

```sh
npm run tests:integration
```

### Notes and Troubleshooting

- For speed the aim is to run these tests in parallel.
- These tests are designed to run on the default ports that each service is exposed over, please ensure that these ports are available to be mapped to or modify the port mappings in `docker-compose.yml` for local testing.
