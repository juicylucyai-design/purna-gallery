// Email wording and layout. Pure functions: no sending, no configuration. Edit copy here without touching logic.

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

/** What the Enquiry module hands over when a designer writes in. */
export interface EnquiryNotice {
  name: string;
  email: string;
  studio: string | null;
  basedIn: string | null;
  portfolioLink: string | null;
  programmeArea: string | null;
  message: string;
}

const PROGRAMME_LABELS: Record<string, string> = {
  'contemporary-design': 'Contemporary design',
  'art-ceramics-objects': 'Art, ceramics & objects',
  'vintage-found': 'Vintage & found',
  'architectural-hardware': 'Architectural hardware',
  other: 'Other',
};

const SIGN_OFF_TEXT = `\n\nPurna Gallery\nAlserkal Avenue, Dubai\npurnagallery.com`;

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Wraps paragraphs in the house style: sand ground, ink text, Lora with Georgia as the email-safe fallback. */
function layout(paragraphs: string[]): string {
  const body = paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
  return `<div style="background:#e9e2d6;padding:32px 20px">
  <div style="max-width:520px;margin:0 auto;font-family:Lora,Georgia,serif;font-size:15px;line-height:1.6;color:#2a1b17">
    <p style="margin:0 0 28px;font-family:'Josefin Sans',Futura,'Century Gothic',sans-serif;font-size:20px;letter-spacing:8px">PURNA</p>
    ${body}
    <p style="margin:28px 0 0;font-size:12px;color:#6b5a4e;letter-spacing:1px">PURNA GALLERY &middot; ALSERKAL AVENUE, DUBAI</p>
  </div>
</div>`;
}

export function welcomeEmail(): EmailContent {
  const paragraphs = [
    'Thank you for your interest in Purna.',
    'Purna is a contemporary South Asian design house in Alserkal Avenue, Dubai, bringing together collectible design, art, ceramics, vintage pieces and architectural hardware.',
    "We're preparing our inaugural programme now. We'll write to you when the doors open, and only then.",
  ];
  return {
    subject: 'Purna is coming to Alserkal Avenue',
    text: paragraphs.join('\n\n') + SIGN_OFF_TEXT,
    html: layout(paragraphs),
  };
}

export function enquiryReceiptEmail(name: string): EmailContent {
  const paragraphs = [
    `Dear ${name},`,
    'Thank you for writing to Purna. We read every enquiry personally and will reply by email.',
    'We are building our inaugural programme with a small group of designers and studios, so it may take a little time for us to respond properly.',
  ];
  return {
    subject: 'We received your note',
    text: paragraphs.join('\n\n') + SIGN_OFF_TEXT,
    html: layout(paragraphs),
  };
}

export function enquiryAlertEmail(enquiry: EnquiryNotice): EmailContent {
  const lines = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Studio: ${enquiry.studio ?? '-'}`,
    `Based in: ${enquiry.basedIn ?? '-'}`,
    `Work online: ${enquiry.portfolioLink ?? '-'}`,
    `Programme: ${enquiry.programmeArea ? (PROGRAMME_LABELS[enquiry.programmeArea] ?? enquiry.programmeArea) : '-'}`,
  ];
  const paragraphs = [`New designer enquiry from ${enquiry.name}.`, lines.join('\n'), enquiry.message, 'Reply to this email to answer them directly.'];
  return {
    subject: `Designer enquiry: ${enquiry.name}${enquiry.studio ? `, ${enquiry.studio}` : ''}`,
    text: paragraphs.join('\n\n'),
    html: layout(paragraphs),
  };
}
