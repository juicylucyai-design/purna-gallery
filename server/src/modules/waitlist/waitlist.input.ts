import { asObject, requireEmail } from '../../common/validation';

export interface SubscribeInput {
  email: string;
}

export function parseSubscribe(body: unknown): SubscribeInput {
  const input = asObject(body);
  return { email: requireEmail(input) };
}
