const KARACHI = { latitude: 24.8607, longitude: 67.0011, name: "Karachi" };

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail"
};

const currentWeatherEl = document.getElementById("current-weather");
const forecastEl = document.getElementById("forecast");
const updatedAtEl = document.getElementById("updated-at");

function labelForCode(code) {
  return weatherCodeMap[code] || `Weather code ${code}`;
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

async function fetchWeather() {
  const params = new URLSearchParams({
    latitude: KARACHI.latitude,
    longitude: KARACHI.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "7"
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status}`);
  }

  return response.json();
}

function renderCurrent(current) {
  currentWeatherEl.classList.remove("loading", "error");
  currentWeatherEl.innerHTML = `
    <div class="current-meta">
      <div class="temp">${Math.round(current.temperature_2m)}°C</div>
      <div><strong>${labelForCode(current.weather_code)}</strong></div>
      <div>Feels like: ${Math.round(current.apparent_temperature)}°C</div>
      <div>Humidity: ${current.relative_humidity_2m}%</div>
      <div>Wind: ${Math.round(current.wind_speed_10m)} km/h</div>
    </div>
  `;
}

function renderForecast(daily) {
  forecastEl.innerHTML = "";

  daily.time.forEach((date, index) => {
    const item = document.createElement("article");
    item.className = "day";
    item.innerHTML = `
      <h3>${fmtDate(date)}</h3>
      <div>${labelForCode(daily.weather_code[index])}</div>
      <div>High: <strong>${Math.round(daily.temperature_2m_max[index])}°C</strong></div>
      <div>Low: ${Math.round(daily.temperature_2m_min[index])}°C</div>
    `;
    forecastEl.appendChild(item);
  });
}

async function init() {
  try {
    const data = await fetchWeather();
    renderCurrent(data.current);
    renderForecast(data.daily);
    updatedAtEl.textContent = `Updated: ${new Date(data.current.time).toLocaleString()} (${data.timezone})`;
  } catch (error) {
    currentWeatherEl.classList.add("error");
    currentWeatherEl.textContent = "Could not load weather data right now.";
    forecastEl.innerHTML = "";
    updatedAtEl.textContent = error instanceof Error ? error.message : "Unexpected error";
  }
}

init();
