import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024 && navOpen) setNavOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`site-header${navOpen ? ' site-header--open' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Pahadi Haat home">
          <img src="https://www.figma.com/api/mcp/asset/e4367fe2-1741-4513-a064-59af2c23db34.png" alt="Pahadi Haat logo" />
        </Link>

        <form className="site-header__search" role="search" onSubmit={(e) => e.preventDefault()}>
          <img src="https://www.figma.com/api/mcp/asset/137b08e4-09ed-4b3b-8af0-572b9fcf885d.svg" alt="" />
          <label htmlFor="searchInput" className="u-visually-hidden">Search for products</label>
          <input id="searchInput" className="site-header__search-input" type="search" placeholder="Search for products" />
        </form>

        <button
          className="site-header__burger"
          aria-expanded={navOpen}
          aria-controls="headerActions"
          aria-label="Toggle navigation menu"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span></span><span></span><span></span>
        </button>

        <nav className="site-header__actions" id="headerActions" aria-label="Account navigation">
          <NavLink to="/shops" className="site-header__navlink">Shops</NavLink>
          <NavLink to="/help" className="site-header__navlink">Help</NavLink>

          {!user && (
            <>
              <Link to="/login" className="site-header__action">
                <img src="https://www.figma.com/api/mcp/asset/f0260a97-8910-4bfb-a875-4b8319a9d269.png" alt="" />
                Login
              </Link>
              <Link to="/signup" className="site-header__action site-header__action--signup">
                <img src="https://www.figma.com/api/mcp/asset/94c0a77c-9b5a-4afb-a124-47852f8147a9.png" alt="" />
                Sign up
              </Link>
            </>
          )}

          {user && user.role === 'customer' && (
            <>
              <span className="site-header__greeting">Hi, {user.name}</span>
              <button className="site-header__linkbtn" onClick={handleLogout}>Logout</button>
            </>
          )}

          {user && user.role !== 'customer' && (
            <>
              <Link to={user.role === 'seller' ? '/seller/dashboard' : '/driver/dashboard'} className="site-header__navlink">
                {user.role === 'seller' ? 'Seller Dashboard' : 'Driver Dashboard'}
              </Link>
              <button className="site-header__linkbtn" onClick={handleLogout}>Logout</button>
            </>
          )}

          <Link to="/cart" className="site-header__cart" aria-label={`Cart, ${totalCount} items`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="site-header__cart-count">{totalCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
