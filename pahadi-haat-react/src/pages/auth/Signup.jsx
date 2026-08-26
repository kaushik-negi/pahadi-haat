import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell, FormField, ErrorBanner } from '../../components/Shared';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      footer={
        <p className="auth__switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      }
    >
      {error && <ErrorBanner message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="auth__row">
          <FormField label="Name" placeholder="First name" value={form.firstName} onChange={update('firstName')} required />
          <FormField label="Last Name" placeholder="Last name" value={form.lastName} onChange={update('lastName')} />
        </div>
        <FormField label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
        <FormField label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={update('password')} minLength={6} required />
        <button className="btn btn--pink btn--block btn--lg" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
}
