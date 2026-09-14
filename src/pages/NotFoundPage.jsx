import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page-space not-found">
      <div className="card content-card centered">
        <h1>404</h1>
        <p>Page not found.</p>
        <Link className="btn btn-primary" to="/">Back Home</Link>
      </div>
    </div>
  );
}
