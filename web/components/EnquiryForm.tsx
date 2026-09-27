'use client';

import type { ProgrammeArea } from '@purna/contracts';
import { useState, type FormEvent } from 'react';
import { sendEnquiry } from '../lib/api';
import type { SiteContent } from '../lib/content';
import { HoneypotField } from './HoneypotField';

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; message: string } | { kind: 'error'; message: string };

const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim();

export function EnquiryForm({ designers }: { designers: SiteContent['designers'] }) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ kind: 'sending' });
    try {
      const { message } = await sendEnquiry({
        name: text(data, 'name'),
        email: text(data, 'email'),
        studio: text(data, 'studio') || undefined,
        basedIn: text(data, 'basedIn') || undefined,
        portfolioLink: text(data, 'portfolioLink') || undefined,
        programmeArea: (text(data, 'programmeArea') || undefined) as ProgrammeArea | undefined,
        message: text(data, 'message'),
        leaveBlank: text(data, 'leaveBlank'),
      });
      setState({ kind: 'done', message });
    } catch (error) {
      setState({ kind: 'error', message: error instanceof Error ? error.message : 'Something went wrong. Try again.' });
    }
  }

  if (state.kind === 'done') {
    return (
      <div className="enquiry" role="status">
        <h3>{designers.formHeading}</h3>
        <p className="form-done">{state.message}</p>
      </div>
    );
  }

  return (
    <form className="enquiry" onSubmit={onSubmit} aria-labelledby="enquiry-title">
      <h3 id="enquiry-title">{designers.formHeading}</h3>
      <div className="enquiry__pair">
        <div className="field">
          <label htmlFor="enquiry-name">Your name</label>
          <input id="enquiry-name" name="name" required maxLength={120} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="enquiry-email">Email</label>
          <input id="enquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" />
        </div>
      </div>
      <div className="enquiry__pair">
        <div className="field">
          <label htmlFor="enquiry-studio">
            Studio or practice <span className="optional">(optional)</span>
          </label>
          <input id="enquiry-studio" name="studio" maxLength={160} autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="enquiry-based-in">
            Based in <span className="optional">(optional)</span>
          </label>
          <input id="enquiry-based-in" name="basedIn" maxLength={120} placeholder="City, country" />
        </div>
      </div>
      <div className="enquiry__pair">
        <div className="field">
          <label htmlFor="enquiry-link">
            Website or Instagram <span className="optional">(optional)</span>
          </label>
          <input id="enquiry-link" name="portfolioLink" maxLength={300} placeholder="@studio or website" />
        </div>
        <div className="field">
          <label htmlFor="enquiry-programme">
            Programme <span className="optional">(optional)</span>
          </label>
          <select id="enquiry-programme" name="programmeArea" defaultValue="">
            <option value="">Choose one</option>
            {designers.programmeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="enquiry-message">About your practice</label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          maxLength={4000}
          placeholder="The work you make, the materials you use, and what you'd like to explore with Purna."
        />
      </div>
      <HoneypotField id="enquiry-leave-blank" />
      <button className="button" type="submit" disabled={state.kind === 'sending'}>
        {state.kind === 'sending' ? designers.sending : designers.button}
      </button>
      {state.kind === 'error' && (
        <p className="form-status form-status--error" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
