import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ApplicantsPage({ t }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employer')) {
      navigate('/403');
      return;
    }

    if (loading || !user) return;

    const loadApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data.applications || []);
      } catch (error) {
        console.error('Failed to load applications', error);
      } finally {
        setPageLoading(false);
      }
    };

    loadApplications();
  }, [loading, user, navigate]);

  const filteredApps = applications.filter((app) => {
    const jobTitle = (app.job?.title || '').toLowerCase();
    const applicantName = (app.applicant?.fullName || '').toLowerCase();
    const q = filter.toLowerCase();

    const matchesSearch = jobTitle.includes(q) || applicantName.includes(q);
    const matchesStatus = !statusFilter || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (appId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? res.data.application : app))
      );
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (pageLoading) return <div className="container page-space"><p className="empty-state">Loading applications...</p></div>;

  return (
    <div className="container page-space">
      <div className="page-header">
        <h1>Job Applicants</h1>
        <p>Manage and review applications for your posted jobs.</p>
      </div>

      <div className="filter-panel card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search by job or applicant name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="In Review">In Review</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/post-job')}
            style={{ height: '40px' }}
          >
            + Post New Job
          </button>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="card">
          <p className="empty-state">
            {applications.length === 0 ? 'No applications yet. Post a job to receive applications.' : 'No applications match your filters.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
          {filteredApps.map((app) => (
            <div key={app._id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{app.applicantDetails?.fullName || app.applicant?.fullName}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                  <strong>Applied for:</strong> {app.job?.title || 'Unknown Job'}
                </p>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  <strong>Email:</strong> {app.applicantDetails?.email || app.applicant?.email}
                </p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}><strong>Phone:</strong> {app.applicantDetails?.phone || app.applicant?.phone || 'Not provided'}</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}><strong>Location:</strong> {app.applicantDetails?.location || app.applicant?.location || 'Not provided'}</p>
              </div>

              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      app.status === 'Pending'
                        ? '#fff3cd'
                        : app.status === 'Accepted'
                          ? '#d4edda'
                          : app.status === 'Rejected'
                            ? '#f8d7da'
                            : '#e7f3ff',
                    color:
                      app.status === 'Pending'
                        ? '#856404'
                        : app.status === 'Accepted'
                          ? '#155724'
                          : app.status === 'Rejected'
                            ? '#721c24'
                            : '#004085',
                  }}
                >
                  {app.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '12px', padding: '8px', height: 'auto' }}
                  onClick={() => updateStatus(app._id, 'In Review')}
                  disabled={actionLoading}
                >
                  Review
                </button>
                <button
                  className="btn"
                  style={{
                    fontSize: '12px',
                    padding: '8px',
                    height: 'auto',
                    background: '#d4edda',
                    color: '#155724',
                    border: 'none',
                  }}
                  onClick={() => updateStatus(app._id, 'Accepted')}
                  disabled={actionLoading}
                >
                  Accept
                </button>
                <button
                  className="btn"
                  style={{
                    fontSize: '12px',
                    padding: '8px',
                    height: 'auto',
                    background: '#f8d7da',
                    color: '#721c24',
                    border: 'none',
                  }}
                  onClick={() => updateStatus(app._id, 'Rejected')}
                  disabled={actionLoading}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '8px', height: 'auto' }}
                  onClick={() => navigate(`/applicant/${app._id}`)}
                >
                  View Profile
                </button>
              </div>

              <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#999' }}>
                Applied: {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
