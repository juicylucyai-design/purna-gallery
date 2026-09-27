import { Inject, Injectable } from '@nestjs/common';
import { Db } from '../../database/db';

@Injectable()
export class WaitlistRepository {
  constructor(@Inject(Db) private readonly db: Db) {}

  /** Adds the address; returns false if it was already on the list. */
  async add(email: string, source: string): Promise<boolean> {
    const rows = await this.db.query<{ id: number }>(
      `INSERT INTO waitlist_subscribers (email, source) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email, source],
    );
    return rows.length > 0;
  }
}
