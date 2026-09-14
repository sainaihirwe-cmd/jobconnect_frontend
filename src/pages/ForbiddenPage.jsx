import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="container page-space">
      <div className="card content-card centered">
        <h1>403</h1>
        <p>Access denied for this role.</p>
        <Link className="btn btn-primary" to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
