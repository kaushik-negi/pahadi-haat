import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCategories } from '../../api/catalog';
import { fetchMyShop, fetchMyInventory, addProduct, updateStock, deleteProduct } from '../../api/seller';
import { FormField, Loading, ErrorBanner } from '../../components/Shared';

const emptyForm = { title: '', weight: '', price: '', old: '', off: '', category: '', img: '', stock: 25 };

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchMyShop(), fetchMyInventory(), fetchCategories()])
      .then(([s, inv, cats]) => {
        setShop(s);
        setInventory(inv);
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStockChange = async (product, delta) => {
    const next = Math.max(0, product.stock + delta);
    // Optimistic update so the buttons feel instant.
    setInventory((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: next } : p)));
    try {
      await updateStock(product.id, next);
    } catch (err) {
      setError(err.message);
      load(); // resync on failure
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Remove "${product.title}" from your inventory?`)) return;
    try {
      await deleteProduct(product.id);
      setInventory((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateForm = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title || !form.price || !form.category) {
      setFormError('Title, price, and category are required.');
      return;
    }
    setSaving(true);
    try {
      const created = await addProduct({
        title: form.title,
        weight: form.weight || null,
        price: Number(form.price),
        old: form.old ? Number(form.old) : null,
        off: form.off ? Number(form.off) : null,
        category: form.category,
        img: form.img || null,
        stock: form.stock ? Number(form.stock) : 25,
      });
      setInventory((prev) => [...prev, created]);
      setForm(emptyForm);
      setShowAddForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dash">
        <main className="page"><div className="page__body u-container"><Loading label="Loading your shop…" /></div></main>
      </div>
    );
  }

  return (
    <div className="dash">
      <header className="dash__header">
        <span className="dash__brand">Pahadi Haat <em>Seller</em></span>
        <nav className="dash__nav">
          <span>Hi, {user?.name}</span>
          <button className="btn btn--outline btn--sm" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main className="page">
        <div className="page__header"><h1 className="page__title">Seller Profile</h1></div>
        <div className="page__body u-container">
          {error && <ErrorBanner message={error} onRetry={load} />}

          {shop && (
            <div className="shop-banner">
              <div className="shop-banner__avatar" aria-hidden="true">🏬</div>
              <div className="shop-banner__info">
                <h2 className="shop-banner__name">{shop.name}</h2>
                <p className="shop-banner__address">{shop.address}</p>
                <p className="shop-banner__id">Shop ID-{shop.shopId}</p>
              </div>
            </div>
          )}

          <div className="seller-grid">
            <aside className="inventory-nav">
              <h3 className="page__subtitle">Categories</h3>
              <ul className="inventory-nav__list">
                {categories.map((c) => <li key={c.slug}>{c.label}</li>)}
              </ul>
            </aside>

            <div>
              <div className="seller-grid__toolbar">
                <h3 className="page__subtitle" style={{ margin: 0 }}>Inventory ({inventory.length} items)</h3>
                <button className="btn btn--pink" onClick={() => setShowAddForm((v) => !v)}>
                  {showAddForm ? 'Cancel' : '+ Add Product'}
                </button>
              </div>

              {showAddForm && (
                <form className="checkout-block" onSubmit={handleAddProduct} style={{ marginBottom: 24 }}>
                  {formError && <ErrorBanner message={formError} />}
                  <div className="checkout-form">
                    <FormField label="Title" placeholder="Product title" value={form.title} onChange={updateForm('title')} required />
                    <FormField label="Weight / Pack size" placeholder="e.g. 500 g" value={form.weight} onChange={updateForm('weight')} />
                    <FormField label="Price (₹)" type="number" placeholder="0" value={form.price} onChange={updateForm('price')} required />
                    <FormField label="Old price (₹, optional)" type="number" placeholder="0" value={form.old} onChange={updateForm('old')} />
                    <FormField label="Discount % (optional)" type="number" placeholder="0" value={form.off} onChange={updateForm('off')} />
                    <label className="field">
                      <span className="field__label">Category</span>
                      <select className="field__input" value={form.category} onChange={updateForm('category')} required>
                        <option value="" disabled>Choose a category</option>
                        {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                      </select>
                    </label>
                    <FormField label="Image URL" placeholder="https://…" value={form.img} onChange={updateForm('img')} />
                    <FormField label="Starting stock" type="number" placeholder="25" value={form.stock} onChange={updateForm('stock')} />
                  </div>
                  <button className="btn btn--pink btn--lg" type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Product'}
                  </button>
                </form>
              )}

              {inventory.length === 0 ? (
                <p className="empty-state">You haven't listed any products yet — add your first one above.</p>
              ) : (
                inventory.map((product) => (
                  <div className="inventory-item" key={product.id}>
                    <img className="inventory-item__img" src={product.img} alt={product.title} />
                    <div className="inventory-item__body">
                      <h4>{product.title}</h4>
                      <p className="inventory-item__weight">{product.weight}</p>
                      <div className="qty">
                        <button className="qty__btn" aria-label="Decrease stock" onClick={() => handleStockChange(product, -1)}>−</button>
                        <span className="qty__value">{product.stock}</span>
                        <button className="qty__btn" aria-label="Increase stock" onClick={() => handleStockChange(product, 1)}>+</button>
                      </div>
                      <p className="inventory-item__price">Price <strong>₹{product.price}</strong></p>
                      <button className="cart-line__remove" onClick={() => handleDelete(product)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
