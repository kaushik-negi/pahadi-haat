import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../api/orders';
import { formatPrice } from '../../utils/format';
import { ErrorBanner } from '../../components/Shared';

export default function PlaceOrder() {
  const { lastOrder, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!lastOrder) return <Navigate to="/cart" replace />;
  if (!user || user.role !== 'customer') {
    return <Navigate to="/login" replace state={{ requiredRole: 'customer', redirectTo: '/place-order' }} />;
  }

  const { lines, subtotal, deliveryFee, total, address, payment } = lastOrder;

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await placeOrder({
        addressLine: address.line,
        city: address.city,
        postalCode: address.postal,
        country: address.country,
        paymentMethod: payment,
        items: lines.map(({ product, qty }) => ({ productId: product.id, qty })),
      });
      clearCart();
      navigate(`/order/${res.orderId}/tracking`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="page__header"><h1 className="page__title">Confirm Your Order</h1></div>
      <div className="page__body u-container checkout-grid">
        <div className="checkout-main">
          {error && <ErrorBanner message={error} />}
          {lines.map(({ product, qty }) => (
            <div className="cart-line" key={product.id}>
              <img src={product.img} alt={product.title} className="cart-line__img" />
              <div className="cart-line__body">
                <h3>{product.title}</h3>
                <p>Quantity: {qty}</p>
              </div>
              <div className="cart-line__price"><strong>{formatPrice(product.price * qty)}</strong></div>
            </div>
          ))}

          <section className="checkout-block">
            <h3 className="page__subtitle">Payment</h3>
            <p>{payment === 'cod' ? 'Cash on Delivery / Pay on Delivery' : payment === 'upi' ? 'UPI' : 'Card'}</p>
          </section>

          <section className="checkout-block">
            <h3 className="page__subtitle">Delivery Address</h3>
            <p>{address.line || '—'}, {address.city || '—'}, {address.postal || '—'}, {address.country || '—'}</p>
          </section>
        </div>

        <aside className="checkout-summary">
          <h3 className="page__subtitle">Price Details</h3>
          <div className="checkout-summary__row"><span>Price</span><span>{formatPrice(subtotal)}</span></div>
          <div className="checkout-summary__row"><span>Delivery fees</span><span>{formatPrice(deliveryFee)}</span></div>
          <div className="checkout-summary__row checkout-summary__row--total"><span>Total Payable</span><span>{formatPrice(total)}</span></div>
          <button className="btn btn--pink btn--lg" style={{ width: '100%' }} onClick={handlePlaceOrder} disabled={submitting}>
            {submitting ? 'PLACING ORDER…' : 'PLACE ORDER'}
          </button>
        </aside>
      </div>
    </main>
  );
}
