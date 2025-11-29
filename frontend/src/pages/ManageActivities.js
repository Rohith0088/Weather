import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../api';
import './ManageActivities.css';

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'club',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
    status: 'upcoming'
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await activitiesAPI.getAll();
      setActivities(res.data);
    } catch (err) {
      alert('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await activitiesAPI.update(editingActivity._id, formData);
      } else {
        await activitiesAPI.create(formData);
      }
      fetchActivities();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      type: activity.type,
      date: activity.date.split('T')[0],
      time: activity.time,
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      status: activity.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activitiesAPI.delete(id);
        fetchActivities();
      } catch (err) {
        alert('Failed to delete activity');
      }
    }
  };

  const handleViewParticipants = async (activity) => {
    try {
      const res = await activitiesAPI.getParticipants(activity._id);
      setParticipants(res.data);
      setSelectedActivity(activity);
    } catch (err) {
      alert('Failed to load participants');
    }
  };

  const handleUpdateParticipantStatus = async (registrationId, status) => {
    try {
      await activitiesAPI.updateParticipantStatus(selectedActivity._id, registrationId, status);
      handleViewParticipants(selectedActivity);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingActivity(null);
    setFormData({
      name: '',
      description: '',
      type: 'club',
      date: '',
      time: '',
      location: '',
      maxParticipants: 50,
      status: 'upcoming'
    });
  };

  if (loading) return <div className="loading">Loading activities...</div>;

  return (
    <div className="manage-activities">
      <div className="page-header">
        <h1>Manage Activities</h1>
        <button onClick={() => setShowForm(true)} className="add-btn">
          + Add Activity
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="club">Club</option>
                    <option value="sport">Sport</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingActivity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedActivity && (
        <div className="modal-overlay">
          <div className="modal participants-modal">
            <h2>Participants - {selectedActivity.name}</h2>
            <div className="participants-list">
              {participants.length === 0 ? (
                <p className="no-data">No participants yet</p>
              ) : (
                participants.map(reg => (
                  <div key={reg._id} className="participant-item">
                    <div className="participant-info">
                      <h4>{reg.student.name}</h4>
                      <p>{reg.student.email}</p>
                      {reg.student.studentId && <span>ID: {reg.student.studentId}</span>}
                    </div>
                    <div className="participant-status">
                      <select
                        value={reg.status}
                        onChange={(e) => handleUpdateParticipantStatus(reg._id, e.target.value)}
                      >
                        <option value="registered">Registered</option>
                        <option value="attended">Attended</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setSelectedActivity(null)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="activities-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Location</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No activities found</td>
              </tr>
            ) : (
              activities.map(activity => (
                <tr key={activity._id}>
                  <td>{activity.name}</td>
                  <td className="type-cell">
                    <span className={`type-badge type-${activity.type}`}>
                      {activity.type}
                    </span>
                  </td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>{activity.location}</td>
                  <td>{activity.currentParticipants}/{activity.maxParticipants}</td>
                  <td>
                    <span className={`status-badge status-${activity.status}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleViewParticipants(activity)} className="view-btn">
                      👥
                    </button>
                    <button onClick={() => handleEdit(activity)} className="edit-btn">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(activity._id)} className="delete-btn">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageActivities;
