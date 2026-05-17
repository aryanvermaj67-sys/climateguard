
'use strict';


const TRIP_ACTIVITIES = {
  leisure: ['🏖️ Beach relaxation', '🍽️ Local cuisine tour', '🛍️ Shopping district', '🌅 Sunset viewing', '🏛️ Museum visit'],
  business: ['💼 Conference center', '🤝 Networking event', '✈️ Airport transfer', '🏨 Hotel meetings', '📊 Business lunch'],
  adventure: ['🧗 Rock climbing', '🏕️ Camping trip', '🚵 Mountain biking', '🪂 Paragliding', '🤿 Snorkelling'],
  cultural: ['🏛️ Ancient ruins', '🎭 Local theatre', '🎨 Art galleries', '🍜 Street food tour', '🕌 Historic sites'],
  backpacking: ['🎒 Hostel check-in', '🗺️ City walk', '🚌 Local bus tour', '🧳 Market explore', '📸 Photography walk'],
};

const RISK_TIPS = {
  low: 'Great conditions for your trip! Pack light and enjoy the journey.',
  medium: 'Some weather variability expected. Bring a light jacket and check forecasts daily.',
  high: 'Challenging conditions possible. Pack weatherproof gear and monitor alerts.',
};




function initTripPlanner() {
  const { $, lsSet, lsGet, log, error } = window.CG;

  const form = $('tripForm');
  if (!form) return;

  const slider = $('tripRisk');
  const riskVal = $('riskVal');
  if (slider && riskVal) {
    slider.addEventListener('input', () => {
      riskVal.textContent = slider.value;
    });
  }


  const lastTrip = lsGet('cg_lastTrip');
  if (lastTrip) {
    restoreForm(lastTrip);
    log('Restored last trip from localStorage');
    
    // Fully rebuild plan on load if we have a destination
    if (lastTrip.destination && lastTrip.startDate && lastTrip.endDate) {
      window.startCountdown(lastTrip.startDate);
      buildTripPlan(
        lastTrip.destination, 
        lastTrip.startDate, 
        lastTrip.endDate, 
        lastTrip.style, 
        lastTrip.risk
      );
    }
  }

  // Live update countdown as user changes date
  const startDateInput = $('tripStart');
  if (startDateInput) {
    startDateInput.addEventListener('change', () => {
      const val = startDateInput.value;
      if (val && typeof window.startCountdown === 'function') {
        window.startCountdown(val);
      }
    });
  }


  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateTripForm()) return;

    const destination = $('tripDestination').value.trim();
    const startDate = $('tripStart').value;
    const endDate = $('tripEnd').value;
    const style = $('tripStyle').value;
    const budget = $('tripBudget').value;
    const risk = parseInt($('tripRisk').value, 10);

    lsSet('cg_lastTrip', { destination, startDate, endDate, style, budget, risk });

    window.startCountdown(startDate);

    await buildTripPlan(destination, startDate, endDate, style, risk);
  });
}


function validateTripForm() {
  const { $ } = window.CG;
  let valid = true;
  const setError = (fieldId, msg) => {
    const el = $(fieldId);
    if (el) el.textContent = msg;
    if (msg) valid = false;
  };

  const destination = $('tripDestination') ? $('tripDestination').value.trim() : '';
  const startDate = $('tripStart') ? $('tripStart').value : '';
  const endDate = $('tripEnd') ? $('tripEnd').value : '';


  setError('destError', destination ? '' : 'Please enter a destination.');

  if (!startDate) {

    console.warn('[CG] No start date entered');
    valid = false;
  }

  if (!endDate) {
    valid = false;
  }

  if (startDate && endDate && endDate < startDate) {
    console.warn('[CG] End date before start date');
    valid = false;
    alert('End date cannot be before start date!');
  }

  return valid;
}


async function buildTripPlan(destination, startDate, endDate, style, risk) {
  const { error, log, formatTemp, getWeatherEmoji, capitalise, showEl, $ } = window.CG;

  const genBtn = $('generatePlanBtn');
  if (genBtn) {
    genBtn.disabled = true;
    genBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Building your plan...';
  }

  try {

    const weatherData = await window.getWeatherData(destination);

    let coords = { lat: weatherData.coord.lat, lon: weatherData.coord.lon };

    renderDestWeather(weatherData);


    const riskResult = calculateRisk(weatherData, risk);
    renderRisk(riskResult);


    const days = getDayCount(startDate, endDate);
    const itinerary = generateItinerary(days, style, destination);
    renderItinerary(itinerary);


    try {
      const mLat = parseFloat(coords.lat);
      const mLon = parseFloat(coords.lon);
      if (!isNaN(mLat) && !isNaN(mLon)) {
        window.initPlanMap(mLat, mLon, destination);
      }
    } catch (mapErr) {
      error('Plan map failed:', mapErr.message);
    }

    log('Trip plan built for:', destination);

  } catch (err) {
    error('Plan build failed:', err.message);
    alert(`Could not find "${destination}". Please check the spelling and try again.`);
  } finally {

    if (genBtn) {
      genBtn.disabled = false;
      genBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Trip Plan';
    }
  }
}

function renderDestWeather(data) {
  const { $, showEl, formatTemp, capitalise, getWeatherEmoji } = window.CG;


  const { main: { temp, humidity }, weather: [{ description, id }], wind: { speed } } = data;

  const isDay = true;

  $('dwTemp').textContent = formatTemp(temp);
  $('dwIcon').textContent = getWeatherEmoji(id, isDay);
  $('dwDesc').textContent = capitalise(description);
  $('dwHum').textContent = `${humidity}%`;
  $('dwWind').textContent = `${Math.round(speed * 3.6)} km/h`;

  showEl($('destWeatherCard'), true);
}

function calculateRisk(weather, userRisk) {
  const { main: { temp, humidity }, weather: [{ id }], wind: { speed } } = weather;


  const riskFactors = [
    { condition: id >= 200 && id < 300, penalty: 4, label: 'Thunderstorm' },
    { condition: id >= 500 && id < 600, penalty: 3, label: 'Rain' },
    { condition: id >= 600 && id < 700, penalty: 3, label: 'Snow' },
    { condition: id >= 700 && id < 800, penalty: 2, label: 'Fog' },
    { condition: temp > 38, penalty: 2, label: 'Extreme heat' },
    { condition: temp < -5, penalty: 2, label: 'Extreme cold' },
    { condition: speed > 15, penalty: 2, label: 'High winds' },
    { condition: humidity > 90, penalty: 1, label: 'High humidity' },
  ];


  const activeFactors = riskFactors.filter(f => f.condition);

 
  const totalPenalty = activeFactors.reduce((acc, f) => acc + f.penalty, 0);


  const rawScore = Math.min(10, totalPenalty);
  const adjusted = Math.round(rawScore * (1 - (userRisk - 1) / 20));
  const score = Math.max(1, adjusted || 1);

  
  const level = score <= 3 ? 'Low Risk' : score <= 6 ? 'Moderate Risk' : 'High Risk';
  const tipKey = score <= 3 ? 'low' : score <= 6 ? 'medium' : 'high';
  const tip = RISK_TIPS[tipKey]; 

  return { score, level, tip, activeFactors }; 
}


function renderRisk({ score, level, tip, activeFactors }) {
  const { $, showEl } = window.CG;

  $('riskScore').textContent = score;
  $('riskLevel').textContent = level;
  $('riskTip').textContent = tip;

  const circle = $('riskCircle');
  if (circle) {
    const colour = score <= 3 ? 'var(--success)' : score <= 6 ? 'var(--warning)' : 'var(--danger)';
    circle.style.borderColor = colour;
    circle.style.background = `${colour}15`;
    $('riskScore').style.color = colour;
  }

  showEl($('riskCard'), true);
}




function getDayCount(start, end) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const diff = e - s; 
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}


function generateItinerary(days, style, destination) {
  
  const pool = TRIP_ACTIVITIES[style] || TRIP_ACTIVITIES.leisure;

 
  function buildDays(day, acc) {
    
    if (day > days) return acc;

    
    const activity = pool[(day - 1) % pool.length];

    return buildDays(day + 1, [...acc, `Day ${day}: ${activity} in ${destination}`]);
  }

  return buildDays(1, []); 
}


function renderItinerary(items) {
  const { $, createElement, showEl } = window.CG;
  const listEl = $('itineraryList');
  if (!listEl) return;

  listEl.innerHTML = ''; 

 
  items.map((item, index) => {
    const div = createElement('div', { className: 'itinerary-day' });
    
    div.innerHTML = `
      <div class="day-label">Day ${index + 1}</div>
      <p>${item.replace(/^Day \d+: /, '')}</p>`;
    return div;
  }).forEach(el => listEl.appendChild(el)); 

  showEl($('itineraryCard'), true);
}

function restoreForm(trip) {
  const { $ } = window.CG;
 
  const { destination, startDate, endDate, style, budget, risk } = trip;

  if ($('tripDestination') && destination) $('tripDestination').value = destination;
  if ($('tripStart') && startDate) $('tripStart').value = startDate;
  if ($('tripEnd') && endDate) $('tripEnd').value = endDate;
  if ($('tripStyle') && style) $('tripStyle').value = style;
  if ($('tripBudget') && budget) $('tripBudget').value = budget;
  if ($('tripRisk') && risk) $('tripRisk').value = risk;
  if ($('riskVal') && risk) $('riskVal').textContent = risk;
}


window.initTripPlanner = initTripPlanner;
