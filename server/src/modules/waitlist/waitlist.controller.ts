import { Body, Controller, HttpCode, Inject, Ip, Post } from '@nestjs/common';
import type { WaitlistResponse } from '@purna/contracts';
import { RateLimiter } from '../../common/rate-limit';
import { asObject, isHoneypotFilled } from '../../common/validation';
import { parseSubscribe } from './waitlist.input';
import { SUBSCRIBED_MESSAGE, WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  private readonly limiter = new RateLimiter(5, 10 * 60_000);

  constructor(@Inject(WaitlistService) private readonly waitlist: WaitlistService) {}

  @Post()
  @HttpCode(201)
  subscribe(@Body() body: unknown, @Ip() ip: string): Promise<WaitlistResponse> | WaitlistResponse {
    this.limiter.check(ip);
    if (isHoneypotFilled(asObject(body))) return { message: SUBSCRIBED_MESSAGE };
    return this.waitlist.subscribe(parseSubscribe(body));
  }
}
