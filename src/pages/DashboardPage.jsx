import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const categories = ['IT & Technology', 'Construction', 'Education', 'Agriculture', 'Hospitality', 'Healthcare', 'Sales', 'Marketing', 'Other'];
const jobTypes = ['Full Time', 'Part Time', 'Internship', 'Contract', 'Temporary'];

export default function DashboardPage({ t }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.fullName || 'User';
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'employer' ? 'Employer' : 'Job Seeker';
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'IT & Technology',
    jobType: 'Full Time',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    applicationDeadline: '',
  });
  const [postingJob, setPostingJob] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (loading || !user) return;

    const loadDashboard = async () => {
      try {
        if (user.role === 'admin') {
          const [statsRes, usersRes, jobsRes, appsRes] = await Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/users'),
            api.get('/admin/jobs'),
            api.get('/admin/applications'),
          ]);

          setStats(statsRes.data.stats || null);
          setUsers(usersRes.data.users || []);
          setJobs(jobsRes.data.jobs || []);
          setApplications(appsRes.data.applications || []);
          setProfile(null);
          return;
        }

        const [profileRes, jobsRes, appsRes] = await Promise.all([
          api.get('/profile'),
          user.role === 'employer' ? api.get('/jobs/employer/mine') : api.get('/jobs?limit=5'),
          user.role === 'employer' ? api.get('/applications?employer=true') : api.get('/applications'),
        ]);

        setProfile(profileRes.data.profile || profileRes.data.user || null);
        setJobs(jobsRes.data.jobs || []);
        setApplications(appsRes.data.applications || []);
      } catch (error) {
        console.error('Dashboard load error', error);
      }
    };

    loadDashboard();
  }, [loading, user, navigate]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    try {
      const res = await api.post('/jobs', jobForm);
      setJobs((prev) => [...prev, res.data.job]);
      setJobForm({
        title: '',
        category: 'IT & Technology',
        jobType: 'Full Time',
        location: '',
        salaryMin: '',
        salaryMax: '',
        description: '',
        applicationDeadline: '',
      });
      setShowJobForm(false);
      alert('Job posted successfully!');
    } catch (error) {
      alert('Failed to post job: ' + (error.response?.data?.message || error.message));
    } finally {
      setPostingJob(false);
    }
  };

  const renderRoleContent = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <>
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

          <div className="dashboard-panels">
            <div className="card">
              <h3>{t.recentUsers}</h3>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {users.length ? users.slice(0, 5).map((item) => (
                    <tr key={item._id}><td>{item.fullName}</td><td>{item.email}</td><td>{item.role}</td><td>{item.isActive ? 'Active' : 'Inactive'}</td></tr>
                  )) : <tr><td colSpan="4">No users available.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3>{t.jobsOverview}</h3>
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Employer</th><th>Location</th></tr></thead>
                <tbody>
                  {jobs.length ? jobs.slice(0, 5).map((job) => (
                    <tr key={job._id}><td>{job.title}</td><td>{job.employer?.fullName || job.employer?.email || 'N/A'}</td><td>{job.location}</td></tr>
                  )) : <tr><td colSpan="3">No jobs available.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3>{t.recentApplications}</h3>
              <div className="mini-jobs">
                {applications.length ? applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="mini-job-item"><strong>{app.job?.title || 'Application'}</strong><span className="muted">{app.status}</span></div>
                )) : <p className="empty-state">No applications yet.</p>}
              </div>
            </div>
          </div>
        </>
      );
    }

    if (user.role === 'employer') {
      return (
        <>
          <div className="stats-grid admin-stats">
            <div className="stat-box card"><small>Posted Jobs</small><div className="stat-value">{jobs.length}</div></div>
            <div className="stat-box card"><small>Applicants</small><div className="stat-value">{applications.length}</div></div>
            <div className="stat-box card"><small>Active Listings</small><div className="stat-value">{jobs.filter((job) => job.status === 'active').length}</div></div>
            <div className="stat-box card"><small>{t.yourProfile}</small><div className="stat-value">{profile ? 'Complete' : 'Incomplete'}</div></div>
          </div>

          <div className="dashboard-panels">
            <div className="card profile-card">
              <h3>{t.yourCompany}</h3>
              <p><strong>Name:</strong> {profile?.companyName || user.fullName}</p>
              <p><strong>Email:</strong> {profile?.email || user.email}</p>
              <p><strong>Location:</strong> {profile?.location || user.location || '-'}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="interactive-btn primary" onClick={() => navigate('/profile')}>{t.editProfile}</button>
                <button className="interactive-btn primary" onClick={() => setShowJobForm(!showJobForm)}>
                  {showJobForm ? 'Cancel' : '+ Post New Job'}
                </button>
                <button className="interactive-btn secondary" onClick={() => navigate('/applicants')}>View Applicants</button>
              </div>
            </div>

            {showJobForm && (
              <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                <h3>Post a New Job</h3>
                <form onSubmit={handlePostJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                  />
                  <select value={jobForm.category} onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select value={jobForm.jobType} onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Min Salary (RWF)"
                    value={jobForm.salaryMin}
                    onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max Salary (RWF)"
                    value={jobForm.salaryMax}
                    onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                  />
                  <textarea
                    placeholder="Job Description (required)"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={3}
                    style={{ gridColumn: '1 / -1' }}
                    required
                  />
                  <input
                    type="date"
                    value={jobForm.applicationDeadline}
                    onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={postingJob} style={{ gridColumn: '1 / -1' }}>
                    {postingJob ? 'Publishing...' : 'Post Job'}
                  </button>
                </form>
              </div>
            )}

            <div className="card">
              <h3>Your Posted Jobs</h3>
              {jobs.length === 0 ? (
                <p className="empty-state">No jobs posted yet. Click "Post New Job" to create your first listing.</p>
              ) : (
                <table className="admin-table">
                  <thead><tr><th>Title</th><th>Type</th><th>Location</th><th>Salary</th><th>Applications</th><th>Action</th></tr></thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.jobType || 'N/A'}</td>
                        <td>{job.location}</td>
                        <td>RWF {Number(job.salaryMin || 0).toLocaleString()}</td>
                        <td>{job.applicationCount ?? 0}</td>
                        <td>
                          <button
                            className="table-action"
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="card">
              <h3>{t.recentApplicants}</h3>
              <div className="mini-jobs">
                {applications.length ? (
                  applications.map((app) => (
                    <div key={app._id} className="mini-job-item">
                      <strong>{app.applicant?.fullName || 'Candidate'}</strong>
                      <span className="muted">{app.status} - {app.job?.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No applicants yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="stats-grid">
          <div className="stat-box card"><small>Jobs Available</small><div className="stat-value">{jobs.length}</div></div>
          <div className="stat-box card"><small>Applications</small><div className="stat-value">{applications.length}</div></div>
          <div className="stat-box card"><small>{t.yourProfile}</small><div className="stat-value">{profile ? 'Complete' : 'Incomplete'}</div></div>
          <div className="stat-box card"><small>Saved Jobs</small><div className="stat-value">{profile?.savedJobs?.length || 0}</div></div>
        </div>

        <div className="dashboard-panels">
          <div className="card profile-card">
            <h3>{t.yourProfile}</h3>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Location:</strong> {profile?.location || user.location || '-'}</p>
            <div style={{ marginTop: 12 }}>
              <button className="interactive-btn primary" onClick={() => navigate('/profile')}>{t.editProfile}</button>
              <button className="interactive-btn secondary" onClick={() => navigate('/jobs')} style={{ marginLeft: '8px' }}>Browse All Jobs</button>
            </div>
          </div>

          <div className="card">
            <h3>Available Jobs</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {jobs.length ? jobs.map((job) => (
                <div key={job._id} style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{job.title}</strong>
                      <div className="muted" style={{ fontSize: '12px' }}>{job.employer?.companyName || job.employer?.fullName || 'Company'} • {job.location}</div>
                    </div>
                    <span style={{ 
                      background: '#e3f2fd',
                      color: '#1976d2',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {job.jobType || 'Full Time'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', margin: '8px 0', color: '#666' }}>{job.description?.substring(0, 80)}...</p>
                  {job.salaryMin && (
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px' }}>
                      RWF {Number(job.salaryMin).toLocaleString()}{job.salaryMax ? ` - ${Number(job.salaryMax).toLocaleString()}` : '+'}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      style={{ flex: 1, fontSize: '12px', padding: '6px' }}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const alreadyApplied = applications.some(app => app.job?._id === job._id);
                        if (alreadyApplied) {
                          alert('You have already applied for this job.');
                        } else {
                          navigate(`/jobs/${job._id}?applyNow=true`);
                        }
                      }}
                      style={{ flex: 1, fontSize: '12px', padding: '6px' }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              )) : <p className="empty-state">No jobs available at the moment. Check back soon!</p>}
            </div>
          </div>

          <div className="card">
            <h3>Saved Jobs</h3>
            <div className="job-list">
              {profile?.savedJobs?.length ? profile.savedJobs.map((savedJob) => (
                <div key={savedJob._id || savedJob.job} className="job-item"><strong>{savedJob.title || savedJob.jobTitle || 'Saved job'}</strong><div className="muted">{savedJob.location || ''}</div></div>
              )) : <p className="empty-state">{t.noSavedJobs}</p>}
            </div>
          </div>

          <div className="card">
            <h3>Your Applications</h3>
            <table className="admin-table">
              <thead><tr><th>Job</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {applications.length ? applications.map((app) => (
                  <tr key={app._id}><td>{app.job?.title || 'Job'}</td><td>{app.status}</td><td>{new Date(app.createdAt).toLocaleDateString()}</td></tr>
                )) : <tr><td colSpan="3">No applications yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container page-space dashboard-shell">
      <div className="page-header">
        <h1>{user?.role === 'admin' ? t.adminDashboard : user?.role === 'employer' ? t.employerDashboard : t.jobSeekerDashboard}</h1>
        <div style={{ marginTop: 8 }}>
          <span className="welcome-banner">{t.welcome || 'Welcome back,'} {displayName} ({roleLabel})</span>
        </div>
      </div>
      {renderRoleContent()}
    </div>
  );
}
