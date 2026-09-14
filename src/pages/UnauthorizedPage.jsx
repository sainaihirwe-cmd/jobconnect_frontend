import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="container page-space">
      <div className="card content-card centered">
        <h1>401</h1>
        <p>Authentication required.</p>
        <Link className="btn btn-primary" to="/login">Login</Link>
      </div>
    </div>
  );
}
