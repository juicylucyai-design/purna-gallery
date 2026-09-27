import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification';
import { WaitlistController } from './waitlist.controller';
import { WaitlistRepository } from './waitlist.repository';
import { WaitlistService } from './waitlist.service';

@Module({
  imports: [NotificationModule],
  controllers: [WaitlistController],
  providers: [WaitlistRepository, WaitlistService],
})
export class WaitlistModule {}
