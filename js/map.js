'use strict';

const ZOOM_CITY = 12;
const ZOOM_DEST = 11;

let mainMap = null;
let planMap = null;

function buildStyleUrl() {
  return 'https://tiles.openfreemap.org/styles/liberty';
}

function destroyMap(mapRef) {
  try {
    if (mapRef) {
      mapRef.remove();
    }
  } catch (err) {
    console.error('[CG] Error destroying map:', err);
  }
  return null;
}

function renderWeatherMap(lat, lon, cityName) {
  lat = parseFloat(lat);
  lon = parseFloat(lon);
  if (isNaN(lat) || isNaN(lon)) return;

  const container = document.getElementById('mainMapFrame');
  if (!container) return;

  container.style.display = 'block';
  container.style.height = '400px'; 

  mainMap = destroyMap(mainMap);

  try {
    mainMap = new maplibregl.Map({
      container: 'mainMapFrame',
      style: buildStyleUrl(),
      center: [lon, lat],
      zoom: ZOOM_CITY,
      attributionControl: false,
    });

    mainMap.addControl(new maplibregl.NavigationControl({
      showCompass: false
    }), 'top-right');
    mainMap.addControl(new maplibregl.AttributionControl({
      compact: true
    }), 'bottom-right');

    new maplibregl.Marker({
        color: '#1dd1a1'
      })
      .setLngLat([lon, lat])
      .setPopup(new maplibregl.Popup({
        offset: 25
      }).setText(cityName))
      .addTo(mainMap);

    console.log(`[CG] MapLibre map → ${cityName} [${lat}, ${lon}]`);
  } catch (err) {
    console.error('[CG] MapLibre failed:', err);
    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:14px;gap:8px;background:rgba(0,0,0,0.05);border-radius:20px;">
      <i class="fa-solid fa-map-location-dot"></i> Map unavailable
    </div>`;
  }
}

function initPlanMap(lat, lon, cityName) {
  lat = parseFloat(lat);
  lon = parseFloat(lon);
  if (isNaN(lat) || isNaN(lon)) return;

  const mapCard = document.getElementById('destMapCard');
  const container = document.getElementById('planMapFrame');
  if (!container) return;

  if (mapCard) mapCard.style.display = 'block';
  container.style.height = '300px';

  planMap = destroyMap(planMap);

  try {
    planMap = new maplibregl.Map({
      container: 'planMapFrame',
      style: buildStyleUrl(),
      center: [lon, lat],
      zoom: ZOOM_DEST,
      attributionControl: false,
    });

    planMap.addControl(new maplibregl.NavigationControl({
      showCompass: false
    }), 'top-right');
    planMap.addControl(new maplibregl.AttributionControl({
      compact: true
    }), 'bottom-right');

    new maplibregl.Marker({
        color: '#1dd1a1'
      })
      .setLngLat([lon, lat])
      .setPopup(new maplibregl.Popup({
        offset: 25
      }).setText(cityName))
      .addTo(planMap);

    console.log(`[CG] MapLibre plan map → ${cityName}`);
  } catch (err) {
    console.error('[CG] Plan MapLibre failed:', err);
  }
}

async function geocodeCity(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
  );
  if (!res.ok) throw new Error('Geocoding failed');
  const results = await res.json();
  if (!results.length) throw new Error(`City not found: ${city}`);
  const [{
    lat,
    lon
  }] = results;
  return {
    lat: parseFloat(lat),
    lon: parseFloat(lon)
  };
}

window.renderWeatherMap = renderWeatherMap;
window.initPlanMap = initPlanMap;
window.geocodeCity = geocodeCity;
