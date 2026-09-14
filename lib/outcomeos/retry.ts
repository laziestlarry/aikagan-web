export const BACKOFF_SECONDS = [60, 300, 900] as const;

export async function withBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1) {
        const seconds = BACKOFF_SECONDS[Math.min(attempt, BACKOFF_SECONDS.length - 1)];
        await wait(seconds * 1000);
      }
    }
  }
  throw lastError;
}
