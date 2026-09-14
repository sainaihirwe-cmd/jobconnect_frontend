import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const apiOrigin = api.defaults.baseURL.replace(/\/api\/?$/, '');
const getFileUrl = (filePath) => (filePath?.startsWith('http') ? filePath : `${apiOrigin}${filePath}`);

export default function ApplicantDetailPage({ t }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApplication(res.data.application);
        setApplicantProfile(res.data.applicantProfile || null);
      } catch (error) {
        console.error('Failed to load application', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'employer' || user?.role === 'admin') {
      loadApplication();
    } else {
      navigate('/403');
    }
  }, [id, user, navigate]);

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/applications/${id}/status`, { status: newStatus });
      setApplication(res.data.application);
      alert(`Application marked as ${newStatus}`);
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="container page-space"><p className="empty-state">Loading applicant details...</p></div>;
  if (!application) return <div className="container page-space"><p className="empty-state">Application not found.</p></div>;

  const applicant = application.applicant || {};
  const applicantDetails = application.applicantDetails || {};
  const job = application.job || {};

  return (
    <div className="container page-space">
      <div className="page-header">
        <h1>Applicant Profile</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/applicants')} style={{ marginTop: '8px' }}>
          ← Back to Applicants
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ margin: '0 0 8px 0' }}>{applicantDetails.fullName || applicant.fullName}</h2>
            <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '16px' }}>
              <strong>Email:</strong> <a href={`mailto:${applicantDetails.email || applicant.email}`}>{applicantDetails.email || applicant.email}</a>
            </p>
            <p style={{ margin: '0 0 6px', color: '#666', fontSize: '15px' }}><strong>Phone:</strong> {applicantDetails.phone || applicant.phone || 'Not provided'}</p>
            <p style={{ margin: '0 0 12px', color: '#666', fontSize: '15px' }}><strong>Location:</strong> {applicantDetails.location || applicant.location || 'Not provided'}</p>

            <span
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                background:
                  application.status === 'Pending'
                    ? '#fff3cd'
                    : application.status === 'Accepted'
                      ? '#d4edda'
                      : application.status === 'Rejected'
                        ? '#f8d7da'
                        : '#e7f3ff',
                color:
                  application.status === 'Pending'
                    ? '#856404'
                    : application.status === 'Accepted'
                      ? '#155724'
                      : application.status === 'Rejected'
                        ? '#721c24'
                        : '#004085',
              }}
            >
              Status: {application.status}
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3>Applied For</h3>
            <div className="card" style={{ background: '#f9f9f9', padding: '16px', marginTop: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>{job.title}</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                <strong>Category:</strong> {job.category}
              </p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                <strong>Type:</strong> {job.jobType}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                <strong>Location:</strong> {job.location}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3>Application Details</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              <strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()} at{' '}
              {new Date(application.createdAt).toLocaleTimeString()}
            </p>
            {application.coverLetter && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <strong>Cover Letter:</strong>
                <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                  {application.coverLetter}
                </p>
              </div>
            )}
            {application.cv && (
              <div style={{ marginTop: '12px' }}>
                <a href={getFileUrl(application.cv)} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Download CV
                </a>
              </div>
            )}
          </div>

          <div className="portfolio-panel">
            <div className="portfolio-heading"><div><span className="about-kicker">Candidate portfolio</span><h3>Professional profile</h3></div></div>
            {applicantProfile ? (
              <>
                {applicantProfile.bio && <p className="portfolio-bio">{applicantProfile.bio}</p>}
                <div className="portfolio-section"><strong>Skills</strong><div className="portfolio-chips">{(applicantProfile.skills || []).length ? applicantProfile.skills.map((skill) => <span key={skill}>{skill}</span>) : <small>No skills listed.</small>}</div></div>
                <div className="portfolio-section"><strong>Education</strong>{(applicantProfile.education || []).length ? applicantProfile.education.map((item) => <div className="portfolio-entry" key={item._id || `${item.institution}-${item.degree}`}><b>{item.degree || 'Education'}</b><span>{item.institution} {item.field ? `• ${item.field}` : ''}</span></div>) : <small>No education listed.</small>}</div>
                <div className="portfolio-section"><strong>Experience</strong>{(applicantProfile.workExperience || []).length ? applicantProfile.workExperience.map((item) => <div className="portfolio-entry" key={item._id || `${item.company}-${item.role}`}><b>{item.role || 'Experience'}</b><span>{item.company} {item.location ? `• ${item.location}` : ''}</span><small>{item.description}</small></div>) : <small>No experience listed.</small>}</div>
                {applicantProfile.cv && <a href={getFileUrl(applicantProfile.cv)} target="_blank" rel="noreferrer" className="btn btn-secondary">Open portfolio CV</a>}
              </>
            ) : <p className="empty-state">This applicant has not completed a portfolio yet.</p>}
          </div>
        </div>

        <div className="card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3>Actions</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <button
              className="btn"
              style={{
                width: '100%',
                background: '#e7f3ff',
                color: '#004085',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onClick={() => updateStatus('In Review')}
              disabled={updatingStatus}
            >
              Move to Review
            </button>
            <button
              className="btn"
              style={{
                width: '100%',
                background: '#d4edda',
                color: '#155724',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onClick={() => updateStatus('Accepted')}
              disabled={updatingStatus}
            >
              Accept Application
            </button>
            <button
              className="btn"
              style={{
                width: '100%',
                background: '#f8d7da',
                color: '#721c24',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onClick={() => updateStatus('Rejected')}
              disabled={updatingStatus}
            >
              Reject Application
            </button>

            <hr style={{ margin: '12px 0' }} />

            <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '6px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                Contact Details
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                <a href={`mailto:${applicant.email}`}>{applicant.email}</a>
              </p>
              <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                ID: {applicant._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
