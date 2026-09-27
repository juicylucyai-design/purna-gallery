import { Inject, Injectable } from '@nestjs/common';
import { Db } from '../../database/db';
import type { EnquiryInput } from './enquiry.input';

@Injectable()
export class EnquiryRepository {
  constructor(@Inject(Db) private readonly db: Db) {}

  /** Saves the enquiry and returns its id. */
  async create(enquiry: EnquiryInput): Promise<number> {
    const [row] = await this.db.query<{ id: number }>(
      `INSERT INTO designer_enquiries (name, email, studio, based_in, portfolio_link, programme_area, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [enquiry.name, enquiry.email, enquiry.studio, enquiry.basedIn, enquiry.portfolioLink, enquiry.programmeArea, enquiry.message],
    );
    return row.id;
  }
}
