/**
 * Result object of a queued task.
 *
 * `status` - indicates the state of the task result.
 * Is "fulfilled" if completed successfully, "rejected" if an error was thrown during the task running, or "cancelled" if task was cancelled before running.
 *
 * `value` - Awaited return value of successful task.
 *
 * `error` - Captured error of rejected task.
 */
export type TaskResult<T> = {
  status: "fulfilled";
  value: T;
} | {
  status: "rejected";
  error: unknown;
} | {
  status: "cancelled";
};
