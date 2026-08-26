import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchDeliveries, acceptDelivery, updateDeliveryStatus } from '../../api/driver';
import { Loading, ErrorBanner } from '../../components/Shared';

const STATUS_LABEL = {
  PLACED: 'Ready for pickup',
  SHIPPED: 'In transit',
  DELIVERED: 'Delivered',
};

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchDeliveries()
      .then(setDeliveries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAccept = async (orderId) => {
    setBusyId(orderId);
    setError(null);
    try {
      await acceptDelivery(orderId);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleAdvance = async (delivery) => {
    const nextStatus = delivery.status === 'PLACED' ? 'SHIPPED' : 'DELIVERED';
    setBusyId(delivery.orderId);
    setError(null);
    try {
      await updateDeliveryStatus(delivery.orderId, nextStatus);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="dash">
      <header className="dash__header dash__header--driver">
        <span className="dash__brand">Pahadi Haat <em>Driver</em></span>
        <nav className="dash__nav">
          <span>Hi, {user?.name}</span>
          <button className="btn btn--outline btn--sm" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main className="page">
        <div className="page__header"><h1 className="page__title">Driver's Profile</h1></div>
        <div className="page__body u-container">
          <div className="driver-card">
            <div className="driver-card__avatar" aria-hidden="true">🚕</div>
            <div>
              <h2>{user?.name || "Driver's Name"}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <h3 className="page__subtitle">Deliveries</h3>
          {error && <ErrorBanner message={error} onRetry={load} />}

          {loading ? (
            <Loading label="Loading deliveries…" />
          ) : deliveries.length === 0 ? (
            <p className="empty-state">No deliveries to show right now — check back soon.</p>
          ) : (
            <div className="shop-list">
              {deliveries.map((d) => (
                <div className="shop-row" key={d.orderId}>
                  <span className="shop-row__avatar" aria-hidden="true">📦</span>
                  <span className="shop-row__info">
                    <span className="shop-row__name">Order #{d.orderId} — {d.customerName}</span>
                    <span className="shop-row__address">{d.address}</span>
                  </span>
                  <span className="shop-row__meta">
                    <span className="badge-pill badge-pill--sm">{STATUS_LABEL[d.status] || d.status}</span>
                    {!d.assignedToMe && (
                      <button className="btn btn--outline btn--sm" disabled={busyId === d.orderId} onClick={() => handleAccept(d.orderId)}>
                        {busyId === d.orderId ? 'Accepting…' : 'Accept'}
                      </button>
                    )}
                    {d.assignedToMe && d.status !== 'DELIVERED' && (
                      <button className="btn btn--pink btn--sm" disabled={busyId === d.orderId} onClick={() => handleAdvance(d)}>
                        {busyId === d.orderId ? 'Updating…' : d.status === 'PLACED' ? 'Mark Shipped' : 'Mark Delivered'}
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
