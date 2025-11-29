import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>ExtraCurricular Hub</h1>
        </Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/activities">Activities</Link>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard">Admin Dashboard</Link>
                <Link to="/admin/manage">Manage Activities</Link>
              </>
            ) : (
              <>
                <Link to="/my-activities">My Activities</Link>
                <Link to="/notifications">Notifications</Link>
              </>
            )}
            <span className="user-info">
              Welcome, {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
