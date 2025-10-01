import React, { useEffect, useState } from "react";
import clear_icon from "../assets/clear.png"; 
import cloud_icon from "../assets/cloud.png";
import haze_icon from "../assets/haze.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png"; 

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8fb056c60821b6d89fd45284b2a1b369`
      );
      const data = await response.json();
      setWeather(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    // Fetch weather for a default city on initial load
    fetchWeather("Dhaka");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-black text-white p-4">
      <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-6 w-[650px]">
        
        {/* Search */}
        <div className="flex justify-end gap-5 items-center mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-3 w-76 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none"
          />
          <button
            onClick={fetchWeather}
            className="ml-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold shadow-md"
          >
            Search
          </button>
        </div>

        {/* Weather Info */}
        {weather && weather.main ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{weather.name}</h2>
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
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt="weather icon"
                className="w-52 h-52 drop-shadow-lg"
              />
            </div>

            {/* Extra Details */}
            <div className="flex justify-between text-sm mt-6">
              <p>🌡️ Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p>💧 {weather.main.humidity}% Humidity</p>
              <p>🌬️ {weather.wind.speed} m/s</p>
            </div>
          </>
        ) : weather && weather.cod === "404" ? (
          <p className="text-red-400 mt-4">❌ City not found</p>
        ) : (
          <p className="text-gray-400 mt-6">Search for a city 🌍</p>
        )}

        {/* Weekly Forecast (Static demo for now) */}
        <div className="grid grid-cols-5 gap-2 mt-8 text-center">
          {[
            { day: "Thu", temp: "23°-14°", icon: "04d", text: "Clouds" },
            { day: "Fri", temp: "26°-18°", icon: "01d", text: "Clear" },
            { day: "Sat", temp: "25°-17°", icon: "50d", text: "Haze" },
            { day: "Sun", temp: "22°-13°", icon: "10d", text: "Rain" },
            { day: "Mon", temp: "24°-11°", icon: "11d", text: "Storm" },
          ].map((d, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-xl p-3 flex flex-col items-center"
            >
              <p className="font-semibold">{d.day}</p>
              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt={d.text}
                className="w-10 h-10"
              />
              <p className="text-sm">{d.temp}</p>
              <p className="text-xs text-gray-300">{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
