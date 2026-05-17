# 🌍 ClimateGuard

> **Real-time weather intelligence, weather-aware trip planning, multi-city climate comparison, and global emergency response directory for smart travellers worldwide.**

ClimateGuard is a modern, high-performance web dashboard built to ensure travel safety and situational awareness. Engineered using **Vanilla JS** and styled with **premium glassmorphism graphics**, it integrates live weather forecasts, smart interactive maps, itinerary matching algorithms, and critical regional safety databases.

---

## 🚀 Key Modules & Features

### 1. 🌤️ Live Weather & Geolocation Dashboard
* **Dynamic Search & Autocomplete:** Uses the open-source **Nominatim OpenStreetMap Geocoding API** for instantaneous worldwide city search.
* **Instant GPS Integration:** One-click GPS locate button fetches immediate weather conditions for your current coordinate.
* **Rich Meteorology Indicators:** Visualizes high-fidelity metrics including temperature, relative humidity, wind speed, barometric pressure, visibility distance, and astronomical sunrise/sunset times.
* **High-Performance Map:** Powered by **MapLibre GL JS** for fast vector tile rendering, locating your active search target on an interactive map instantly.

### 2. 🎒 Weather-Aware Trip Planner
* **Dynamic Itinerary Generator:** Generates a custom itinerary optimized to your selected Trip Style (🏖️ Leisure, 💼 Business, 🧗 Adventure, 🏛️ Cultural, 🎒 Backpacking) and Budget range.
* **Climate Risk Assessment:** Rates destination hazards out of 10 (UV index, wind risks, sudden storms) to alert users before travel.
* **Synchronized Countdown Timer:** A high-precision dates-based ticker ticking down to the exact millisecond of your departure.
* **Target Coordinates Mapping:** Dynamically points the map system to your upcoming travel location.

### 3. ⚖️ Parallel City Comparator
* **Multi-City Contrast Table:** Renders essential metrics (temperature, conditions, wind, humidity) side-by-side.
* **Travel Verdict Engine:** Programmatically calculates weather metrics and awards a travel recommendation comparing the two choices.

### 4. 🚨 Global Emergency Safety Directory
* **Multi-National Contacts Database:** Fully-searchable index of emergency numbers (Ambulance, Police, Fire Services) in over 30 countries.
* **Direct Dial Actions:** Features mobile-responsive click-to-call links (`tel:`) for immediate response.

### 5. ⚙️ App Preferences & Converter
* **Persisted Dark & Light Modes:** Smooth css-variables transitions remembered via `localStorage`.
* **Meteorological Conversion Tool:** Instant Fahrenheit, Celsius, and Kelvin math converter integrated right into the panel.
* **Connection Status Watcher:** Dynamic ping-style observer tracking and alerting standard `online` / `offline` conditions.

---

## 📂 Project Architecture

```directory
app/
├── compare.html          # Side-by-side city comparison interface
├── emergency.html        # Safety numbers directory and search engine
├── index.html            # Main landing page & Live Weather dashboard
├── plan.html             # Trip Planner, risk calculator, and countdown page
├── css/
│   ├── base.css          # Global Design tokens, colors, glassmorphism templates
│   ├── compare.css       # Layout styles for side-by-side tables
│   ├── emergency.css     # Style sheet for contact cards and red emergency alerts
│   ├── hero.css          # Landing screen design with planetary rings
│   ├── loader.css        # Interactive spinner & progress indicator styles
│   ├── navbar.css        # Adaptive top navigation layout
│   ├── plan.css          # Form styling, sliders, and itinerary layout
│   ├── settings.css      # Sliding configuration drawer and conversion forms
│   └── weather.css       # Meteorological metrics card grid
└── js/
    ├── app.js            # Initializer matching links, loads status, hooks navigation
    ├── compare.js        # VS form metrics aggregator and travel verdict calculator
    ├── contact.js        # Fully-validated modern contact form submission
    ├── countdown.js      # Precision dates math & real-time ticker loop
    ├── emergency.js      # Emergency directory search and dynamic card rendering
    ├── loader.js         # Page transition controller with fake dynamic progress loading
    ├── map.js            # MapLibre GL controller for mapping layers
    ├── settings.js       # Toggle drawer, theme manager, and converter engine
    ├── trip-planner.js   # Trip styling algorithm, risk analyser, map coordinates router
    ├── utils.js          # Shared library: API configuration, conversion math, DOM selectors
    └── weather.js        # Core OpenWeather fetch layer & live statistics parsing
```

---

## 🛠️ Technical Stack & Integration APIs

* **Frontend Engine:** Semantic HTML5, CSS3 Custom Properties (Variables), Vanilla JavaScript (ES6+ Module Standard).
* **Mapping Library:** [MapLibre GL JS v4.1.2](https://maplibre.org/) (Vector maps rendering with zero tracking cookies).
* **Weather Service API:** [OpenWeatherMap 2.5 API](https://openweathermap.org/api) (Used for current weather data).
* **Geocoding Service API:** [Nominatim OpenStreetMap](https://nominatim.org/) (Free reverse geolocating utility).
* **Design Elements:** Plus Jakarta Sans typography, FontAwesome Icons.

---

## 🚀 Setting Up & Running Locally

Since the application uses standard ES6 JavaScript and dynamic browser storage, it runs smoothly inside modern browsers without heavy bundlers or build steps.

### Method 1: Local HTTP Server (Recommended)
Because some geocoding scripts and mapping files use standard HTTP requests, running under a local server is recommended.

1. Open your terminal in the `app/` folder.
2. Run any simple HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve -p 8000
   ```
3. Open `http://localhost:8000` in your web browser.

### Method 2: Open HTML File Directly
Simply double-click `index.html` on your desktop/finder to run immediately. Note: GPS features require an HTTPS connection or running on `localhost` (loopback address) to pass browser geolocation security.

---

## 🔑 Configuring Your Custom API Key

ClimateGuard comes pre-packaged with a demonstration API key in `js/utils.js`. To provision your own high-volume query limit:

1. Sign up for a free account on [OpenWeatherMap](https://openweathermap.org/).
2. Generate your unique API key in the member console.
3. Open [js/utils.js](file:///c:/Users/aryan/Desktop/app/js/utils.js) and locate the API token variable:
   ```javascript
   const API_KEY = 'YOUR_NEW_API_KEY';
   ```
4. Save the file and refresh the page to start querying!

---

## 💡 Developer Customizations

### Theme & Branding
You can modify the primary brand colors by adjusting the standard variables located inside [css/base.css](file:///c:/Users/aryan/Desktop/app/css/base.css):
```css
:root {
  --primary: #00f2fe;        /* Vivid brand accent color */
  --primary-rgb: 0, 242, 254;
  --bg-dark: #0a0f1d;        /* Main dark mode background */
  --glass-bg: rgba(255, 255, 255, 0.03); /* Glassmorphism background */
  --radius-lg: 16px;
}
```

### Extending the Emergency List
To add more countries or customize numbers, edit the core dataset array inside [js/emergency.js](file:///c:/Users/aryan/Desktop/app/js/emergency.js):
```javascript
const emergencyData = [
  {
    country: "India",
    police: "100",
    ambulance: "102",
    fire: "101",
    general: "112",
    info: "Supports direct dispatch systems in metropolitan areas."
  },
  // Add new country objects here...
];
```

---
This project is open-source . Build, edit, and travel safely!
## 📄 License
This project is open-source and available under the **MIT License**. Build, edit, and travel safely!
