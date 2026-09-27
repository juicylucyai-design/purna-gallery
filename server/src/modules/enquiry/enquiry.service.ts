import { Inject, Injectable } from '@nestjs/common';
import type { EnquiryResponse } from '@purna/contracts';
import { NotificationService } from '../notification';
import type { EnquiryInput } from './enquiry.input';
import { EnquiryRepository } from './enquiry.repository';

export const RECEIVED_MESSAGE = 'Thank you for writing. We read every enquiry personally and will reply by email.';

@Injectable()
export class EnquiryService {
  constructor(
    @Inject(EnquiryRepository) private readonly enquiries: EnquiryRepository,
    @Inject(NotificationService) private readonly notifications: NotificationService,
  ) {}

  /** Saves first, then emails. If the emails fail the enquiry is still in the database. */
  async submit(enquiry: EnquiryInput): Promise<EnquiryResponse> {
    await this.enquiries.create(enquiry);
    void this.notifications.enquiryReceived(enquiry);
    return { message: RECEIVED_MESSAGE };
  }
}
