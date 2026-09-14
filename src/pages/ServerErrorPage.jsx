import { Link } from 'react-router-dom';

export default function ServerErrorPage() {
  return (
    <div className="container page-space">
      <div className="card content-card centered">
        <h1>500</h1>
        <p>Something went wrong on the server.</p>
        <Link className="btn btn-primary" to="/">Go home</Link>
      </div>
    </div>
  );
}
