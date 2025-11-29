const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');

// Get all activities (public)
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const activities = await Activity.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('createdBy', 'name email');
    
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
    
    const activity = await Activity.create({
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
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    const { name, description, type, date, time, location, maxParticipants, status } = req.body;
    
    activity.name = name || activity.name;
    activity.description = description || activity.description;
    activity.type = type || activity.type;
    activity.date = date || activity.date;
    activity.time = time || activity.time;
    activity.location = location || activity.location;
    activity.maxParticipants = maxParticipants || activity.maxParticipants;
    activity.status = status || activity.status;
    
    const updatedActivity = await activity.save();
    
    // Notify registered students about the update
    const registrations = await Registration.find({ activity: activity._id });
    for (const reg of registrations) {
      await Notification.create({
        user: reg.student,
        title: 'Activity Updated',
        message: `The activity "${activity.name}" has been updated.`,
        type: 'update',
        relatedActivity: activity._id
      });
    }
    
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete activity (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Notify registered students about cancellation
    const registrations = await Registration.find({ activity: activity._id });
    for (const reg of registrations) {
      await Notification.create({
        user: reg.student,
        title: 'Activity Cancelled',
        message: `The activity "${activity.name}" has been cancelled.`,
        type: 'cancellation',
        relatedActivity: activity._id
      });
    }
    
    // Delete all registrations for this activity
    await Registration.deleteMany({ activity: activity._id });
    
    await Activity.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity participants (admin only)
router.get('/:id/participants', protect, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ activity: req.params.id })
      .populate('student', 'name email studentId');
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update participant status (admin only)
router.put('/:id/participants/:registrationId', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    registration.status = status;
    await registration.save();
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
