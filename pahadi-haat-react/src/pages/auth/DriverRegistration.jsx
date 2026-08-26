import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell, FormField, ErrorBanner } from '../../components/Shared';
import { useAuth } from '../../context/AuthContext';

export default function DriverRegistration() {
  const navigate = useNavigate();
  const { registerDriver } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', vehicleNumber: '', vehicleType: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await registerDriver(form);
      navigate('/driver/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Driver Registration">
      <div className="auth__photo">
        <span>📷</span>
        <button type="button" className="btn btn--outline btn--sm">Add Photo</button>
      </div>
      {error && <ErrorBanner message={error} />}
      <form onSubmit={handleSubmit}>
        <FormField label="Full Name" placeholder="Full name" value={form.fullName} onChange={update('fullName')} required />
        <FormField label="Phone Number" placeholder="Phone number" value={form.phone} onChange={update('phone')} required />
        <FormField label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
        <FormField label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={update('password')} minLength={6} required />
        <FormField label="Vehicle Number" placeholder="e.g. UK09XXXXX" value={form.vehicleNumber} onChange={update('vehicleNumber')} required />
        <FormField label="Type of Vehicle" placeholder="e.g. Taxi" value={form.vehicleType} onChange={update('vehicleType')} required />
        <button className="btn btn--pink btn--block btn--lg" type="submit" disabled={submitting}>
          {submitting ? 'Registering…' : 'Register'}
        </button>
      </form>
    </AuthShell>
  );
}
