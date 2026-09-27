import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { Db } from './db';

@Controller('health')
export class HealthController {
  constructor(@Inject(Db) private readonly db: Db) {}

  @Get()
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.db.query('SELECT 1');
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException('Database is not reachable.');
    }
  }
}
