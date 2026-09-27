import { Inject, Injectable, Logger } from '@nestjs/common';
import { EMAIL_SENDER, type EmailSender } from './email/email-sender';
import { enquiryAlertEmail, enquiryReceiptEmail, welcomeEmail, type EmailContent, type EnquiryNotice } from './templates';

/**
 * The one thing the rest of the site talks to for "tell someone this happened." Decides what to send and to
 * whom; the EmailSender decides how. Never throws or blocks the caller: a failed email must never lose a signup
 * or an enquiry that has already been saved.
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly teamAddresses = (process.env.TEAM_EMAIL_TO ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  constructor(@Inject(EMAIL_SENDER) private readonly emailer: EmailSender) {}

  welcomeSubscriber(email: string): Promise<void> {
    return this.deliver([email], welcomeEmail());
  }

  /** Alerts the team (with Reply-To set to the designer) and sends the designer a receipt. */
  enquiryReceived(enquiry: EnquiryNotice): Promise<void> {
    const sends = [this.deliver([enquiry.email], enquiryReceiptEmail(enquiry.name))];
    if (this.teamAddresses.length) sends.push(this.deliver(this.teamAddresses, enquiryAlertEmail(enquiry), enquiry.email));
    else this.logger.warn('TEAM_EMAIL_TO is not set; the enquiry is saved but nobody was alerted.');
    return Promise.all(sends).then(() => undefined);
  }

  private async deliver(to: string[], content: EmailContent, replyTo?: string): Promise<void> {
    try {
      await this.emailer.send({ to, ...content, replyTo });
    } catch (error) {
      this.logger.warn(`Email "${content.subject}" failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
