const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./api/weatherRoutes');
const authRoutes = require('./api/authRoutes');
const activityRoutes = require('./api/activityRoutes');
const registrationRoutes = require('./api/registrationRoutes');
const notificationRoutes = require('./api/notificationRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = app;