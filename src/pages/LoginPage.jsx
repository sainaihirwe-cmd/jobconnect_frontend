import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ t }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const prefillEmail = location.state?.email || '';
  const successMessage = location.state?.success || '';
  const [form, setForm] = useState({ email: prefillEmail, password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(successMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      const role = data?.user?.role;
      if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || err.response?.data?.message || t.loginFailed);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1>{t.loginTitle}</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.email} required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t.password} required />
          {error && <div className="alert-box">{error}</div>}
          {success && <div className="alert-box" style={{ background: '#e6fffa', color: '#034d46' }}>{success}</div>}
          <button type="submit" className="btn btn-primary full-width">{t.loginButton}</button>
        </form>
        <p className="auth-footer">{t.newHere} <Link to="/register">{t.createAccount}</Link></p>
      </div>
    </div>
  );
}
