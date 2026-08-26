import { apiFetch } from './client';

export function signup({ firstName, lastName, email, password, phone }) {
  return apiFetch('/auth/signup', {
    method: 'POST',
    auth: false,
    body: { firstName, lastName, email, password, phone },
  });
}

export function registerSeller({ fullName, phone, email, password, shopName, shopAddress }) {
  return apiFetch('/auth/seller/register', {
    method: 'POST',
    auth: false,
    body: { fullName, phone, email, password, shopName, shopAddress },
  });
}

export function registerDriver({ fullName, phone, email, password, vehicleNumber, vehicleType }) {
  return apiFetch('/auth/driver/register', {
    method: 'POST',
    auth: false,
    body: { fullName, phone, email, password, vehicleNumber, vehicleType },
  });
}

export function login({ email, password, role }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password, role },
  });
}
