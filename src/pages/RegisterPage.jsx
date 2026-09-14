import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ t }) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'jobseeker', phone: '', location: '' });
  const [error, setError] = useState('');

  const validate = (f) => {
    if (!f.fullName.trim()) return t.validatorFullNameRequired;
    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return t.validatorEmail;
    if (!f.password || f.password.length < 8) return t.validatorPassword;
    if (!f.location || f.location.trim().length < 2) return t.validatorLocation;
    if (f.phone && !/^\+?[0-9]{7,15}$/.test(f.phone)) return t.validatorPhone;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate(form);
    if (v) {
      setError(v);
      return;
    }

    try {
      await register(form);
      navigate('/login', { state: { email: form.email, success: t.registerSuccess } });
    } catch (err) {
      setError(err.message || err.response?.data?.message || t.registrationFailed);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1>{t.registerTitle}</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder={t.fullName} required />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.email} required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t.passwordMin} required />
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.phone} />
          <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={t.location} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="jobseeker">{t.roleJobSeeker}</option>
            <option value="employer">{t.roleEmployer}</option>
          </select>
          {error && <div className="alert-box">{error}</div>}
          <button type="submit" className="btn btn-primary full-width">{t.registerButton}</button>
        </form>
        <p className="auth-footer">{t.existingAccount} <Link to="/login">{t.navLogin}</Link></p>
      </div>
    </div>
  );
}
