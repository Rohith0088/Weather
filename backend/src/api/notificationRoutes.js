const express = require('express');
const router = express.Router();
const FileStorage = require('../storage/fileStorage');
const { protect } = require('../middleware/auth');

// Get current user's notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await FileStorage.notifications.find({ user: req.user._id });
    
    // Populate related activity info
    const populatedNotifications = await Promise.all(notifications.map(async (notif) => {
      if (notif.relatedActivity) {
        const activity = await FileStorage.activities.findById(notif.relatedActivity);
        return { ...notif, relatedActivity: activity ? { name: activity.name, type: activity.type, date: activity.date } : null };
      }
      return notif;
    }));
    
    res.json(populatedNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread notification count
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await FileStorage.notifications.countDocuments({ 
      user: req.user._id, 
      read: false 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await FileStorage.notifications.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    const updatedNotification = await FileStorage.notifications.update(req.params.id, { read: true });
    
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await FileStorage.notifications.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await FileStorage.notifications.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    await FileStorage.notifications.delete(req.params.id);
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
