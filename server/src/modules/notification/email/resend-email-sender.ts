import { Injectable, Logger } from '@nestjs/common';
import type { EmailSender, OutgoingEmail } from './email-sender';

const DEFAULT_FROM = 'Purna Gallery <onboarding@resend.dev>';

/**
 * Sends email through Resend's API. Swap this class's binding in notification.module.ts for a different
 * EmailSender if Resend doesn't work out; nothing outside this file knows it's Resend.
 *
 * Setup: create a Resend account and API key (RESEND_API_KEY). The default onboarding@resend.dev sender only
 * delivers to your own Resend account address, so verify purnagallery.com in Resend and set EMAIL_FROM before
 * welcome emails can reach subscribers.
 */
@Injectable()
export class ResendEmailSender implements EmailSender {
  private readonly logger = new Logger(ResendEmailSender.name);
  private readonly apiKey = process.env.RESEND_API_KEY?.trim();
  private readonly from = process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;

  async send({ to, subject, text, html, replyTo }: OutgoingEmail): Promise<void> {
    if (!this.apiKey) {
      this.logger.debug(`Skipped email "${subject}": RESEND_API_KEY is not set.`);
      return;
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.from, to, subject, text, html, reply_to: replyTo }),
    });
    if (!response.ok) {
      throw new Error(`Resend API returned ${response.status}: ${await response.text()}`);
    }
  }
}
