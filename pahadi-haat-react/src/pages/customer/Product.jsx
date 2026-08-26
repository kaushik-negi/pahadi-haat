import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../../api/catalog';
import { Breadcrumb, StarRating, Loading, ErrorBanner } from '../../components/Shared';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return <main className="page"><div className="page__body u-container"><Loading label="Loading product…" /></div></main>;
  }

  if (error || !product) {
    return <main className="page"><div className="page__body u-container"><ErrorBanner message={error || 'Product not found.'} onRetry={load} /></div></main>;
  }

  return (
    <main className="page">
      <div className="page__body u-container product-detail">
        <div className="product-detail__gallery">
          <img src={product.img} alt={product.title} />
        </div>
        <div className="product-detail__info">
          <Breadcrumb items={[{ label: 'Products', to: '/' }, { label: product.category, to: `/category/${product.category}` }, { label: product.title }]} />
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="product-detail__weight">{product.weight || 'Standard pack'}</p>
          {product.shopId && (
            <p className="product-detail__seller">
              Sold by <Link to={`/shop/${product.shopId}`}>{product.shopName}</Link>
            </p>
          )}
          <div className="product-detail__price-row">
            <span className="product-detail__price">{formatPrice(product.price)}</span>
            {product.old && <span className="product-card__price-old">{formatPrice(product.old)}</span>}
            {product.off && <span className="badge-pill">{product.off}% OFF</span>}
          </div>
          <button className="btn btn--pink btn--lg" onClick={() => addToCart(product)}>Add to Cart</button>

          <table className="spec-table">
            <tbody>
              <tr><td>Brand</td><td>Pahadi Haat Marketplace</td></tr>
              <tr><td>Pack size</td><td>{product.weight || '—'}</td></tr>
              <tr><td>Delivery</td><td>2–3 business days</td></tr>
              <tr><td>Returns</td><td>7-day replacement</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="page__body u-container">
        <h2 className="page__subtitle">Rating and Reviews</h2>
        <p className="review-note">Want to rate this product? You can rate or review this product only after purchasing.</p>
        <div className="review-summary">
          <div className="review-summary__score">
            <span className="review-summary__number">4.2</span>
            <StarRating value={4.2} />
          </div>
          <div className="review-summary__highlights">
            <h4>Highlights</h4>
            <div className="review-summary__tags">
              <span>Crispness <em>131 ratings</em></span>
              <span>Taste <em>121 ratings</em></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
