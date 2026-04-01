const KARACHI = {
  name: "Karachi",
  latitude: 24.8607,
  longitude: 67.0011,
  timezone: "Asia/Karachi",
};

const currentEl = document.getElementById("currentContent");
const forecastEl = document.getElementById("forecastContent");

function weatherCodeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
  };
  return map[code] ?? "Unknown";
}

function formatDay(dateString) {
  return new Date(dateString).toLocaleDateString("en-PK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

async function loadWeather() {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: KARACHI.latitude,
    longitude: KARACHI.longitude,
    timezone: KARACHI.timezone,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "5",
  }).toString();

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather.");
    const data = await res.json();

    const current = data.current;
    currentEl.classList.remove("loading");
    currentEl.innerHTML = `
      <div class="current-grid">
        <div class="current-item"><span class="label">Location</span><span class="value">${KARACHI.name}</span></div>
        <div class="current-item"><span class="label">Temperature</span><span class="value">${Math.round(current.temperature_2m)}°C</span></div>
        <div class="current-item"><span class="label">Feels like</span><span class="value">${Math.round(current.apparent_temperature)}°C</span></div>
        <div class="current-item"><span class="label">Humidity</span><span class="value">${current.relative_humidity_2m}%</span></div>
        <div class="current-item"><span class="label">Wind</span><span class="value">${Math.round(current.wind_speed_10m)} km/h</span></div>
        <div class="current-item"><span class="label">Condition</span><span class="value">${weatherCodeToText(current.weather_code)}</span></div>
      </div>
    `;

    forecastEl.innerHTML = data.daily.time
      .map((date, idx) => {
        const max = Math.round(data.daily.temperature_2m_max[idx]);
        const min = Math.round(data.daily.temperature_2m_min[idx]);
        const code = data.daily.weather_code[idx];
        return `
          <article class="day">
            <h3>${formatDay(date)}</h3>
            <p>${weatherCodeToText(code)}</p>
            <strong>${max}° / ${min}°</strong>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    currentEl.classList.remove("loading");
    currentEl.textContent = "Could not load weather data right now. Please try again.";
    forecastEl.innerHTML = "";
    console.error(error);
  }
}

loadWeather();
