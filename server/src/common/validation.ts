import { BadRequestException } from '@nestjs/common';

// Small, explicit input checks for controllers. Each error names the field the way the form labels it.

export type Input = Record<string, unknown>;

// Deliberately loose: something@something.tld. The only real test of an address is whether mail arrives.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function asObject(body: unknown, label = 'Request body'): Input {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException(`${label} must be a JSON object.`);
  }
  return body as Input;
}

export function requireString(input: Input, key: string, label: string, max = 200): string {
  const raw = input[key];
  if (typeof raw !== 'string' || !raw.trim()) throw new BadRequestException(`${label} is required.`);
  const value = raw.trim();
  if (value.length > max) throw new BadRequestException(`${label} must be ${max} characters or fewer.`);
  return value;
}

export function optionalString(input: Input, key: string, label: string, max = 200): string | null {
  const raw = input[key];
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== 'string') throw new BadRequestException(`${label} must be text.`);
  const value = raw.trim();
  if (value.length > max) throw new BadRequestException(`${label} must be ${max} characters or fewer.`);
  return value || null;
}

/** Returns the address trimmed and lower-cased, so the same person can't sign up twice with different casing. */
export function requireEmail(input: Input, key = 'email', label = 'Email'): string {
  const value = requireString(input, key, label, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(value)) throw new BadRequestException(`${label} doesn't look like an email address. Check it and try again.`);
  return value;
}

export function optionalChoice<T extends string>(input: Input, key: string, label: string, choices: readonly T[]): T | null {
  const raw = input[key];
  if (raw === undefined || raw === null || raw === '') return null;
  if (typeof raw !== 'string' || !choices.includes(raw as T)) throw new BadRequestException(`Choose one of the listed options for ${label}.`);
  return raw as T;
}

/** True when the hidden honeypot field was filled in, which people can't see and bots can't resist. */
export function isHoneypotFilled(input: Input): boolean {
  const raw = input.leaveBlank;
  return typeof raw === 'string' && raw.trim() !== '';
}
