import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ t }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [usersFilter, setUsersFilter] = useState('');
  const [jobsFilter, setJobsFilter] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/403');
      return;
    }

    const load = async () => {
      try {
        const [s, u, j] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/jobs'),
        ]);
        setStats(s.data.stats);
        setUsers(u.data.users || []);
        setJobs(j.data.jobs || []);
      } catch (err) {
        console.error('Admin load error', err);
      }
    };

    load();
  }, [loading, user, navigate]);

  const toggleUser = async (id, isActive) => {
    setBusy(true);
    try {
      await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
      setUsers((prev) => prev.map((p) => (p._id === id ? { ...p, isActive: !isActive } : p)));
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const removeJob = async (id) => {
    if (!confirm('Remove job permanently?')) return;
    setBusy(true);
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!usersFilter) return true;
    const q = usersFilter.toLowerCase();
    return (u.fullName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.role || '').toLowerCase().includes(q);
  });

  const filteredJobs = jobs.filter((j) => {
    if (!jobsFilter) return true;
    const q = jobsFilter.toLowerCase();
    return (j.title || '').toLowerCase().includes(q) || (j.location || '').toLowerCase().includes(q) || (j.employer?.fullName || j.employer?.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="container admin-dashboard">
      <h2>{t.adminDashboard}</h2>
      {stats && (
        <div className="stats-grid admin-stats">
          <div className="stat-box card"><small>{t.users}</small><div className="stat-value">{stats.totalUsers}</div></div>
          <div className="stat-box card"><small>Job Seekers</small><div className="stat-value">{stats.totalJobSeekers}</div></div>
          <div className="stat-box card"><small>Employers</small><div className="stat-value">{stats.totalEmployers}</div></div>
          <div className="stat-box card"><small>{t.jobs}</small><div className="stat-value">{stats.totalJobs}</div></div>
          <div className="stat-box card"><small>Active Jobs</small><div className="stat-value">{stats.activeJobs}</div></div>
          <div className="stat-box card"><small>Reports</small><div className="stat-value">{stats.pendingReports}</div></div>
        </div>
      )}

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h3>{t.users}</h3>
          <input value={usersFilter} onChange={(e) => setUsersFilter(e.target.value)} placeholder={t.searchUsers} style={{ padding: 8, borderRadius: 10, border: '1px solid var(--line)' }} />
        </div>
        <table className="admin-table card" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <button className={`table-action ${u.isActive ? '' : 'interactive-btn'}`} disabled={busy} onClick={() => toggleUser(u._id, u.isActive)}>{u.isActive ? 'Disable' : 'Enable'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h3>{t.jobs}</h3>
          <input value={jobsFilter} onChange={(e) => setJobsFilter(e.target.value)} placeholder={t.searchJobsAdmin} style={{ padding: 8, borderRadius: 10, border: '1px solid var(--line)' }} />
        </div>
        <table className="admin-table card" style={{ marginTop: 12 }}>
          <thead>
            <tr><th>Title</th><th>Employer</th><th>Location</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredJobs.map((j) => (
              <tr key={j._id}>
                <td>{j.title}</td>
                <td>{j.employer?.fullName || j.employer?.email}</td>
                <td>{j.location}</td>
                <td><button className="table-action" disabled={busy} onClick={() => removeJob(j._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
