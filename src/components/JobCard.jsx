import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  if (!value) return 'Negotiable';
  return `RWF ${Number(value).toLocaleString()}`;
};

export default function JobCard({ job }) {
  return (
    <article className="card job-card">
      <div className="job-card-header">
        <div>
          <span className="badge">{job.category}</span>
          <h3>{job.title}</h3>
        </div>
      </div>

      <div className="job-meta">
        <span><Briefcase size={16} /> {job.jobType}</span>
        <span><MapPin size={16} /> {job.location}</span>
        <span><DollarSign size={16} /> {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}</span>
      </div>

      <p>{job.description?.slice(0, 150)}...</p>

      <div className="job-card-footer">
        <small>Posted {new Date(job.postedAt || Date.now()).toLocaleDateString()}</small>
        <Link to={`/jobs/${job._id}`} className="btn btn-primary">View Details</Link>
      </div>
    </article>
  );
}
