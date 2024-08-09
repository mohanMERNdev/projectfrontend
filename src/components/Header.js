import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
  };

  return (
    <header className="header">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/projects">My Projects</Link>
        {!isLoggedIn && <Link to="/login">Login</Link>}
      </div>
      {isLoggedIn ? (
        <button className="login-button logged-in" onClick={handleLogout}>Logged In</button>
      ) : (
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      )}
    </header>
  );
};

export default Header;
