import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <img className="site-footer__chat" src="https://www.figma.com/api/mcp/asset/f934127f-7446-4103-a6aa-33e740855b91.png" alt="Chat with us" />
        <img className="site-footer__bag" src="https://www.figma.com/api/mcp/asset/20b97428-5c0b-491a-bc12-15496727f0bc.png" alt="Paper shopping bag filled with fresh groceries" />
      </div>
      <div className="site-footer__bottom">
        <h2 className="site-footer__heading">Why choose us</h2>
        <ul className="site-footer__perks">
          <li className="site-footer__perk"><h3>Local &amp; Authentic</h3><p>Sourced directly from Pahadi farmers and sellers near you.</p></li>
          <li className="site-footer__perk"><h3>Fast Delivery</h3><p>Get your groceries and essentials delivered to your doorstep.</p></li>
          <li className="site-footer__perk"><h3>Fair Prices</h3><p>No middlemen — better prices for buyers and sellers alike.</p></li>
          <li className="site-footer__perk"><h3>Support Local</h3><p>Every order supports a local shop or artisan in the hills.</p></li>
        </ul>
        <div className="site-footer__cols">
          <div>
            <p className="site-footer__brand">Pahadi Haat</p>
            <p>Connecting mountain communities to the market — fresh produce, everyday essentials, and local craft, all in one place.</p>
          </div>
          <div className="site-footer__col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shops">All Shops</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/about">About Pahadi Haat</Link></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Get Involved</h4>
            <ul>
              <li><Link to="/seller/register">Become a Seller</Link></li>
              <li><Link to="/driver/register">Become a Driver</Link></li>
              <li><Link to="/login">Seller / Driver Login</Link></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Help &amp; account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/help">Help centre</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom-bar">
          <span>© 2026 Pahadi Haat. All rights reserved.</span>
          <span>Made for the mountains, delivered to your door.</span>
        </div>
      </div>
    </footer>
  );
}
