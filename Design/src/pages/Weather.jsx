import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Helper component to recenter the map dynamically
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 6);
  }, [position, map]);
  return null;
};

// Legend component
const MapLegend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.background = "#75d99f";
      div.style.padding = "10px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
      div.innerHTML = `
        <h4 style="margin:0 0 5px 0;font-size:14px;">⚠️ Alerts</h4>
        <i style="background: blue; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></i> Heavy Rain<br/>
        <i style="background: red; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></i> Heatwave<br/>
        <i style="background: purple; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></i> Storm<br/>
        <i style="background: cyan; width: 12px; height: 12px; display: inline-block; margin-right: 6px;"></i> Extreme Cold
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

const WeatherPage = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default India
  const [alerts, setAlerts] = useState([]);

  // Marker icon
  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Search weather by city
  const getWeather = async () => {
    if (!city) return alert("Please enter a city.");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const { coord } = res.data;
      setWeather(res.data);
      setPosition([coord.lat, coord.lon]);

      await fetchNearbyAlerts(coord.lat, coord.lon);
    } catch (err) {
      console.error(err);
      alert("City not found or API error.");
    }
  };

  // Use geolocation
  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await getWeatherByCoords(latitude, longitude);
        },
        () => alert("Geolocation permission denied")
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setPosition([lat, lon]);

      await fetchNearbyAlerts(lat, lon);
    } catch (err) {
      console.error(err);
      alert("Could not fetch weather for your location.");
    }
  };

  // Fetch nearby alerts
  const fetchNearbyAlerts = async (lat, lon) => {
    try {
      const nearby = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=15&appid=${API_KEY}&units=metric`
      );

      const extremeAlerts = nearby.data.list
        .map((place) => {
          let type = null;
          if (place.rain?.["1h"] && place.rain["1h"] > 2) type = "Heavy Rain";
          else if (place.main.temp > 30) type = "Heatwave";
          else if (place.wind.speed > 6) type = "Storm";
          else if (place.main.temp < 10) type = "Extreme Cold";

          if (type)
            return {
              name: place.name,
              lat: place.coord.lat,
              lon: place.coord.lon,
              type,
            };
          return null;
        })
        .filter((x) => x !== null);

      console.log("Nearby data:", nearby.data.list);
      console.log("Extreme alerts:", extremeAlerts);

      setAlerts(extremeAlerts);
    } catch (err) {
      console.error(err);
    }
  };

  // Alert circle colors
  const getColor = (type) => {
    switch (type) {
      case "Heavy Rain":
        return "blue";
      case "Heatwave":
        return "red";
      case "Storm":
        return "purple";
      case "Extreme Cold":
        return "cyan";
      default:
        return "green";
    }
  };

  // Dynamic circle radius
  const getRadius = (type) => {
    switch (type) {
      case "Storm":
        return 150000;
      case "Heavy Rain":
        return 120000;
      case "Heatwave":
        return 80000;
      case "Extreme Cold":
        return 60000;
      default:
        return 50000;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🌍 Weather & Alerts</h2>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={styles.input}
        />
        <button onClick={getWeather} style={styles.button}>
          Search
        </button>
        <button
          onClick={useMyLocation}
          style={{ ...styles.button, marginLeft: 10 }}
        >
          Use My Location
        </button>
      </div>

      {weather && (
        <div style={styles.card}>
          <h3>{weather.name}</h3>
          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>🤔 Feels Like: {weather.main.feels_like}°C</p>
          <p>☁ Condition: {weather.weather[0].description}</p>
          <p>💨 Wind: {weather.wind.speed} m/s</p>
          <p>📊 Pressure: {weather.main.pressure} hPa</p>
          <p>
            🌅 Sunrise:{" "}
            {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>
            🌇 Sunset:{" "}
            {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      )}

      <MapContainer center={position} zoom={6} style={styles.map}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Always show marker */}
        <Marker position={position} icon={markerIcon}>
          <Popup>
            {weather ? (
              <>
                <b>{weather.name}</b> <br />
                🌡 {weather.main.temp}°C <br />
                {weather.weather[0].description}
              </>
            ) : (
              "📍 Your Location"
            )}
          </Popup>
        </Marker>

        {/* Alerts */}
        {alerts.map((a, i) => (
          <Circle
            key={i}
            center={[a.lat, a.lon]}
            radius={getRadius(a.type)}
            pathOptions={{ color: getColor(a.type), fillOpacity: 0.5 }}
          >
            <Popup>
              ⚠️ {a.type} in <b>{a.name}</b>
            </Popup>
          </Circle>
        ))}

        <RecenterMap position={position} />
        <MapLegend />
      </MapContainer>
    </div>
  );
};

// Inline styles
const styles = {
  container: { padding: 20, textAlign: "center" },
  heading: { fontSize: 28, marginBottom: 20, color: "#2d6a4f" },
  searchBox: { marginBottom: 20 },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginRight: 10,
    width: 250,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    fontSize: 16,
    backgroundColor: "#2d6a4f",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  card: {
    background: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    display: "inline-block",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  map: { height: 500, width: "100%", borderRadius: 10 },
};

export default WeatherPage;
