import React, { useEffect, useState } from "react";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import haze_icon from "../assets/haze.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import thermometer_icon from "../assets/thermometer.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

function WeatherApp() {
  const [city, setCity] = useState("Jessore"); // Default city is Jessore
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return clear_icon;
      case "Clouds":
        return cloud_icon;
      case "Haze":
        return haze_icon;
      case "Rain":
        return rain_icon;
      case "Snow":
        return snow_icon;
      default:
        return cloud_icon;
    }
  };

  const fetchWeather = async () => {
    if (!city) return;
    try {
      // Current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8fb056c60821b6d89fd45284b2a1b369`
      );
      const data = await response.json();
      setWeather(data);

      // 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=8fb056c60821b6d89fd45284b2a1b369`
      );
      const forecastData = await forecastRes.json();

      // Group by day and get one forecast per day (e.g., 12:00)
      const daily = [];
      const seen = {};
      forecastData.list.forEach((item) => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        if (!seen[day] && date.getHours() === 12) {
          daily.push({
            day,
            temp: `${Math.round(item.main.temp_max)}°-${Math.round(item.main.temp_min)}°`,
            main: item.weather[0].main,
            desc: item.weather[0].description,
          });
          seen[day] = true;
        }
      });
      setForecast(daily.slice(0, 5)); // Only next 5 days
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-black text-white p-4">
      <div className="electric-border backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-6 w-[650px]">
        {/* Search */}
        <div className="flex justify-end gap-5 items-center mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-3 w-80 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none transition-all duration-300 focus:bg-white/30 focus:scale-105 fade-in"
          />
          <button
            onClick={fetchWeather}
            className="ml-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold shadow-md transition-all duration-300 hover:scale-105 fade-in"
          >
            Search
          </button>
        </div>

        {/* Weather Info */}
        {weather && weather.main ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold shiny-text">{weather.name}</h2>
                <p className="text-gray-300">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h1 className="text-6xl font-extrabold mt-4">
                  {Math.round(weather.main.temp)}°C
                </h1>
                <p className="capitalize text-gray-200">
                  {weather.weather[0].description}
                </p>
              </div>

              {/* Weather Icon */}
              <img
                src={getWeatherIcon(weather.weather[0].main)}
                alt={weather.weather[0].main}
                className="w-52 h-52 drop-shadow-lg weather-bounce fade-in"
              />
            </div>

            {/* Extra Details */}
            <div className="flex justify-between text-sm mt-6">
              <p className="flex items-center gap-1">
                <img className="w-5 h-5" src={thermometer_icon} alt="" />
                Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p className="flex items-center gap-2">
                <img src={humidity_icon} alt="Humidity" className="w-5 h-5" />
                {weather.main.humidity}% Humidity
              </p>
              <p className="flex items-center gap-2">
                <img src={wind_icon} alt="Wind" className="w-5 h-5" />
                {weather.wind.speed} m/s
              </p>
            </div>
          </>
        ) : weather && weather.cod === "404" ? (
          <p className="text-red-400 mt-4">❌ City not found</p>
        ) : (
          <p className="text-gray-400 mt-6">Search for a city 🌍</p>
        )}

        {/* Weekly Forecast (Live) */}
        <div className="grid grid-cols-5 gap-2 mt-8 text-center">
          {forecast.length > 0 ? (
            forecast.map((d, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl p-3 flex flex-col items-center card-hover fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <p className="font-semibold">{d.day}</p>
                <img
                  src={getWeatherIcon(d.main)}
                  alt={d.desc}
                  className="w-10 h-10 weather-bounce"
                />
                <p className="text-sm">{d.temp}</p>
                <p className="text-xs text-gray-300">{d.desc}</p>
              </div>
            ))
          ) : (
            <p className="col-span-5 text-gray-400">No forecast data</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
