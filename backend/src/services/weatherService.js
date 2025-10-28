const axios = require('axios');
const { OPENWEATHERMAP_API_KEY, WEATHERAPI_API_KEY } = require('../config');

const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error("Error fetching from OpenWeatherMap:", error.response ? error.response.data : error.message);
    throw new Error('Could not fetch current weather from OpenWeatherMap.');
  }
};

const getWeatherForecast = async (city) => {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_API_KEY}&q=${city}&days=5`);
    return response.data;
  } catch (error) {
    console.error("Error fetching from WeatherAPI:", error.response ? error.response.data : error.message);
    throw new Error('Could not fetch weather forecast from WeatherAPI.');
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
};