import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEnquiry, type EnquiryInput } from '../src/modules/enquiry/enquiry.input';
import type { EnquiryRepository } from '../src/modules/enquiry/enquiry.repository';
import { EnquiryService, RECEIVED_MESSAGE } from '../src/modules/enquiry/enquiry.service';
import type { EnquiryNotice, NotificationService } from '../src/modules/notification';

const valid = {
  name: 'Maha Alavi',
  email: 'Studio@Example.com',
  studio: 'Maha Alavi Studio',
  basedIn: 'Lahore & Tokyo',
  portfolioLink: '@mahalavistudio',
  programmeArea: 'architectural-hardware',
  message: 'Sculptural bronze hardware, cast in small editions.',
};

test('a complete enquiry parses with a normalised email', () => {
  const parsed = parseEnquiry(valid);
  assert.equal(parsed.email, 'studio@example.com');
  assert.equal(parsed.programmeArea, 'architectural-hardware');
});

test('optional fields may be left out', () => {
  const parsed = parseEnquiry({ name: 'A', email: 'a@example.com', message: 'Hello' });
  assert.equal(parsed.studio, null);
  assert.equal(parsed.programmeArea, null);
});

test('name, email and message are required', () => {
  assert.throws(() => parseEnquiry({ ...valid, name: ' ' }), /Your name is required/);
  assert.throws(() => parseEnquiry({ ...valid, message: '' }), /About your practice is required/);
});

test('an unknown programme area is rejected', () => {
  assert.throws(() => parseEnquiry({ ...valid, programmeArea: 'jewellery' }), /Choose one of the listed options/);
});

test('the enquiry is saved before anyone is emailed', async () => {
  const events: string[] = [];
  const repo = { create: async (_e: EnquiryInput) => (events.push('saved'), 1) };
  const notifications = { enquiryReceived: async (_e: EnquiryNotice) => void events.push('emailed') };
  const service = new EnquiryService(repo as unknown as EnquiryRepository, notifications as unknown as NotificationService);

  const answer = await service.submit(parseEnquiry(valid));
  assert.equal(answer.message, RECEIVED_MESSAGE);
  assert.deepEqual(events, ['saved', 'emailed']);
});

test('if saving fails, nobody is emailed and the error reaches the visitor', async () => {
  let emailed = false;
  const repo = { create: async () => Promise.reject(new Error('database down')) };
  const notifications = { enquiryReceived: async () => void (emailed = true) };
  const service = new EnquiryService(repo as unknown as EnquiryRepository, notifications as unknown as NotificationService);

  await assert.rejects(service.submit(parseEnquiry(valid)), /database down/);
  assert.equal(emailed, false);
});
