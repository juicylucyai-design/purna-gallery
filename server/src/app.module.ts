import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EnquiryModule } from './modules/enquiry';
import { NotificationModule } from './modules/notification';
import { WaitlistModule } from './modules/waitlist';

// One line per module from the blueprint. Collection, designers and exhibitions are added here as they're built.
@Module({
  imports: [DatabaseModule, NotificationModule, WaitlistModule, EnquiryModule],
})
export class AppModule {}
