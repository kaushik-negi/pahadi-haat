import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // lines: { [productId]: { product, qty } } — product is a full snapshot
  // (id, title, weight, price, old, off, img, shopId, category) fetched from the API,
  // so the cart doesn't depend on any static product list.
  const [lines, setLinesMap] = useState({});
  const [lastOrder, setLastOrder] = useState(null); // stores a snapshot after checkout, for the tracking page

  const addToCart = (product, qty = 1) => {
    setLinesMap((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing?.qty || 0) + qty;
      return { ...prev, [product.id]: { product, qty: nextQty } };
    });
  };

  const updateQty = (productId, qty) => {
    setLinesMap((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      const existing = prev[productId];
      if (!existing) return prev;
      return { ...prev, [productId]: { ...existing, qty } };
    });
  };

  const removeFromCart = (productId) => updateQty(productId, 0);
  const clearCart = () => setLinesMap({});

  const lineList = useMemo(() => Object.values(lines), [lines]);

  const totalCount = useMemo(() => lineList.reduce((sum, l) => sum + l.qty, 0), [lineList]);
  const subtotal = useMemo(() => lineList.reduce((sum, l) => sum + l.product.price * l.qty, 0), [lineList]);
  const deliveryFee = lineList.length ? 4 : 0;
  const total = subtotal + deliveryFee;

  const value = {
    lines: lineList,
    totalCount, subtotal, deliveryFee, total,
    addToCart, updateQty, removeFromCart, clearCart,
    lastOrder, setLastOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
