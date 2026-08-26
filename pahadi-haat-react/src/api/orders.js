import { apiFetch } from './client';

export function placeOrder({ addressLine, city, postalCode, country, paymentMethod, items }) {
  return apiFetch('/orders', {
    method: 'POST',
    body: { addressLine, city, postalCode, country, paymentMethod, items },
  });
}

export function fetchOrder(orderId) {
  return apiFetch(`/orders/${orderId}`);
}

export function fetchTracking(orderId) {
  return apiFetch(`/orders/${orderId}/tracking`);
}
