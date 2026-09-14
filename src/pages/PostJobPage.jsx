import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const categories = ['IT & Technology', 'Construction', 'Education', 'Agriculture', 'Hospitality', 'Healthcare', 'Sales', 'Marketing', 'Other'];
const jobTypes = ['Full Time', 'Part Time', 'Internship', 'Contract', 'Temporary'];

export default function PostJobPage({ t }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    title: '',
    category: 'IT & Technology',
    jobType: 'Full Time',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    responsibilities: '',
    requirements: '',
    applicationDeadline: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading2, setLoading2] = useState(false);

  if (!loading && (!user || user.role !== 'employer')) {
    return (
      <div className="container page-space">
        <div className="card">
          <p className="empty-state">Only employers can post jobs.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextarea = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading2(true);
      
      // Parse responsibilities and requirements from textarea (split by newline)
      const responsibilities = form.responsibilities.split('\n').filter((r) => r.trim());
      const requirements = form.requirements.split('\n').filter((req) => req.trim());

      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin || 0),
        salaryMax: Number(form.salaryMax || 0),
        responsibilities,
        requirements,
      };

      const res = await api.post('/jobs', payload);
      setSuccess('Job posted successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="container page-space">
      <div className="page-header">
        <h1>Post a Job</h1>
        <p>Reach talented job seekers and find the perfect candidate for your role.</p>
      </div>

      <div className="card auth-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select name="jobType" value={form.jobType} onChange={handleChange}>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="location"
              placeholder="Job Location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="salaryMin"
              placeholder="Salary Min (RWF)"
              value={form.salaryMin}
              onChange={handleChange}
            />

            <input
              type="number"
              name="salaryMax"
              placeholder="Salary Max (RWF)"
              value={form.salaryMax}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            placeholder="Job Description (required)"
            value={form.description}
            onChange={handleTextarea}
            rows={4}
            required
          />

          <textarea
            name="responsibilities"
            placeholder="Responsibilities (one per line)"
            value={form.responsibilities}
            onChange={handleTextarea}
            rows={3}
          />

          <textarea
            name="requirements"
            placeholder="Requirements (one per line)"
            value={form.requirements}
            onChange={handleTextarea}
            rows={3}
          />

          <input
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={form.contactEmail}
              onChange={handleChange}
            />

            <input
              type="tel"
              name="contactPhone"
              placeholder="Contact Phone"
              value={form.contactPhone}
              onChange={handleChange}
            />
          </div>

          {error && <div className="alert-box">{error}</div>}
          {success && <div className="alert-box" style={{ background: '#e6fffa', color: '#034d46' }}>{success}</div>}

          <button type="submit" className="btn btn-primary full-width" disabled={loading2}>
            {loading2 ? 'Publishing...' : 'Post Job'}
          </button>
        </form>

        <p className="auth-footer" style={{ textAlign: 'center' }}>
          Back to <a href="/dashboard" style={{ cursor: 'pointer', color: 'var(--primary)' }}>Dashboard</a>
        </p>
      </div>
    </div>
  );
}
