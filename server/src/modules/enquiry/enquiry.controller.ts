import { Body, Controller, HttpCode, Inject, Ip, Post } from '@nestjs/common';
import type { EnquiryResponse } from '@purna/contracts';
import { RateLimiter } from '../../common/rate-limit';
import { asObject, isHoneypotFilled } from '../../common/validation';
import { parseEnquiry } from './enquiry.input';
import { EnquiryService, RECEIVED_MESSAGE } from './enquiry.service';

@Controller('enquiries')
export class EnquiryController {
  private readonly limiter = new RateLimiter(3, 60 * 60_000);

  constructor(@Inject(EnquiryService) private readonly enquiries: EnquiryService) {}

  @Post()
  @HttpCode(201)
  submit(@Body() body: unknown, @Ip() ip: string): Promise<EnquiryResponse> | EnquiryResponse {
    this.limiter.check(ip);
    if (isHoneypotFilled(asObject(body))) return { message: RECEIVED_MESSAGE };
    return this.enquiries.submit(parseEnquiry(body));
  }
}
