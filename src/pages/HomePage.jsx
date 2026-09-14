import { ArrowRight, Briefcase, Building2, Search, Users, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const categories = ['IT & Technology', 'Construction', 'Education', 'Agriculture', 'Hospitality'];

export default function HomePage({ t }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=4');
        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadJobs();
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">JobConnect Rwanda</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn btn-primary">{t.heroPrimary}</Link>
              <Link to="/register" className="btn btn-secondary">{t.heroSecondary}</Link>
            </div>
          </div>

          <div className="hero-card card">
            <div className="search-box">
              <Search size={18} />
              <input placeholder="Search for jobs, skills or companies" />
            </div>
            <div className="stat-pill-group">
              <div className="stat-pill"><Users size={18} /> 5k+ Job Seekers</div>
              <div className="stat-pill"><Building2 size={18} /> 800+ Employers</div>
            </div>
            <div className="mini-jobs">
              <div className="mini-job-item">
                <Briefcase size={16} />
                <div>
                  <strong>Frontend Developer</strong>
                  <small>Kigali</small>
                </div>
              </div>
              <div className="mini-job-item">
                <Briefcase size={16} />
                <div>
                  <strong>Sales Assistant</strong>
                  <small>Rubavu</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <h2>{t.searchJobs}</h2>
        </div>
        <div className="mini-search card">
          <input placeholder={t.keywordPlaceholder} />
          <input placeholder={t.locationPlaceholder} />
          <select>
            <option>{t.allCategories}</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="btn btn-primary">{t.search}</button>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <h2>{t.categories}</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category} className="category-card card">
              <Star size={18} />
              <h4>{category}</h4>
              <small>Open roles</small>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <h2>{t.featuredJobs}</h2>
          <Link to="/jobs" className="text-link">{t.searchJobs} <ArrowRight size={16} /></Link>
        </div>
        <div className="jobs-grid">
          {jobs.length ? jobs.map(job => <JobCard key={job._id} job={job} />) : <p className="empty-state">{t.noJobs}</p>}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <h2>{t.howItWorks}</h2>
        </div>
        <div className="steps-grid">
          <div className="step-card card">
            <span className="step-number">1</span>
            <h3>{t.registerStep}</h3>
            <p>{t.stepRegisterText}</p>
          </div>
          <div className="step-card card">
            <span className="step-number">2</span>
            <h3>{t.searchStep}</h3>
            <p>{t.stepSearchText}</p>
          </div>
          <div className="step-card card">
            <span className="step-number">3</span>
            <h3>{t.applyStep}</h3>
            <p>{t.stepApplyText}</p>
          </div>
        </div>
      </section>

      <section className="container section-block benefits-grid">
        <div className="card">
          <h3>{t.benefitsJobSeeker}</h3>
          <ul className="check-list">
            <li><CheckCircle size={16} /> Access relevant local opportunities</li>
            <li><CheckCircle size={16} /> Track applications and statuses</li>
            <li><CheckCircle size={16} /> Save jobs and receive notifications</li>
          </ul>
        </div>
        <div className="card">
          <h3>{t.benefitsEmployer}</h3>
          <ul className="check-list">
            <li><CheckCircle size={16} /> Publish jobs in minutes</li>
            <li><CheckCircle size={16} /> Review applicants and CVs</li>
            <li><CheckCircle size={16} /> Manage jobs and hiring in one place</li>
          </ul>
        </div>
      </section>

      <section className="container section-block stats-section">
        <div className="section-head">
          <h2>{t.statsTitle}</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-box card"><strong>15k+</strong><span>Applications</span></div>
          <div className="stat-box card"><strong>2.4k</strong><span>Jobs Posted</span></div>
          <div className="stat-box card"><strong>92%</strong><span>Employer Satisfaction</span></div>
          <div className="stat-box card"><strong>24/7</strong><span>Platform Support</span></div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-box">
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>
          <Link to="/register" className="btn btn-light">{t.getStarted}</Link>
        </div>
      </section>
    </>
  );
}
