import { apiFetch } from './client';

export function fetchMyShop() {
  return apiFetch('/seller/shop');
}

export function fetchMyInventory() {
  return apiFetch('/seller/products');
}

export function addProduct(product) {
  return apiFetch('/seller/products', { method: 'POST', body: product });
}

export function updateProduct(id, updates) {
  return apiFetch(`/seller/products/${id}`, { method: 'PUT', body: updates });
}

export function updateStock(id, stock) {
  return apiFetch(`/seller/products/${id}/stock`, { method: 'PUT', body: { stock } });
}

export function deleteProduct(id) {
  return apiFetch(`/seller/products/${id}`, { method: 'DELETE' });
}
