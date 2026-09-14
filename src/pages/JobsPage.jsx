import { useEffect, useState } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

export default function JobsPage({ t }) {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', location: '', category: '', jobType: '', minSalary: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadJobs = async (nextPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: nextPage, limit: 10 });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadJobs(1);
  };

  return (
    <div className="container page-space">
      <div className="page-header">
        <h1>{t.browseJobsTitle}</h1>
      </div>

      <form className="filter-panel card" onSubmit={handleSubmit}>
        <div className="filter-grid">
          <input name="keyword" placeholder={t.keywordPlaceholder} value={filters.keyword} onChange={handleChange} />
          <input name="location" placeholder={t.locationPlaceholder} value={filters.location} onChange={handleChange} />
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">{t.allCategories}</option>
            <option value="IT & Technology">IT & Technology</option>
            <option value="Construction">Construction</option>
            <option value="Education">Education</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Hospitality">Hospitality</option>
          </select>
          <select name="jobType" value={filters.jobType} onChange={handleChange}>
            <option value="">{t.allJobTypes}</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          <input name="minSalary" type="number" placeholder={t.minSalary} value={filters.minSalary} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">{t.search}</button>
        </div>
      </form>

      {loading ? <p className="empty-state">{t.loadingJobs}</p> : (
        <>
          <div className="jobs-grid">
            {jobs.length ? jobs.map((job) => <JobCard key={job._id} job={job} />) : <p className="empty-state">{t.noJobs}</p>}
          </div>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => { const next = Math.max(1, page - 1); setPage(next); loadJobs(next); }}>{t.previous}</button>
            <span>{t.page} {page} {t.of} {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => { const next = Math.min(totalPages, page + 1); setPage(next); loadJobs(next); }}>{t.next}</button>
          </div>
        </>
      )}
    </div>
  );
}
