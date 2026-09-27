import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification';
import { EnquiryController } from './enquiry.controller';
import { EnquiryRepository } from './enquiry.repository';
import { EnquiryService } from './enquiry.service';

@Module({
  imports: [NotificationModule],
  controllers: [EnquiryController],
  providers: [EnquiryRepository, EnquiryService],
})
export class EnquiryModule {}
