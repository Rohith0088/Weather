import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to ExtraCurricular Hub</h1>
        <p>Your one-stop platform for managing student extracurricular activities</p>
        {!user && (
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        )}
        {user && (
          <div className="hero-buttons">
            <Link to="/activities" className="btn-primary">Browse Activities</Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h3>Clubs</h3>
            <p>Join various student clubs and explore your interests</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚽</div>
            <h3>Sports</h3>
            <p>Participate in sports activities and stay active</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>Events</h3>
            <p>Register for upcoming events and workshops</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your participation and achievements</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Notifications</h3>
            <p>Stay updated with event reminders and updates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy Access</h3>
            <p>Access the platform anytime, anywhere</p>
          </div>
        </div>
      </div>

      <div className="roles-section">
        <h2>For Students & Admins</h2>
        <div className="roles-grid">
          <div className="role-card">
            <h3>👨‍🎓 Students</h3>
            <ul>
              <li>Browse available activities</li>
              <li>Register for clubs, sports, and events</li>
              <li>Track your participation history</li>
              <li>Receive event notifications</li>
            </ul>
          </div>
          <div className="role-card">
            <h3>👨‍💼 Administrators</h3>
            <ul>
              <li>Create and manage activities</li>
              <li>Track student participation</li>
              <li>Update event schedules</li>
              <li>Monitor engagement statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
