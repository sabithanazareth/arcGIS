# React ArcGIS Weather Dashboard

This project is a React-based weather dashboard application that integrates with ArcGIS for mapping functionalities. It allows users to view weather conditions based on their location and interact with various mapping features.

## Features

- **Mapping**: Displays a satellite view map using ArcGIS's SceneView.
- **Weather Information**: Fetches current weather data from OpenWeatherMap API based on user location.
- **Widgets**: Includes widgets for weather display (`Weather`), location search (`Search`), user location tracking (`Locate`), and map tracking (`Track`).

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **ArcGIS API for JavaScript**: Provides mapping and spatial analytics capabilities.
- **OpenWeather**: Provides weather information depending on the location.
- **Axios**: Promise-based HTTP client for making API requests.
- **CSS**: Styling using CSS modules for component-specific styles.

## Setup Instructions

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the root directory with your OpenWeatherMap API key:

   ```bash
   REACT_APP_API_KEY=your_openweathermap_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```
