import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendContactMessage } from '../../api/support';

const faqs = [
  ['Where does Pahadi Haat deliver?', 'We currently serve nearby towns and villages through participating local shops and delivery partners. Enter your delivery details at checkout to confirm availability.'],
  ['How can I track an order?', 'After you place an order, use the tracking link on the confirmation screen. It shows each update from the shop and delivery partner.'],
  ['Can I sell on Pahadi Haat?', 'Yes. Local shops, farmers, and artisans can register as sellers, create a shop, and manage product availability from their dashboard.'],
  ['What if an item is unavailable?', 'A seller can update stock at any time. If an item becomes unavailable after ordering, contact support and we will help resolve it quickly.'],
];

export function About() {
  return (
    <main className="info-page">
      <section className="info-hero">
        <p className="info-hero__eyebrow">Rooted in the hills</p>
        <h1>Local shopping, made simpler.</h1>
        <p>Pahadi Haat connects mountain communities with trusted neighbourhood shops, farmers, makers, and delivery partners.</p>
        <Link className="btn btn--pink btn--lg" to="/shops">Explore local shops</Link>
      </section>
      <section className="info-section">
        <div className="info-section__intro"><p className="info-kicker">Our promise</p><h2>Better for your everyday, better for your community.</h2></div>
        <div className="value-grid">
          <article><span aria-hidden="true">🌿</span><h3>Local first</h3><p>Every purchase supports the people and businesses that keep hill communities thriving.</p></article>
          <article><span aria-hidden="true">🛍️</span><h3>Everyday essentials</h3><p>Find groceries, household needs, wellness products, books, and more in one place.</p></article>
          <article><span aria-hidden="true">🚚</span><h3>Clear delivery updates</h3><p>Follow orders from checkout to your doorstep with simple, real-time status updates.</p></article>
        </div>
      </section>
      <section className="info-callout"><div><p className="info-kicker">Join the network</p><h2>Own a shop or deliver locally?</h2><p>Build a trusted marketplace that works for the mountains.</p></div><div className="info-callout__actions"><Link className="btn btn--outline" to="/seller/register">Become a seller</Link><Link className="btn btn--outline" to="/driver/register">Become a driver</Link></div></section>
    </main>
  );
}

export function Help() {
  const [open, setOpen] = useState(0);
  return (
    <main className="info-page">
      <section className="info-hero info-hero--compact"><p className="info-hero__eyebrow">Help centre</p><h1>How can we help?</h1><p>Quick answers for shopping, orders, selling, and deliveries.</p></section>
      <section className="help-grid">
        <article className="help-card"><span>1</span><h2>Shop</h2><p>Browse local shops, add products to your cart, then sign in to place an order.</p><Link to="/shops">Browse shops →</Link></article>
        <article className="help-card"><span>2</span><h2>Track</h2><p>Use your order confirmation to view progress from placed to delivered.</p><Link to="/login">View an order →</Link></article>
        <article className="help-card"><span>3</span><h2>Get support</h2><p>Need personal help? Send us a message and include your order number if you have one.</p><Link to="/contact">Contact us →</Link></article>
      </section>
      <section className="faq-section"><p className="info-kicker">Frequently asked questions</p><h2>Helpful answers, without the runaround.</h2><div className="faq-list">{faqs.map(([question, answer], index) => <article className="faq-item" key={question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>{question}<span>{open === index ? '−' : '+'}</span></button>{open === index && <p>{answer}</p>}</article>)}</div></section>
    </main>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError(null);
    try {
      await sendContactMessage(Object.fromEntries(form));
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || 'We could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  return (
    <main className="info-page contact-page">
      <section className="info-hero info-hero--compact"><p className="info-hero__eyebrow">Contact</p><h1>We’re here to help.</h1><p>Tell us what you need. We’ll make sure your message reaches the right team.</p></section>
      <section className="contact-layout"><aside><h2>Before you write</h2><p>For an existing order, include the order number and the email used at checkout.</p><div className="contact-note"><strong>Shopping help</strong><span>Orders, product availability, and delivery questions.</span></div><div className="contact-note"><strong>Partner support</strong><span>Seller and driver registration or dashboard questions.</span></div></aside><form className="contact-form" onSubmit={submit}>{sent ? <div className="contact-success"><h2>Message received</h2><p>Thanks for getting in touch. Our support team will respond as soon as possible.</p><button type="button" className="btn btn--outline" onClick={() => setSent(false)}>Send another message</button></div> : <><label>Name<input required name="name" maxLength="120" placeholder="Your name" /></label><label>Email<input required type="email" name="email" maxLength="254" placeholder="you@example.com" /></label><label>What can we help with?<select name="topic" defaultValue="order"><option value="order">An order or delivery</option><option value="shop">Shopping or products</option><option value="seller">Selling on Pahadi Haat</option><option value="driver">Driving with Pahadi Haat</option><option value="other">Something else</option></select></label><label>Message<textarea required name="message" maxLength="4000" rows="5" placeholder="Write your message here" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn btn--pink btn--lg" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button></>}</form></section>
    </main>
  );
}
