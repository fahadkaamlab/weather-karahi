# Karachi Weather App

A lightweight weather app focused on Karachi, Pakistan.

## Features
- Real-time current weather for Karachi
- 5-day temperature and condition forecast
- Responsive, clean UI
- Uses the free Open-Meteo API (no API key required)

## Run locally
Because this app uses browser `fetch`, run it with a local HTTP server:

```bash
python3 -m http.server 8000
```

Then open: <http://localhost:8000>


## Deploy to GitHub Pages
1. Push this repository to `fahadkaamlab/weather-karahi`.
2. In GitHub repo settings, set **Pages** source to **GitHub Actions**.
3. Push to `main`, `master`, or `work` branch to trigger deployment.
4. Site URL: `https://fahadkaamlab.github.io/weather-karahi/`.
