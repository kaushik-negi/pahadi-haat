import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchShops } from '../../api/catalog';
import { StarRating, Breadcrumb, Loading, ErrorBanner } from '../../components/Shared';

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchShops()
      .then(setShops)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <main className="page">
      <div className="page__header">
        <Breadcrumb items={[{ label: 'Products', to: '/' }, { label: 'Shops' }]} />
        <h1 className="page__title">Shops near you</h1>
      </div>
      <div className="page__body u-container">
        {error && <ErrorBanner message={error} onRetry={load} />}
        {loading ? (
          <Loading label="Loading shops…" />
        ) : (
          <div className="shop-list">
            {shops.map((s) => (
              <Link className="shop-row" to={`/shop/${s.id}`} key={s.id}>
                <span className="shop-row__avatar" aria-hidden="true">🏬</span>
                <span className="shop-row__info">
                  <span className="shop-row__name">{s.name}</span>
                  <span className="shop-row__address">{s.address}</span>
                </span>
                <span className="shop-row__meta">
                  <StarRating value={s.rating} />
                  <span className="shop-row__distance">{s.distance}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
