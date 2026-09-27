import type { ProgrammeArea } from '@purna/contracts';
import { asObject, optionalChoice, optionalString, requireEmail, requireString } from '../../common/validation';

export const PROGRAMME_AREAS: readonly ProgrammeArea[] = [
  'contemporary-design',
  'art-ceramics-objects',
  'vintage-found',
  'architectural-hardware',
  'other',
];

export interface EnquiryInput {
  name: string;
  email: string;
  studio: string | null;
  basedIn: string | null;
  portfolioLink: string | null;
  programmeArea: ProgrammeArea | null;
  message: string;
}

export function parseEnquiry(body: unknown): EnquiryInput {
  const input = asObject(body);
  return {
    name: requireString(input, 'name', 'Your name', 120),
    email: requireEmail(input),
    studio: optionalString(input, 'studio', 'Studio or practice', 160),
    basedIn: optionalString(input, 'basedIn', 'Based in', 120),
    portfolioLink: optionalString(input, 'portfolioLink', 'Website or Instagram', 300),
    programmeArea: optionalChoice(input, 'programmeArea', 'Programme', PROGRAMME_AREAS),
    message: requireString(input, 'message', 'About your practice', 4000),
  };
}
