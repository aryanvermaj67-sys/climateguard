'use strict';


let fetchedWeatherData = null;


function initWeather() {
  const { $, showEl, formatTemp, capitalise, getWeatherEmoji, formatTime,
    API_KEY, BASE_URL, log, error } = window.CG;

  const cityInput = $('cityInput');
  const searchBtn = $('searchBtn');
  const gpsBtn = $('gpsBtn');
  const weatherResults = $('weatherResults');

  if (!cityInput) return;


  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
  });


  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const city = cityInput.value.trim();
      if (city) fetchWeatherByCity(city);
    }
  });


  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    gpsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    navigator.geolocation.getCurrentPosition(

      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
        gpsBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
      },

      () => {
        gpsBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
        alert('Could not get your location.'); // BOM: alert
      }
    );
  });


  window.addEventListener('cg:unitChanged', () => {
    if (fetchedWeatherData) renderWeather(fetchedWeatherData);
  });
}

async function fetchWeatherByCity(city) {
  const { API_KEY, BASE_URL, error } = window.CG;
  setWeatherLoading(true);

  try {

    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );


    if (!response.ok) {
      throw new Error(`City not found — please check the spelling and try again.`);
    }

    const data = await response.json();
    fetchedWeatherData = data;
    renderWeather(data);

  } catch (err) {

    setWeatherLoading(false);
    showWeatherError(err.message);
    error('Weather fetch failed:', err.message);
    return;
  }


  try {
    const lat = parseFloat(fetchedWeatherData.coord.lat);
    const lon = parseFloat(fetchedWeatherData.coord.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      renderWeatherMap(lat, lon, fetchedWeatherData.name);
    }
  } catch (mapErr) {

    error('Map render failed:', mapErr.message);
  }
}


async function fetchWeatherByCoords(lat, lon) {
  const { API_KEY, BASE_URL, error } = window.CG;
  setWeatherLoading(true);

  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Could not get location weather (${response.status}).`);

    const data = await response.json();
    fetchedWeatherData = data;
    renderWeather(data);
  } catch (err) {
    setWeatherLoading(false);
    showWeatherError(err.message);
    error('Coords fetch failed:', err.message);
    return;
  }


  try {
    const pLat = parseFloat(lat);
    const pLon = parseFloat(lon);
    if (!isNaN(pLat) && !isNaN(pLon)) {
      renderWeatherMap(pLat, pLon, fetchedWeatherData.name);
    }
  } catch (mapErr) {
    error('Map render failed (coords):', mapErr.message);
  }
}


function renderWeather(data) {
  const { $, showEl, formatTemp, capitalise, getWeatherEmoji, formatTime, log } = window.CG;

  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, humidity, pressure },
    weather: [{ description, icon, id }],
    wind: { speed },
    visibility,
    timezone,
  } = data;

  const isDay = Date.now() / 1000 > sunrise && Date.now() / 1000 < sunset;

  $('weatherLocation').textContent = `${name}, ${country}`;
  $('weatherTemp').textContent = formatTemp(temp);
  $('weatherIconLarge').textContent = getWeatherEmoji(id, isDay);
  $('weatherDesc').textContent = capitalise(description);
  $('wHumidity').textContent = `${humidity}%`;
  $('wWind').textContent = `${Math.round(speed * 3.6)} km/h`;
  $('wVisibility').textContent = visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A';
  $('wPressure').textContent = `${pressure} hPa`;
  $('wSunrise').textContent = formatTime(sunrise, timezone);
  $('wSunset').textContent = formatTime(sunset, timezone);


  const weatherResults = $('weatherResults');
  if (weatherResults) showEl(weatherResults, true);

  setWeatherLoading(false);
  log('Weather rendered for:', name);
}


function setWeatherLoading(loading) {
  const { $, showEl } = window.CG;
  const btn = $('searchBtn');
  if (!btn) return;
  if (loading) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
  } else {
    btn.textContent = 'Analyze';
    btn.disabled = false;
  }
}

function showWeatherError(msg) {
  const { $ } = window.CG;
  const results = $('weatherResults');
  if (!results) return;
  results.innerHTML = `
    <div style="text-align:center; padding:40px; color:var(--danger);">
      <i class="fa-solid fa-triangle-exclamation" style="font-size:32px;display:block;margin-bottom:12px;"></i>
      <p style="font-size:16px; font-weight:600;">${msg}</p>
      <p style="font-size:14px; color:var(--text-muted); margin-top:8px;">
        Please check the city name and try again.
      </p>
    </div>`;
  results.style.display = 'block';
}


async function getWeatherData(city) {
  const { API_KEY, BASE_URL } = window.CG;
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error(`City not found: ${city}`);
  return response.json();
}


window.initWeather = initWeather;
window.fetchWeatherByCity = fetchWeatherByCity;
window.getWeatherData = getWeatherData;
window.fetchedWeatherData = fetchedWeatherData;
