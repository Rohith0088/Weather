# Weather Dashboard

This project is a real-time weather dashboard that provides current weather, forecasts, and other weather-related information using multiple APIs.

## Features

*   **Real-time Weather:** Get the current weather conditions for any city.
*   **Forecasts:** View multi-day weather forecasts.
*   **Geolocation:** Automatically detect the user's location via their IP address.
*   **City Search:** Search for weather in any city around the world.

## APIs Used

*   [OpenWeatherMap](https://openweathermap.org/api): For global weather data.
*   [WeatherAPI](https://www.weatherapi.com/): For forecasts, time zones, and astronomy data.
*   [IP-API](https://ip-api.com/): For geolocation by IP.
*   [GeoDB Cities](https://rapidapi.com/geodb-cities): For city lookup and information.

## Project Structure

The project is divided into a frontend and a backend.

```
/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/
│   │   │   └── weather.js      # Functions to call the backend weather endpoints
│   │   ├── components/
│   │   │   ├── WeatherCard.js  # Component to display current weather
│   │   │   ├── Forecast.js     # Component to display the weather forecast
│   │   │   └── SearchBar.js    # Component for users to search for a city
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── weatherRoutes.js # Express routes for all weather-related API calls
│   │   ├── config/
│   │   │   └── index.js         # Configuration for API keys and other settings
│   │   ├── services/
│   │   │   └── weatherService.js# Logic to fetch data from external weather APIs
│   │   ├── server.js            # Entry point for the backend server
│   │   └── app.js               # Express app setup
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Setup and Installation

### Backend

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your API keys:
    ```
    OPENWEATHERMAP_API_KEY=your_key
    WEATHERAPI_API_KEY=your_key
    ```
4.  Start the server: `npm start`

### Frontend

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the React app: `npm start`
