import type { ApiErrorBody, EnquiryRequest, EnquiryResponse, WaitlistRequest, WaitlistResponse } from '@purna/contracts';

// The only code in the web app that talks to the server.

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("We couldn't reach the server. Check your connection and try again.", 0);
  }

  if (!response.ok) {
    let message = `Something went wrong (error ${response.status}). Try again in a moment.`;
    try {
      const data = (await response.json()) as Partial<ApiErrorBody>;
      if (data.message) message = Array.isArray(data.message) ? data.message.join(' ') : data.message;
    } catch {
      // Keep the generic message when the body isn't JSON.
    }
    throw new ApiError(message, response.status);
  }
  return (await response.json()) as T;
}

export const joinWaitlist = (request: WaitlistRequest) => post<WaitlistResponse>('/waitlist', request);

export const sendEnquiry = (request: EnquiryRequest) => post<EnquiryResponse>('/enquiries', request);
