import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { EmailSender, OutgoingEmail } from '../src/modules/notification/email/email-sender';
import { NotificationService } from '../src/modules/notification/notification.service';
import { escapeHtml } from '../src/modules/notification/templates';

const enquiry = {
  name: 'Vikash Kalra',
  email: 'vikash@example.com',
  studio: null,
  basedIn: 'New Delhi',
  portfolioLink: null,
  programmeArea: 'art-ceramics-objects',
  message: 'Sculpture <and> ceramics.',
};

function withTeam<T>(value: string | undefined, run: () => T): T {
  const previous = process.env.TEAM_EMAIL_TO;
  if (value === undefined) delete process.env.TEAM_EMAIL_TO;
  else process.env.TEAM_EMAIL_TO = value;
  try {
    return run();
  } finally {
    if (previous === undefined) delete process.env.TEAM_EMAIL_TO;
    else process.env.TEAM_EMAIL_TO = previous;
  }
}

test('an enquiry sends a receipt to the designer and an alert to the team with Reply-To set', async () => {
  const sent: OutgoingEmail[] = [];
  const sender: EmailSender = { send: async (email) => void sent.push(email) };
  const service = withTeam('sanjana@purnagallery.com, team@purnagallery.com', () => new NotificationService(sender));

  await service.enquiryReceived(enquiry);
  const receipt = sent.find((email) => email.to.includes('vikash@example.com'));
  const alert = sent.find((email) => email.to.includes('sanjana@purnagallery.com'));
  assert.ok(receipt);
  assert.ok(alert);
  assert.deepEqual(alert.to, ['sanjana@purnagallery.com', 'team@purnagallery.com']);
  assert.equal(alert.replyTo, 'vikash@example.com');
  assert.match(alert.text, /Art, ceramics & objects/);
  assert.match(alert.html, /Sculpture &lt;and&gt; ceramics\./);
});

test('without TEAM_EMAIL_TO only the receipt is sent', async () => {
  const sent: OutgoingEmail[] = [];
  const service = withTeam(undefined, () => new NotificationService({ send: async (email) => void sent.push(email) }));
  await service.enquiryReceived(enquiry);
  assert.equal(sent.length, 1);
});

test('a failing email provider never throws to the caller', async () => {
  const service = new NotificationService({ send: async () => Promise.reject(new Error('Resend is down')) });
  await assert.doesNotReject(service.welcomeSubscriber('collector@example.com'));
  await assert.doesNotReject(service.enquiryReceived(enquiry));
});

test('escapeHtml neutralises markup in visitor text', () => {
  assert.equal(escapeHtml('<script>"x" & y</script>'), '&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;');
});
