// Request and response shapes shared by the web app and the server. Both sides import from here only,
// so a form and the controller that receives it can never disagree about a field.

/**
 * Every public form carries this field hidden from people. Bots fill in every input they find; a request with
 * it filled is treated as spam and quietly accepted without being saved.
 */
export interface HoneypotField {
  leaveBlank?: string;
}

// ── Waitlist ─────────────────────────────────────────────────────────────────

export interface WaitlistRequest extends HoneypotField {
  email: string;
}

export interface WaitlistResponse {
  message: string;
}

// ── Designer enquiries ──────────────────────────────────────────────────────

/** The four parts of the Purna programme, plus "other" for practices that span or sit outside them. */
export type ProgrammeArea = 'contemporary-design' | 'art-ceramics-objects' | 'vintage-found' | 'architectural-hardware' | 'other';

export interface EnquiryRequest extends HoneypotField {
  name: string;
  email: string;
  studio?: string;
  basedIn?: string;
  /** A website or Instagram handle where the work can be seen. */
  portfolioLink?: string;
  programmeArea?: ProgrammeArea;
  message: string;
}

export interface EnquiryResponse {
  message: string;
}

// ── Errors ───────────────────────────────────────────────────────────────────

/** The body of any 4xx/5xx answer. `message` is written for the person filling in the form. */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
}
