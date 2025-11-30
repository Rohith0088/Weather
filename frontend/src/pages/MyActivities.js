import React, { useState, useEffect } from 'react';
import { registrationsAPI } from '../api';
import ActivityCard from '../components/ActivityCard';
import './MyActivities.css';

const MyActivities = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await registrationsAPI.getMyRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      setError('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (activityId) => {
    try {
      await registrationsAPI.cancel(activityId);
      fetchRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.status === filter;
  });

  if (loading) return <div className="loading">Loading your activities...</div>;

  return (
    <div className="my-activities-page">
      <div className="my-activities-header">
        <h1>My Activities</h1>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Registrations</option>
            <option value="registered">Registered</option>
            <option value="attended">Attended</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-container">
        <div className="stat-card">
          <h3>{registrations.length}</h3>
          <p>Total Registrations</p>
        </div>
        <div className="stat-card">
          <h3>{registrations.filter(r => r.status === 'attended').length}</h3>
          <p>Attended</p>
        </div>
        <div className="stat-card">
          <h3>{registrations.filter(r => r.activity?.status === 'upcoming').length}</h3>
          <p>Upcoming</p>
        </div>
      </div>

      <div className="registrations-list">
        {filteredRegistrations.length === 0 ? (
          <p className="no-registrations">No registrations found.</p>
        ) : (
          filteredRegistrations.map(registration => (
            <div key={registration._id} className="registration-item">
              <ActivityCard
                activity={registration.activity}
                onCancel={handleCancel}
                isRegistered={true}
                showActions={registration.activity?.status === 'upcoming'}
              />
              <div className="registration-status">
                <span className={`status-badge status-${registration.status}`}>
                  {registration.status}
                </span>
                <span className="registered-date">
                  Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyActivities;
