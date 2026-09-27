import assert from 'node:assert/strict';
import { test } from 'node:test';
import { RateLimiter } from '../src/common/rate-limit';

test('allows the limit, blocks the next attempt, and resets after the window', () => {
  let now = 0;
  const limiter = new RateLimiter(3, 60_000, () => now);
  for (let i = 0; i < 3; i++) limiter.check('1.2.3.4');
  assert.throws(() => limiter.check('1.2.3.4'), /Too many attempts\. Try again in 1 minute\./);
  limiter.check('5.6.7.8'); // another visitor is unaffected
  now = 60_000;
  assert.doesNotThrow(() => limiter.check('1.2.3.4'));
});
