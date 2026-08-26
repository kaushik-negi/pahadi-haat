import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShop, fetchProducts } from '../../api/catalog';
import ProductCard from '../../components/ProductCard';
import { StarRating, Breadcrumb, Loading, ErrorBanner } from '../../components/Shared';
import { useCart } from '../../context/CartContext';

export default function ShopDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchShop(id), fetchProducts({ shopId: id })])
      .then(([s, prods]) => {
        setShop(s);
        setProducts(prods);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return <main className="page"><div className="page__body u-container"><Loading label="Loading shop…" /></div></main>;
  }

  if (error || !shop) {
    return <main className="page"><div className="page__body u-container"><ErrorBanner message={error || 'Shop not found.'} onRetry={load} /></div></main>;
  }

  return (
    <main className="page">
      <div className="page__header">
        <Breadcrumb items={[{ label: 'Products', to: '/' }, { label: 'Shops', to: '/shops' }, { label: shop.name }]} />
        <h1 className="page__title">Shop Details</h1>
      </div>
      <div className="page__body u-container">
        <div className="shop-banner">
          <div className="shop-banner__avatar" aria-hidden="true">🏬</div>
          <div className="shop-banner__info">
            <h2 className="shop-banner__name">{shop.name}</h2>
            <p className="shop-banner__address">{shop.address}</p>
            <p className="shop-banner__id">Shop ID-{shop.shopId}</p>
          </div>
          <div className="shop-banner__rating">
            <StarRating value={shop.rating} />
            <span className="shop-banner__rating-label">Ratings</span>
          </div>
        </div>
        <h3 className="page__subtitle">Inventory</h3>
        {products.length === 0 ? (
          <p className="empty-state">This shop hasn't listed any products yet.</p>
        ) : (
          <div className="products__grid">
            {products.map((p) => <ProductCard product={p} onAdd={addToCart} key={p.id} />)}
          </div>
        )}
      </div>
    </main>
  );
}
