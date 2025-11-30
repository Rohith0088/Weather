import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    upcomingActivities: 0,
    totalParticipants: 0,
    byType: { club: 0, sport: 0, event: 0 }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await activitiesAPI.getAll();
      const activities = res.data;

      const totalParticipants = activities.reduce((sum, a) => sum + a.currentParticipants, 0);
      const byType = { club: 0, sport: 0, event: 0 };
      activities.forEach(a => {
        if (byType[a.type] !== undefined) byType[a.type]++;
      });

      setStats({
        totalActivities: activities.length,
        upcomingActivities: activities.filter(a => a.status === 'upcoming').length,
        totalParticipants,
        byType
      });

      setRecentActivities(activities.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card primary">
          <h3>{stats.totalActivities}</h3>
          <p>Total Activities</p>
        </div>
        <div className="stat-card success">
          <h3>{stats.upcomingActivities}</h3>
          <p>Upcoming</p>
        </div>
        <div className="stat-card info">
          <h3>{stats.totalParticipants}</h3>
          <p>Total Registrations</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Activities by Type</h2>
          <div className="type-stats">
            <div className="type-item">
              <span className="type-icon">🎭</span>
              <span className="type-name">Clubs</span>
              <span className="type-count">{stats.byType.club}</span>
            </div>
            <div className="type-item">
              <span className="type-icon">⚽</span>
              <span className="type-name">Sports</span>
              <span className="type-count">{stats.byType.sport}</span>
            </div>
            <div className="type-item">
              <span className="type-icon">🎉</span>
              <span className="type-name">Events</span>
              <span className="type-count">{stats.byType.event}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Recent Activities</h2>
          <div className="recent-list">
            {recentActivities.length === 0 ? (
              <p className="no-data">No activities yet</p>
            ) : (
              recentActivities.map(activity => (
                <div key={activity._id} className="recent-item">
                  <div className="recent-info">
                    <h4>{activity.name}</h4>
                    <span className="recent-type">{activity.type}</span>
                  </div>
                  <div className="recent-stats">
                    <span>{activity.currentParticipants}/{activity.maxParticipants}</span>
                    <span className={`status-${activity.status}`}>{activity.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
