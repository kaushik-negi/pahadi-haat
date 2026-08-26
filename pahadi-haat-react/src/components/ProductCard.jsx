import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product, onAdd }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__media">
        {product.off && <span className="product-card__badge">{product.off}%<br />Off</span>}
        <img src={product.img} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__weight">{product.weight || '\u00A0'}</p>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.old && <span className="product-card__price-old">{formatPrice(product.old)}</span>}
        </div>
        <button className="product-card__btn" type="button" onClick={handleAdd}>
          {justAdded ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
