export function formatPrice(n) {
  return `₹${Number.isInteger(n) ? n : n.toFixed(1)}`;
}

export function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function makeOrderId() {
  return 'PH' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
