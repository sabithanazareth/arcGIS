import React, { useEffect, useState } from "react";
import Map from "@arcgis/core/Map";
import Graphic from "@arcgis/core/Graphic";
import SceneView from "@arcgis/core/views/SceneView";
import Expand from "@arcgis/core/widgets/Expand";
import Weather from "@arcgis/core/widgets/Weather";
import Search from "@arcgis/core/widgets/Search";
import Locate from "@arcgis/core/widgets/Locate";
import Track from "@arcgis/core/widgets/Track";
import "@arcgis/core/assets/esri/themes/light/main.css";
import axios from "axios";
import "./App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState({
    main: "",
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    precipitation: 0,
  });
  const [view, setView] = useState(null);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_APP_API_KEY;
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      setWeatherData({
        main: data.weather[0].main,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        precipitation: data.rain ? data.rain["1h"] : 0, // Assuming rain in the last hour
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    const mapView = new SceneView({
      container: "MapApp",
      map: new Map({
        basemap: "satellite",
        ground: "world-elevation",
      }),
      environment: {
        weather: {
          type: "rainy",
          cloudCover: 0.3,
        },
      },
    });

    setView(mapView);

    const weatherExpand = new Expand({
      view: mapView,
      content: new Weather({
        view: mapView,
      }),
      group: "bottom-right",
      expanded: true,
    });

    const searchWidget = new Search({
      view: mapView,
    });

    const locateWidget = new Locate({
      view: mapView,
      useHeadingEnabled: false,
      goToOverride: function (view, options) {
        options.target.scale = 1500;
        return view.goTo(options.target);
      },
    });

    const track = new Track({
      view: mapView,
      graphic: new Graphic({
        symbol: {
          type: "simple-marker",
          size: "12px",
          color: "green",
          outline: {
            color: "#efefef",
            width: "1.5px",
          },
        },
      }),
      useHeadingEnabled: false,
    });

    mapView.ui.add(weatherExpand, "bottom-right");
    mapView.ui.add(locateWidget, "top-left");
    mapView.ui.add(searchWidget, "top-right");
    mapView.ui.add(track, "top-left");

    locateWidget.on("locate", function (locateEvent) {
      const { coords } = locateEvent.position;
      fetchWeather(coords.latitude, coords.longitude);
    });

    searchWidget.on("select-result", function (event) {
      const { geometry } = event.result.feature;
      fetchWeather(geometry.latitude, geometry.longitude);
    });

    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (view && weatherData.main) {
      let weatherType;
      let cloudCover = 0.3; // Default cloud cover

      switch (weatherData.main.toLowerCase()) {
        case "clouds":
          weatherType = "cloudy";
          break;
        case "clear":
          weatherType = "clear";
          cloudCover = 0.1;
          break;
        case "rain":
          weatherType = "rainy";
          break;
        default:
          weatherType = "cloudy";
      }

      view.environment.weather = {
        type: weatherType,
        cloudCover: cloudCover,
      };
    }
  }, [weatherData, view]);

  return (
    <>
      {weatherData.main && (
        <div className="weather-container">
          <h2>{weatherData.main} at this location</h2>
          <div className="weather-details">
            <div className="weather-item">
              <strong>Temperature:</strong> {weatherData.temperature} °C
            </div>
            <div className="weather-item">
              <strong>Humidity:</strong> {weatherData.humidity}%
            </div>
            <div className="weather-item">
              <strong>Wind Speed:</strong> {weatherData.windSpeed} m/s
            </div>
          </div>
        </div>
      )}
      <div id="MapApp" style={{ height: "80vh" }} />
    </>
  );
};

export default App;
