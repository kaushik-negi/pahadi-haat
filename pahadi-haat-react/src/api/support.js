import { apiFetch } from './client';

export function sendContactMessage(message) {
  return apiFetch('/support/contact', { method: 'POST', body: message, auth: false });
}
