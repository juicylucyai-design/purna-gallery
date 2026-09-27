import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Fixed-window limit per key (usually the visitor's IP), held in memory. Enough for a single Railway instance;
 * move the counts to Postgres or Redis if the site ever runs on more than one.
 */
export class RateLimiter {
  private readonly hits = new Map<string, { count: number; windowStart: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  /** Counts one attempt for `key`; throws 429 once the key is over the limit for this window. */
  check(key: string): void {
    const now = this.now();
    const entry = this.hits.get(key);
    if (!entry || now - entry.windowStart >= this.windowMs) {
      this.hits.set(key, { count: 1, windowStart: now });
      this.sweep(now);
      return;
    }
    entry.count += 1;
    if (entry.count > this.limit) {
      const minutes = Math.ceil((entry.windowStart + this.windowMs - now) / 60_000);
      throw new HttpException(`Too many attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`, HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private sweep(now: number): void {
    if (this.hits.size < 5_000) return;
    for (const [key, entry] of this.hits) if (now - entry.windowStart >= this.windowMs) this.hits.delete(key);
  }
}
