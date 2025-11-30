import React from 'react';
import './ActivityCard.css';

const ActivityCard = ({ activity, onRegister, onCancel, isRegistered, showActions = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'club': return '🎭';
      case 'sport': return '⚽';
      case 'event': return '🎉';
      default: return '📋';
    }
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <span className="activity-type">
          {getTypeIcon(activity.type)} {activity.type}
        </span>
        <span className={`activity-status ${getStatusClass(activity.status)}`}>
          {activity.status}
        </span>
      </div>
      <h3 className="activity-name">{activity.name}</h3>
      <p className="activity-description">{activity.description}</p>
      <div className="activity-details">
        <p><strong>📅 Date:</strong> {formatDate(activity.date)}</p>
        <p><strong>🕐 Time:</strong> {activity.time}</p>
        <p><strong>📍 Location:</strong> {activity.location}</p>
        <p><strong>👥 Participants:</strong> {activity.currentParticipants}/{activity.maxParticipants}</p>
      </div>
      {showActions && activity.status === 'upcoming' && (
        <div className="activity-actions">
          {isRegistered ? (
            <button className="btn-cancel" onClick={() => onCancel(activity._id)}>
              Cancel Registration
            </button>
          ) : (
            <button 
              className="btn-register" 
              onClick={() => onRegister(activity._id)}
              disabled={activity.currentParticipants >= activity.maxParticipants}
            >
              {activity.currentParticipants >= activity.maxParticipants ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
