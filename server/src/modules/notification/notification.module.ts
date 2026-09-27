import { Module } from '@nestjs/common';
import { EMAIL_SENDER } from './email/email-sender';
import { ResendEmailSender } from './email/resend-email-sender';
import { NotificationService } from './notification.service';

// To move off Resend later, change only the useClass binding below. NotificationService and every caller depend
// on the EmailSender interface, never on Resend directly.
@Module({
  providers: [NotificationService, { provide: EMAIL_SENDER, useClass: ResendEmailSender }],
  exports: [NotificationService],
})
export class NotificationModule {}
