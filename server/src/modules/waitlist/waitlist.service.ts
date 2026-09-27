import { Inject, Injectable } from '@nestjs/common';
import type { WaitlistResponse } from '@purna/contracts';
import { NotificationService } from '../notification';
import type { SubscribeInput } from './waitlist.input';
import { WaitlistRepository } from './waitlist.repository';

export const SUBSCRIBED_MESSAGE = "Thank you. We'll write when the doors open.";

@Injectable()
export class WaitlistService {
  constructor(
    @Inject(WaitlistRepository) private readonly waitlist: WaitlistRepository,
    @Inject(NotificationService) private readonly notifications: NotificationService,
  ) {}

  /**
   * Someone already on the list gets the same answer as a new subscriber, so the form never reveals whether an
   * address is registered. Only new subscribers get the welcome email.
   */
  async subscribe({ email }: SubscribeInput): Promise<WaitlistResponse> {
    const isNew = await this.waitlist.add(email, 'coming-soon');
    if (isNew) void this.notifications.welcomeSubscriber(email);
    return { message: SUBSCRIBED_MESSAGE };
  }
}
