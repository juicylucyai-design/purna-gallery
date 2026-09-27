import type { ProgrammeArea } from '@purna/contracts';
import site from '../content/site.json';

// The page copy. Read at build time from content/site.json, so editing words never means editing components.
// When a CMS arrives, only this file changes: fetch from the CMS here and return the same SiteContent shape.

export interface Picture {
  src: string;
  alt: string;
}

export interface SiteContent {
  meta: { title: string; description: string };
  hero: { status: string; location: string; wordmark: string; subline: string; tagline: string; image: Picture; designersLink: string };
  notify: { label: string; placeholder: string; button: string; sending: string; note: string };
  position: { eyebrow: string; heading: string; lede: string; paragraphs: string[]; audienceLabel: string; audiences: string[] };
  programme: { eyebrow: string; heading: string; pillars: { name: string; summary: string; image: Picture }[]; closing: string };
  location: { eyebrow: string; heading: string; paragraphs: string[]; image: Picture };
  designers: {
    eyebrow: string;
    heading: string;
    intro: string[];
    ways: { title: string; text: string }[];
    formHeading: string;
    button: string;
    sending: string;
    programmeOptions: { value: ProgrammeArea; label: string }[];
  };
  contact: { email: string; phone: string | null; location: string };
}

export const content = site as SiteContent;
