import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { NotificationService } from '../src/modules/notification';
import { parseSubscribe } from '../src/modules/waitlist/waitlist.input';
import type { WaitlistRepository } from '../src/modules/waitlist/waitlist.repository';
import { SUBSCRIBED_MESSAGE, WaitlistService } from '../src/modules/waitlist/waitlist.service';

// The service is tested with in-memory stand-ins for the repository and notifications: no database, no email.
function setup() {
  const stored = new Set<string>();
  const welcomed: string[] = [];
  const repo = { add: async (email: string) => (stored.has(email) ? false : (stored.add(email), true)) };
  const notifications = { welcomeSubscriber: async (email: string) => void welcomed.push(email) };
  const service = new WaitlistService(repo as unknown as WaitlistRepository, notifications as unknown as NotificationService);
  return { service, stored, welcomed };
}

test('a new subscriber is stored and welcomed once', async () => {
  const { service, stored, welcomed } = setup();
  const answer = await service.subscribe({ email: 'collector@example.com' });
  assert.equal(answer.message, SUBSCRIBED_MESSAGE);
  assert.deepEqual([...stored], ['collector@example.com']);
  assert.deepEqual(welcomed, ['collector@example.com']);
});

test('signing up twice gets the same answer and no second welcome', async () => {
  const { service, welcomed } = setup();
  await service.subscribe({ email: 'collector@example.com' });
  const second = await service.subscribe({ email: 'collector@example.com' });
  assert.equal(second.message, SUBSCRIBED_MESSAGE);
  assert.equal(welcomed.length, 1);
});

test('email is trimmed and lower-cased before it reaches the service', () => {
  assert.deepEqual(parseSubscribe({ email: '  Sanjana@PurnaGallery.com ' }), { email: 'sanjana@purnagallery.com' });
});

test('a malformed email is rejected with a message the form can show', () => {
  assert.throws(() => parseSubscribe({ email: 'not-an-email' }), /doesn't look like an email address/);
  assert.throws(() => parseSubscribe({}), /Email is required/);
});
