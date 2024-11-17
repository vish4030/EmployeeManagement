
import React from 'react';
import { Link } from 'react-router-dom';


const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-link">
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
