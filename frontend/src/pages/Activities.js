import React, { useState, useEffect, useCallback } from 'react';
import { activitiesAPI, registrationsAPI } from '../api';
import ActivityCard from '../components/ActivityCard';
import { useAuth } from '../context/AuthContext';
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [registeredActivities, setRegisteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ type: '', status: '' });
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.status) params.status = filter.status;
      
      // Fetch activities
      const activitiesRes = await activitiesAPI.getAll(params);
      setActivities(activitiesRes.data);
      
      // Only fetch registrations if user is logged in
      if (user) {
        const registrationsRes = await registrationsAPI.getMyRegistrations();
        setRegisteredActivities(registrationsRes.data.map(r => r.activity._id));
      } else {
        setRegisteredActivities([]);
      }
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [filter, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRegister = async (activityId) => {
    try {
      await registrationsAPI.register(activityId);
      setRegisteredActivities([...registeredActivities, activityId]);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleCancel = async (activityId) => {
    try {
      await registrationsAPI.cancel(activityId);
      setRegisteredActivities(registeredActivities.filter(id => id !== activityId));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  if (loading) return <div className="loading">Loading activities...</div>;

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1>Extracurricular Activities</h1>
        <div className="filters">
          <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
            <option value="">All Types</option>
            <option value="club">Clubs</option>
            <option value="sport">Sports</option>
            <option value="event">Events</option>
          </select>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="activities-grid">
        {activities.length === 0 ? (
          <p className="no-activities">No activities found.</p>
        ) : (
          activities.map(activity => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onRegister={handleRegister}
              onCancel={handleCancel}
              isRegistered={registeredActivities.includes(activity._id)}
              showActions={user && user.role === 'student'}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Activities;
