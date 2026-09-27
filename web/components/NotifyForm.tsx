'use client';

import { useState, type FormEvent } from 'react';
import { joinWaitlist } from '../lib/api';
import type { SiteContent } from '../lib/content';
import { HoneypotField } from './HoneypotField';

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; message: string } | { kind: 'error'; message: string };

export function NotifyForm({ notify }: { notify: SiteContent['notify'] }) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ kind: 'sending' });
    try {
      const { message } = await joinWaitlist({
        email: String(data.get('email') ?? ''),
        leaveBlank: String(data.get('leaveBlank') ?? ''),
      });
      setState({ kind: 'done', message });
    } catch (error) {
      setState({ kind: 'error', message: error instanceof Error ? error.message : 'Something went wrong. Try again.' });
    }
  }

  if (state.kind === 'done') {
    return (
      <p className="form-done" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form className="notify" onSubmit={onSubmit}>
      <label className="form-label" htmlFor="notify-email">
        {notify.label}
      </label>
      <div className="notify__row">
        <input id="notify-email" name="email" type="email" required autoComplete="email" placeholder={notify.placeholder} />
        <button type="submit" disabled={state.kind === 'sending'}>
          {state.kind === 'sending' ? notify.sending : notify.button}
        </button>
      </div>
      <HoneypotField id="notify-leave-blank" />
      {state.kind === 'error' ? (
        <p className="form-status form-status--error" role="alert">
          {state.message}
        </p>
      ) : (
        <p className="notify__note">{notify.note}</p>
      )}
    </form>
  );
}
