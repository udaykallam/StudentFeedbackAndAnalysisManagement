import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Error = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2 className="display-4">Page Not Found</h2>
      <p className="lead">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
};

export default Error;
