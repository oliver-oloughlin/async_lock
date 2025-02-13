# async_lock

Simple and small-weight async lock for running callback functions sequentially,
with zero dependencies.

## Run

Sequentially run tasks using a queue based strategy. New tasks are queued and
wait for prior tasks to complete.

```ts
import { AsyncLock } from "@olli/async-lock";

const lock = new AsyncLock();

async function critical() {
  // ...critical logic that needs to be run one instance at a time
}

// All calls of `critical()` are run sequentially, no matter the order
await Promise.all([
  lock.run(() => critical()),
  lock.run(() => critical()),
  lock.run(() => critical()),
]);
```

## Cancel

Cancel and remove any queued tasks.

```ts
import { AsyncLock } from "@olli/async-lock";

const lock = new AsyncLock();

async function critical() {
  // ...critical logic that needs to be run one instance at a time
}

Promise.all([
  lock.run(() => critical()), // Not cancelled, as the first task does not need to wait
  lock.run(() => critical()), // Cancelled
  lock.run(() => critical()), // Cancelled
]);

lock.cancel();
```

## Development

Any contributions are welcomed and appreciated. How to contribute:

- Clone this repository
- Add feature / Refactor
- Add or refactor tests as needed
- Ensure code quality (check + lint + format + test) using `deno task prep`
- Open Pull Request

## License

Published under
[MIT License](https://github.com/oliver-oloughlin/async_lock/blob/main/LICENSE)
