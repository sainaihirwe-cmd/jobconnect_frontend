import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, CalendarDays, Flag, Save, AlertTriangle, FileText, Upload, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage({ t }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({ fullName: '', email: '', phone: '', location: '', coverLetter: '', cv: null });
  const [submittingApplication, setSubmittingApplication] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  useEffect(() => {
    if (!user) return;

    const loadProfileDetails = async () => {
      try {
        const response = await api.get('/profile');
        const profile = response.data.profile || {};
        const profileUser = response.data.user || user;
        setApplicationForm((current) => ({
          ...current,
          fullName: profile.fullName || profileUser.fullName || '',
          email: profile.email || profileUser.email || '',
          phone: profile.phone || profileUser.phone || '',
          location: profile.location || profileUser.location || '',
        }));
      } catch (error) {
        setApplicationForm((current) => ({
          ...current,
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
        }));
      }
    };

    loadProfileDetails();
  }, [user]);

  const handleApply = () => {
    if (!user) {
      setMessage(t.protectedMessage);
      return;
    }
    setMessage('');
    setShowApplicationForm(true);
  };

  const handleApplicationChange = (event) => {
    const { name, value, files } = event.target;
    setApplicationForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleApplicationSubmit = async (event) => {
    event.preventDefault();
    setSubmittingApplication(true);

    try {
      const formData = new FormData();
      formData.append('fullName', applicationForm.fullName);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('location', applicationForm.location);
      formData.append('coverLetter', applicationForm.coverLetter);
      if (applicationForm.cv) formData.append('cv', applicationForm.cv);

      await api.post(`/jobs/${id}/apply`, formData);
      setMessage('Application submitted successfully. The employer will review it and notify you of the decision.');
      setApplicationForm({ fullName: '', email: '', phone: '', location: '', coverLetter: '', cv: null });
      setShowApplicationForm(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to apply.');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setMessage(t.protectedMessage);
      return;
    }
    try {
      await api.post(`/jobs/saved/${id}`);
      setMessage('Job saved to your dashboard.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save job.');
    }
  };

  if (loading) return <div className="container page-space"><p className="empty-state">{t.loadingJobs}</p></div>;
  if (!job) return <div className="container page-space"><p className="empty-state">{t.jobNotFound}</p></div>;

  return (
    <div className="container page-space job-details">
      <div className="card detail-card">
        <div className="job-detail-head">
          <div>
            <span className="badge">{job.category}</span>
            <h1>{job.title}</h1>
            <p>{job.employer?.fullName || t.employer}</p>
          </div>
          <div className="detail-actions">
            {(!user || user.role === 'jobseeker') && <button className="btn btn-primary" onClick={handleApply}>{t.apply}</button>}
            {user?.role === 'employer' && <span className="role-notice">Employers can post jobs and review applicants.</span>}
            <button className="btn btn-secondary" onClick={handleSave}><Save size={16} /> {t.saveJob}</button>
            <button className="btn btn-ghost"><AlertTriangle size={16} /> {t.reportJob}</button>
          </div>
        </div>

        <div className="job-meta detail-meta">
          <span><MapPin size={16} /> {job.location}</span>
          <span><Briefcase size={16} /> {job.jobType}</span>
          <span><DollarSign size={16} /> RWF {Number(job.salaryMin || 0).toLocaleString()} - {Number(job.salaryMax || 0).toLocaleString()}</span>
          <span><CalendarDays size={16} /> {t.deadline || 'Deadline'} {new Date(job.applicationDeadline).toLocaleDateString()}</span>
        </div>

        {message && <div className="alert-box">{message}</div>}

        {showApplicationForm && (
          <form className="application-form" onSubmit={handleApplicationSubmit}>
            <div className="application-form-heading">
              <div><span className="about-kicker">Your application</span><h2>Apply for {job.title}</h2></div>
              <button type="button" className="icon-button" onClick={() => setShowApplicationForm(false)} aria-label="Close application form"><X size={18} /></button>
            </div>
            <div className="application-contact-grid">
              <label>Job<input value={job.title} readOnly /></label>
              <label>Employer<input value={job.employer?.fullName || 'Employer'} readOnly /></label>
              <label>Full name<input name="fullName" value={applicationForm.fullName} onChange={handleApplicationChange} required /></label>
              <label>Email<input name="email" type="email" value={applicationForm.email} onChange={handleApplicationChange} required /></label>
              <label>Phone number<input name="phone" type="tel" value={applicationForm.phone} onChange={handleApplicationChange} placeholder="+250 ..." required /></label>
              <label>Location<input name="location" value={applicationForm.location} onChange={handleApplicationChange} placeholder="Kigali, Rwanda" required /></label>
            </div>
            <label>Cover letter<textarea name="coverLetter" value={applicationForm.coverLetter} onChange={handleApplicationChange} placeholder="Tell the employer why you are a good fit for this role..." rows="6" required /></label>
            <label className="cv-upload"><span><Upload size={17} /> CV or resume <small>(PDF, DOC, or DOCX, optional)</small></span><input name="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleApplicationChange} /></label>
            {applicationForm.cv && <p className="selected-file"><FileText size={16} /> {applicationForm.cv.name}</p>}
            <div className="application-form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowApplicationForm(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={submittingApplication}>{submittingApplication ? 'Sending...' : 'Send application'}</button></div>
          </form>
        )}

        <div className="detail-section">
          <h3>{t.aboutRole}</h3>
          <p>{job.description}</p>
        </div>

        <div className="detail-section">
          <h3>{t.responsibilities}</h3>
          <ul>
            {(job.responsibilities || []).map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>

        <div className="detail-section">
          <h3>{t.requirements}</h3>
          <ul>
            {(job.requirements || []).map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      </div>

      <aside className="card sidebar-card">
        <h3>{t.jobSummary}</h3>
        <div className="summary-item"><Flag size={16} /> {t.employer}: {job.employer?.fullName || 'Company'}</div>
        <div className="summary-item"><MapPin size={16} /> {t.location}: {job.location}</div>
        <div className="summary-item"><Briefcase size={16} /> {t.type}: {job.jobType}</div>
        <div className="summary-item"><DollarSign size={16} /> {t.salary}: RWF {Number(job.salaryMin || 0).toLocaleString()} - {Number(job.salaryMax || 0).toLocaleString()}</div>
        <div className="summary-item"><CalendarDays size={16} /> {t.posted}: {new Date(job.postedAt).toLocaleDateString()}</div>
        <Link className="btn btn-primary full-width" to="/jobs">{t.backToJobs}</Link>
      </aside>
    </div>
  );
}
