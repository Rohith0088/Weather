const express = require('express');
const router = express.Router();
const FileStorage = require('../storage/fileStorage');
const { protect, adminOnly } = require('../middleware/auth');

// Get all activities (public)
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const activities = await FileStorage.activities.find(filter);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const activity = await FileStorage.activities.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create activity (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, type, date, time, location, maxParticipants } = req.body;
    
    const activity = await FileStorage.activities.create({
      name,
      description,
      type,
      date,
      time,
      location,
      maxParticipants,
      createdBy: req.user._id
    });
    
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update activity (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const activity = await FileStorage.activities.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    const { name, description, type, date, time, location, maxParticipants, status } = req.body;
    
    const updateData = {
      name: name || activity.name,
      description: description || activity.description,
      type: type || activity.type,
      date: date || activity.date,
      time: time || activity.time,
      location: location || activity.location,
      maxParticipants: maxParticipants || activity.maxParticipants,
      status: status || activity.status
    };
    
    const updatedActivity = await FileStorage.activities.update(req.params.id, updateData);
    
    // Notify registered students about the update using bulk insert
    const registrations = await FileStorage.registrations.find({ activity: activity._id });
    if (registrations.length > 0) {
      const notifications = registrations.map(reg => ({
        user: reg.student,
        title: 'Activity Updated',
        message: `The activity "${activity.name}" has been updated.`,
        type: 'update',
        relatedActivity: activity._id
      }));
      await FileStorage.notifications.insertMany(notifications);
    }
    
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete activity (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const activity = await FileStorage.activities.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Notify registered students about cancellation using bulk insert
    const registrations = await FileStorage.registrations.find({ activity: activity._id });
    if (registrations.length > 0) {
      const notifications = registrations.map(reg => ({
        user: reg.student,
        title: 'Activity Cancelled',
        message: `The activity "${activity.name}" has been cancelled.`,
        type: 'cancellation',
        relatedActivity: activity._id
      }));
      await FileStorage.notifications.insertMany(notifications);
    }
    
    // Delete all registrations for this activity
    await FileStorage.registrations.deleteMany({ activity: activity._id });
    
    await FileStorage.activities.delete(req.params.id);
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity participants (admin only)
router.get('/:id/participants', protect, adminOnly, async (req, res) => {
  try {
    const registrations = await FileStorage.registrations.find({ activity: req.params.id });
    const populatedRegistrations = await FileStorage.populate.students(registrations);
    
    res.json(populatedRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update participant status (admin only)
router.put('/:id/participants/:registrationId', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const registration = await FileStorage.registrations.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    const updatedRegistration = await FileStorage.registrations.update(req.params.registrationId, { status });
    
    res.json(updatedRegistration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
