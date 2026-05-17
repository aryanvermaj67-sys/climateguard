

'use strict';


const API_KEY = 'b2e9edf39bf3bd1594c4d9a41cee359f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL  = 'https://nominatim.openstreetmap.org/search';



const celsiusToFahrenheit = (c) => (c * 9) / 5 + 32;

const fahrenheitToCelsius = (f) => ((f - 32) * 5) / 9;


const celsiusToKelvin = (c) => c + 273.15;


function convertTemperature(value, from, to) {
 
  let celsius;
  switch (from) {
    case 'C': celsius = value; break;
    case 'F': celsius = fahrenheitToCelsius(value); break;
    case 'K': celsius = value - 273.15; break;
    default:  celsius = value;
  }

  switch (to) {
    case 'C': return celsius;
    case 'F': return celsiusToFahrenheit(celsius);
    case 'K': return celsiusToKelvin(celsius);
    default:  return celsius;
  }
}


const formatTemp = (tempC) => {
 
  const unit = localStorage.getItem('cg_unit') || 'C';
  if (unit === 'F') {
    return `${Math.round(celsiusToFahrenheit(tempC))}°F`;
  }
  return `${Math.round(tempC)}°C`;
};

const getTempValue = (tempC) => {
  const unit = localStorage.getItem('cg_unit') || 'C';
  return unit === 'F' ? Math.round(celsiusToFahrenheit(tempC)) : Math.round(tempC);
};


const capitalise = (str) =>
  str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');


const formatTime = (unix, offsetSec = 0) => {
 
  const d = new Date((unix + offsetSec) * 1000);
  let h = d.getUTCHours();
  let m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};


function getWeatherEmoji(code, isDay = true) {

  const emojiMap = {
    200: '⛈️', 201: '⛈️', 202: '⛈️',
    210: '🌩️', 211: '🌩️', 212: '🌩️',
    300: '🌦️', 301: '🌦️', 310: '🌧️',
    500: '🌧️', 501: '🌧️', 502: '🌧️', 503: '🌧️',
    511: '🌨️', 520: '🌦️', 521: '🌦️',
    600: '❄️', 601: '🌨️', 602: '❄️',
    701: '🌫️', 711: '🌫️', 741: '🌫️',
    800: isDay ? '☀️' : '🌙',
    801: '🌤️', 802: '⛅', 803: '🌥️', 804: '☁️',
  };


  for (const key in emojiMap) {
    if (parseInt(key) === code) return emojiMap[key];
  }

  
  return code >= 200 && code < 300 ? '⛈️'
       : code >= 300 && code < 400 ? '🌦️'
       : code >= 500 && code < 600 ? '🌧️'
       : code >= 600 && code < 700 ? '❄️'
       : code >= 700 && code < 800 ? '🌫️'
       : '🌤️';
}

const $ = (id) => document.getElementById(id);
const $q = (sel) => document.querySelector(sel);
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  
  const { className, id, textContent, innerHTML, ...rest } = attrs;
  if (className)   el.className   = className;
  if (id)          el.id          = id;
  if (textContent) el.textContent = textContent;
  if (innerHTML)   el.innerHTML   = innerHTML;


  for (const [attr, val] of Object.entries(rest)) {
    el.setAttribute(attr, val);
  }
  for (const child of children) el.appendChild(child);
  return el;
}


const showEl = (el, show = true) => {
  el.style.display = show ? '' : 'none';
};


const lsSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn('localStorage write failed:', e); }
};


const lsGet = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('localStorage read failed:', e);
    return fallback;
  }
};

function debounce(fn, delay) {
  let timer; 
  return function (...args) {
    clearTimeout(timer);
   
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}


const log   = (...args) => console.log('[CG]', ...args);
const warn  = (...args) => console.warn('[CG]', ...args);
const error = (...args) => console.error('[CG]', ...args);

window.CG = {
  API_KEY, BASE_URL, GEO_URL,
  convertTemperature, celsiusToFahrenheit, fahrenheitToCelsius,
  formatTemp, getTempValue, capitalise, formatTime, getWeatherEmoji,
  $, $q, createElement, showEl,
  lsSet, lsGet, debounce,
  log, warn, error,
};
