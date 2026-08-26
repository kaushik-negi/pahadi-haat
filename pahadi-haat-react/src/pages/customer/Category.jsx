import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../../api/catalog';
import ProductCard from '../../components/ProductCard';
import { Breadcrumb, Loading, ErrorBanner } from '../../components/Shared';
import { useCart } from '../../context/CartContext';

export default function Category() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchCategories(), fetchProducts(slug ? { category: slug } : {})])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [slug]);

  const category = slug ? categories.find((c) => c.slug === slug) : null;

  return (
    <main className="page">
      <div className="page__header">
        <Breadcrumb items={[{ label: 'Products', to: '/' }, { label: 'Categories', to: '/category' }, { label: category ? category.label : 'All categories' }]} />
        <h1 className="page__title">{category ? category.label : 'All Categories'}</h1>
      </div>

      {!slug && !loading && (
        <div className="u-container">
          <div className="categories__grid" style={{ marginBottom: 40 }}>
            {categories.map((c) => (
              <Link className="category-card" to={`/category/${c.slug}`} key={c.slug}>
                <span className="category-card__img-wrap"><img src={c.img} alt={c.label} loading="lazy" /></span>
                <span className="category-card__label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="page__body u-container">
        {error && <ErrorBanner message={error} onRetry={load} />}
        {loading ? (
          <Loading label="Loading products…" />
        ) : products.length === 0 ? (
          <p className="empty-state">No products listed in this category yet.</p>
        ) : (
          <div className="products__grid">
            {products.map((p) => <ProductCard product={p} onAdd={addToCart} key={p.id} />)}
          </div>
        )}
        <div className="page__actions">
          <Link className="btn btn--outline" to="/shops">Browse shops instead →</Link>
        </div>
      </div>
    </main>
  );
}
