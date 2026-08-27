import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEALS, PRODUCE } from '../../data';
import { fetchCategories, fetchProducts } from '../../api/catalog';
import ProductCard from '../../components/ProductCard';
import { Loading, ErrorBanner } from '../../components/Shared';
import { useCart } from '../../context/CartContext';

export default function Home() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchCategories(), fetchProducts()])
      .then(([cats, prods]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);
      })
      .catch((err) => {
        setError(err.message);
        setCategories([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <main id="top">
      <section className="hero" aria-label="Promotional banner">
        <div className="hero__card">
          <span className="hero__watermark" aria-hidden="true">PAHADI HAAT</span>
          <div className="hero__content">
            <p className="hero__tagline">Connecting you to the market</p>
            <Link to="/about" className="hero__cta">Discover Pahadi Haat</Link>
          </div>
          <img className="hero__decor" src="https://www.figma.com/api/mcp/asset/9f86badf-9fe0-4fe0-958a-016b9df06e02.png" alt="" aria-hidden="true" />
          <div className="hero__media">
            <img src="https://www.figma.com/api/mcp/asset/b9bc7adf-050c-4892-af83-15e7d2d563b8.png" alt="Two people in traditional Pahadi attire representing local sellers" />
          </div>
        </div>
      </section>

      {error && <div className="u-container"><ErrorBanner message={error} onRetry={load} /></div>}

      <section className="section" id="categories" aria-labelledby="categoriesHeading">
        <div className="section__head">
          <h2 className="section__title" id="categoriesHeading">Explore by categories</h2>
          <Link to="/category" className="section__link">See All</Link>
        </div>
        {loading ? (
          <div className="u-container"><Loading label="Loading categories…" /></div>
        ) : (
          <div className="categories__grid">
            {safeCategories.map((c) => (
              <Link className="category-card" to={`/category/${c.slug}`} aria-label={`Browse ${c.label}`} key={c.slug}>
                <span className="category-card__img-wrap"><img src={c.img} alt={`${c.label} category`} loading="lazy" /></span>
                <span className="category-card__label">{c.label}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="deals" aria-label="Current deals and offers">
        <div className="deals__track" tabIndex={0}>
          {(DEALS || []).map((src, i) => (
            <div className="deals__item" key={src}><img src={src} alt={`Promotional offer banner ${i + 1}`} loading="lazy" /></div>
          ))}
        </div>
      </section>

      <section className="section" id="local-produce" aria-labelledby="produceHeading">
        <div className="section__head"><h2 className="section__title" id="produceHeading">Local Produce</h2></div>
        <div className="produce__grid">
          {(PRODUCE || []).map((p) => (
            <a className="produce-card" href="#" aria-label={`Browse ${p.label}`} key={p.label}>
              <img src={p.img} alt={p.label} loading="lazy" />
              <span className="produce-card__label">{p.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="popular-products" aria-labelledby="popularHeading">
        <div className="section__head"><h2 className="section__title" id="popularHeading">Popular Products</h2></div>
        {loading ? (
          <div className="u-container"><Loading label="Loading products…" /></div>
        ) : (
          <div className="products__grid">
            {safeProducts.map((p) => <ProductCard product={p} onAdd={addToCart} key={p.id} />)}
          </div>
        )}
      </section>
    </main>
  );
}
