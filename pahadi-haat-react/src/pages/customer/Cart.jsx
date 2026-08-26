import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FormField } from '../../components/Shared';
import { formatPrice } from '../../utils/format';

export default function Cart() {
  const { lines, subtotal, deliveryFee, total, updateQty, removeFromCart, setLastOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ line: '', city: '', postal: '', country: '' });
  const [payment, setPayment] = useState('cod');

  const handleConfirm = () => {
    const draft = { lines, subtotal, deliveryFee, total, address, payment };
    setLastOrder(draft);

    if (!user || user.role !== 'customer') {
      // Send them to log in, then straight back to the order confirmation step.
      navigate('/login', { state: { requiredRole: 'customer', redirectTo: '/place-order' } });
      return;
    }
    navigate('/place-order');
  };

  if (lines.length === 0) {
    return (
      <main className="page">
        <div className="page__header"><h1 className="page__title">Your Cart</h1></div>
        <div className="page__body u-container">
          <p className="empty-state">Your cart is empty.</p>
          <Link className="btn btn--pink" to="/">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page__header"><h1 className="page__title">Your Cart</h1></div>
      <div className="page__body u-container checkout-grid">
        <div className="checkout-main">
          {lines.map(({ product, qty }) => (
            <div className="cart-line" key={product.id}>
              <img src={product.img} alt={product.title} className="cart-line__img" />
              <div className="cart-line__body">
                <h3>{product.title}</h3>
                <p className="cart-line__seller">{product.weight}</p>
                <div className="qty">
                  <button className="qty__btn" aria-label="Decrease quantity" onClick={() => updateQty(product.id, qty - 1)}>−</button>
                  <span className="qty__value">{qty}</span>
                  <button className="qty__btn" aria-label="Increase quantity" onClick={() => updateQty(product.id, qty + 1)}>+</button>
                </div>
                <button className="cart-line__remove" onClick={() => removeFromCart(product.id)}>Remove</button>
              </div>
              <div className="cart-line__price">
                <strong>{formatPrice(product.price * qty)}</strong>
              </div>
            </div>
          ))}

          <section className="checkout-block">
            <h3 className="page__subtitle">Delivery Address</h3>
            <div className="checkout-form">
              <FormField label="Address" placeholder="House no., street, area" value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} />
              <FormField label="City" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <FormField label="Postal Code" placeholder="Postal code" value={address.postal} onChange={(e) => setAddress({ ...address, postal: e.target.value })} />
              <FormField label="Country" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>
          </section>

          <section className="checkout-block">
            <h3 className="page__subtitle">Payment Method</h3>
            <label className="radio-row"><input type="radio" name="pay" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> Cash on Delivery / Pay on Delivery</label>
            <label className="radio-row"><input type="radio" name="pay" checked={payment === 'upi'} onChange={() => setPayment('upi')} /> UPI</label>
            <label className="radio-row"><input type="radio" name="pay" checked={payment === 'card'} onChange={() => setPayment('card')} /> Card</label>
          </section>
        </div>

        <aside className="checkout-summary">
          <h3 className="page__subtitle">Price Details</h3>
          <div className="checkout-summary__row"><span>Price</span><span>{formatPrice(subtotal)}</span></div>
          <div className="checkout-summary__row"><span>Delivery fees</span><span>{formatPrice(deliveryFee)}</span></div>
          <div className="checkout-summary__row checkout-summary__row--total"><span>Total Payable</span><span>{formatPrice(total)}</span></div>
          <button className="btn btn--pink btn--lg" style={{ width: '100%' }} onClick={handleConfirm}>CONFIRM ORDER</button>
        </aside>
      </div>
    </main>
  );
}
