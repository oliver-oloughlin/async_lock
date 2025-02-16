import { AsyncLock } from "../mod.ts";
import { sleep } from "./utils.ts";
import { assert } from "@std/assert";

Deno.test("async_lock", async (t) => {
  await t.step(
    "Tasks should run sequentially when using AsyncLock",
    async () => {
      const lock = new AsyncLock();

      const sleepTimings = [
        200,
        400,
        600,
        800,
        1_000,
      ];

      const sumTimings = sleepTimings.reduce((sum, ms) => sum + ms, 0);

      const before = Date.now();
      await Promise.all(sleepTimings.map((ms) => lock.run(() => sleep(ms))));
      const time = Date.now() - before;

      assert(time >= sumTimings);
    },
  );

  await t.step("Should cancel pending tasks", async () => {
    const lock = new AsyncLock();

    const sleepTimings = [
      200,
      400,
      600,
      800,
      1_000,
    ];

    const promise = Promise.all(
      sleepTimings.map((ms) => lock.run(() => sleep(ms))),
    );
    lock.cancel();
    const results = await promise;

    assert(results[0].status === "fulfilled"); // First task does not need to wait and is therefore not cancelled
    assert(results.slice(1).every((r) => r.status === "cancelled"));
  });

  await t.step(
    "Should recover from error and return rejected task result without effecting other tasks",
    async () => {
      const lock = new AsyncLock();

      const results = await Promise.all([
        lock.run(() => sleep(200)),
        lock.run(async () => {
          await sleep(200);
          throw new Error();
        }),
        lock.run(() => sleep(600)),
      ]);

      assert(results[0].status === "fulfilled");
      assert(results[1].status === "rejected");
      assert(results[2].status === "fulfilled");
    },
  );

  await t.step("Should infer and return correct result type", async () => {
    const lock = new AsyncLock();

    // This test is primarily used as a utility to check that T is inferred as <"one" | "two"> instead of <string>
    const taskResult = await lock.run(async () => {
      await sleep(100);
      return Math.random() >= 0.5 ? "one" : "two";
    });

    assert(taskResult.status === "fulfilled");
    assert(["one", "two"].includes(taskResult.value));
  });
});
