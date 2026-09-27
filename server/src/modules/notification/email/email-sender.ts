export interface OutgoingEmail {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

/** Whatever provider is behind it, this is the only shape callers see. A sender that isn't configured (no API
 *  key) is expected to no-op on send() rather than throw, so email stays optional. */
export interface EmailSender {
  send(email: OutgoingEmail): Promise<void>;
}

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');
