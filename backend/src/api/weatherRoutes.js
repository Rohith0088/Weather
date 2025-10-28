const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// Route to get current weather
router.get('/current', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    const weatherData = await weatherService.getCurrentWeather(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get weather forecast
router.get('/forecast', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    const forecastData = await weatherService.getWeatherForecast(city);
    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;