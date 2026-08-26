import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, FormField, ErrorBanner } from '../../components/Shared';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { id: 'customer', label: 'Customer' },
  { id: 'seller', label: 'Seller' },
  { id: 'driver', label: 'Driver' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [role, setRole] = useState(location.state?.requiredRole || 'customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await login(email, password, role);
      const redirectTo = location.state?.redirectTo;
      if (redirectTo) navigate(redirectTo);
      else if (res.role === 'seller') navigate('/seller/dashboard');
      else if (res.role === 'driver') navigate('/driver/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Login"
      footer={
        <p className="auth__switch">
          New here?{' '}
          <Link to={role === 'seller' ? '/seller/register' : role === 'driver' ? '/driver/register' : '/signup'}>
            Create an account
          </Link>
        </p>
      }
    >
      <div className="role-tabs">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`role-tabs__btn${role === r.id ? ' role-tabs__btn--active' : ''}`}
            onClick={() => setRole(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormField label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn--pink btn--block btn--lg" type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : `Login as ${ROLES.find((r) => r.id === role).label}`}
        </button>
      </form>
    </AuthShell>
  );
}
