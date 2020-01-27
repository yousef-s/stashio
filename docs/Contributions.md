# 😄 Contributions

Contributing is most definitely welcomed for any fixes/updates/adapters. Please see the guidelines below!

## Guidelines

### All change guidelines

Please clone down the repository and checkout a new branch from `master`.

```sh
git clone (repo) && git checkout -b my-branch-name
```

> ⚠️ **Note:** The two test classes below are set to run as a pre-push hook, however it's worth running them incrementally as needed. 

Ensure that appropriate unit tests have been written/modified and coverage hasn't decreased.

```sh
npm run tests:unit
```

Run the integration tests to ensure nothing has broken

```sh
npm run tests:integration
```

### 🐛 Fixes

Push your branch and submit a pull request. Travis CI will automatically run a build against your branch, which if it passes will automatically be merged and a patch release published to npm.

### ⏮️ Additions (backwards compatible)

Push your branch and submit a pull request. Travis CI will automatically run a build against your branch, which if it passes will automatically be merged and reviewed in due course for a minor release.

> ⚠️ **Note:** Automatic merge and minor release is based on no changes being present in the `integration-tests` folder and all tests still passing.


### ⚒️ Breaking changes

Push your branch and submit a pull request. Travis CI will automatically run a build against your branch, which if it passes will automatically be reviewed and merged in due course for a major release.

## Adding adapters

If you're adding an adapter, it's worth noting the following information/conventions.

- All adapters take on the form of a class that implements `Shuttle.Adapter`, that is, has a public getter function with the signature `get(key)` and setter function with the signature `set(key, value, ttl)`.
- The naming convention for an adapter is `Adapter<X>` where `X` is the name of the underlying service.
- A TTL of 0 should be treated as never expiring
- The adapter is responsible for serialising any `value` as needed. The `stashio()` function is responsible for computing keys.
- If available, seek to use the underlying service's expiry mechanism as opposed to implementing one.

> ⚠️ **Note:** Please also see the guidelines on [integration tests](../integration-tests/README.md) in order to ensure appropriate test coverage is present for your adapter.



