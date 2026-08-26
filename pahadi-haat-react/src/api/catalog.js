import { apiFetch } from './client';

export function fetchCategories() {
  return apiFetch('/categories', { auth: false });
}

export function fetchShops() {
  return apiFetch('/shops', { auth: false });
}

export function fetchShop(id) {
  return apiFetch(`/shops/${id}`, { auth: false });
}

export function fetchProducts({ category, shopId } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (shopId) params.set('shopId', shopId);
  const qs = params.toString();
  return apiFetch(`/products${qs ? `?${qs}` : ''}`, { auth: false });
}

export function fetchProduct(id) {
  return apiFetch(`/products/${id}`, { auth: false });
}
