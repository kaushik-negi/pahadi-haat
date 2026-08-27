import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTracking } from '../../api/orders';
import { Loading, ErrorBanner } from '../../components/Shared';

export default function Tracking() {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchTracking(orderId)
      .then(setTracking)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [orderId]);

  return (
    <main className="page">
      <div className="page__body u-container">
        <p className="success-banner">
          YAY! Your order <strong>#{orderId}</strong> was placed successfully. Thanks for shopping with us!
        </p>

        {loading ? (
          <Loading label="Loading tracking status…" />
        ) : error ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : (
          <div className="tracking-grid">
            <div>
              <h3 className="page__subtitle">Order Summary</h3>
              <p>Order ID: <strong>#{orderId}</strong></p>
              <p>You'll receive updates on this order by email and SMS.</p>
            </div>

            <div>
              <h3 className="page__subtitle">Order Tracking</h3>
              <ol className="timeline">
                {(tracking?.steps || []).map((step) => (
                  <li className={step.done ? 'timeline__step timeline__step--done' : 'timeline__step'} key={step.label}>
                    {step.label}
                  </li>
                ))}
              </ol>
              <button className="btn btn--outline" onClick={load}>Refresh Status</button>
            </div>
          </div>
        )}

        <Link className="btn btn--pink" style={{ marginTop: 32, display: 'inline-block' }} to="/">Continue Shopping</Link>
      </div>
    </main>
  );
}
