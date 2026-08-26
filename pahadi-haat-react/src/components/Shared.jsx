import React from 'react';
import { Link } from 'react-router-dom';

export function StarRating({ value }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? 'stars__star stars__star--full' : 'stars__star'}>★</span>
      ))}
      <span className="stars__value">{value.toFixed(1)}</span>
    </span>
  );
}

export function Breadcrumb({ items }) {
  // items: [{ label, to }] — last item has no `to` (current page)
  return (
    <div className="crumb">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && <span className="crumb__sep">/</span>}
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span className="crumb__current">{it.label}</span>}
        </span>
      ))}
    </div>
  );
}

export function FormField({ label, type = 'text', placeholder, textarea, ...rest }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea ? (
        <textarea className="field__input field__input--textarea" placeholder={placeholder} rows={3} {...rest} />
      ) : (
        <input className="field__input" type={type} placeholder={placeholder} {...rest} />
      )}
    </label>
  );
}

export function Loading({ label = 'Loading…' }) {
  return <p className="empty-state" role="status">{label}</p>;
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="empty-state" role="alert" style={{ color: '#b3261e' }}>
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" className="btn btn--outline btn--sm" onClick={onRetry} style={{ marginTop: 8 }}>
          Try again
        </button>
      )}
    </div>
  );
}

export function AuthShell({ title, children, footer }) {
  return (
    <section className="auth">
      <div className="auth__card">
        <h1 className="auth__title">{title}</h1>
        {children}
        {footer}
      </div>
    </section>
  );
}
