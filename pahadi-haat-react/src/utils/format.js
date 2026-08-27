export function formatPrice(n) {
  if (n === null || n === undefined || isNaN(Number(n))) return '₹0';
  const num = Number(n);
  return `₹${Number.isInteger(num) ? num : num.toFixed(1)}`;
}

export function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function makeOrderId() {
  return 'PH' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
