const express = require('express');
const router = express.Router();
const FileStorage = require('../storage/fileStorage');
const { protect } = require('../middleware/auth');

// Get current user's registrations
router.get('/my-registrations', protect, async (req, res) => {
  try {
    const registrations = await FileStorage.registrations.find({ student: req.user._id });
    const populatedRegistrations = await FileStorage.populate.activities(registrations);
    
    // Sort by registeredAt descending
    populatedRegistrations.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    
    res.json(populatedRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for an activity
router.post('/register/:activityId', protect, async (req, res) => {
  try {
    const activity = await FileStorage.activities.findById(req.params.activityId);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    if (activity.status === 'cancelled') {
      return res.status(400).json({ message: 'This activity has been cancelled' });
    }
    
    if (activity.status === 'completed') {
      return res.status(400).json({ message: 'This activity has already ended' });
    }
    
    if (activity.currentParticipants >= activity.maxParticipants) {
      return res.status(400).json({ message: 'Activity is full' });
    }
    
    // Check if already registered
    const existingRegistration = await FileStorage.registrations.findOne({
      student: req.user._id,
      activity: req.params.activityId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this activity' });
    }
    
    // Create registration
    const registration = await FileStorage.registrations.create({
      student: req.user._id,
      activity: req.params.activityId
    });
    
    // Update participant count
    await FileStorage.activities.update(req.params.activityId, {
      currentParticipants: activity.currentParticipants + 1
    });
    
    // Create notification
    await FileStorage.notifications.create({
      user: req.user._id,
      title: 'Registration Successful',
      message: `You have successfully registered for "${activity.name}".`,
      type: 'registration',
      relatedActivity: activity._id
    });
    
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel registration
router.delete('/cancel/:activityId', protect, async (req, res) => {
  try {
    const registration = await FileStorage.registrations.findOne({
      student: req.user._id,
      activity: req.params.activityId
    });
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    const activity = await FileStorage.activities.findById(req.params.activityId);
    
    // Delete registration
    await FileStorage.registrations.delete(registration._id);
    
    // Update participant count
    if (activity && activity.currentParticipants > 0) {
      await FileStorage.activities.update(req.params.activityId, {
        currentParticipants: activity.currentParticipants - 1
      });
    }
    
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
