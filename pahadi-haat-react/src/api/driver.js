import { apiFetch } from './client';

export function fetchDeliveries() {
  return apiFetch('/driver/deliveries');
}

export function acceptDelivery(orderId) {
  return apiFetch(`/driver/deliveries/${orderId}/accept`, { method: 'PUT' });
}

export function updateDeliveryStatus(orderId, status) {
  return apiFetch(`/driver/deliveries/${orderId}/status`, { method: 'PUT', body: { status } });
}
