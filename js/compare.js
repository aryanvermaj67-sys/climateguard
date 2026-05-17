'use strict';


function initCompare() {
  const { $, log, error } = window.CG;

  const compareBtn = $('compareBtn');
  if (!compareBtn) return;

  compareBtn.addEventListener('click', async () => {
    const city1 = $('city1Input') ? $('city1Input').value.trim() : '';
    const city2 = $('city2Input') ? $('city2Input').value.trim() : '';


    if (!city1 || !city2) {
      showCompareError('Please enter both city names to compare.');
      return;
    }

    if (city1.toLowerCase() === city2.toLowerCase()) {
      showCompareError('Please enter two different cities.');
      return;
    }

    await performComparison(city1, city2);
  });


  ['city1Input', 'city2Input'].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') compareBtn.click();
      });
    }
  });
}


async function performComparison(city1, city2) {
  const { $, showEl, error } = window.CG;

  const btn = $('compareBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Comparing...';
  }

  hideCompareError();

  try {

    const [data1, data2] = await Promise.all([
      window.getWeatherData(city1),
      window.getWeatherData(city2),
    ]);


    renderCityCard(data1, 1);
    renderCityCard(data2, 2);


    buildComparisonTable(data1, data2);


    const results = $('compareResults');
    if (results) showEl(results, true);


    const tableData = buildTableData(data1, data2);
    console.table(tableData);
  } catch (err) {
    error('Comparison failed:', err.message);
    showCompareError(`Could not fetch data: ${err.message}. Check city names and try again.`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-magnifying-glass-chart"></i> Compare Now';
    }
  }
}


function renderCityCard(data, num) {
  const { $, formatTemp, capitalise, getWeatherEmoji, createElement } = window.CG;


  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    weather: [{ description, id }],
    wind: { speed },
    visibility,
  } = data;

  const header = $(`cityHeader${num}`);
  if (header) header.textContent = `${name}, ${country}`;

  const th = $(`th${num}`);
  if (th) th.textContent = `${name}`;

  const tempEl = $(`cityTemp${num}`);
  if (tempEl) tempEl.textContent = formatTemp(temp);

  const iconEl = $(`cityIcon${num}`);
  if (iconEl) iconEl.textContent = getWeatherEmoji(id, true);

  const descEl = $(`cityDesc${num}`);
  if (descEl) descEl.textContent = capitalise(description);


  const detailsEl = $(`cityDetails${num}`);
  if (detailsEl) {
    const details = [
      { icon: 'fa-droplet', label: 'Humidity', value: `${humidity}%` },
      { icon: 'fa-wind', label: 'Wind Speed', value: `${Math.round(speed * 3.6)} km/h` },
      { icon: 'fa-gauge', label: 'Pressure', value: `${pressure} hPa` },
      { icon: 'fa-temperature-low', label: 'Feels Like', value: formatTemp(feels_like) },
      { icon: 'fa-eye', label: 'Visibility', value: visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A' },
    ];


    detailsEl.innerHTML = details
      .map(d => `
        <div class="city-detail-row">
          <span><i class="fa-solid ${d.icon}"></i>${d.label}</span>
          <span>${d.value}</span>
        </div>`)
      .join('');
  }
}


function buildComparisonTable(d1, d2) {
  const { $, formatTemp } = window.CG;
  const tbody = $('compareTableBody');
  if (!tbody) return;

  const metrics = [
    {
      label: '🌡️ Temperature',
      icon: 'fa-temperature-half',
      v1: d1.main.temp,
      v2: d2.main.temp,
      fmt: (v) => formatTemp(v),

      better: 'neither',
    },
    {
      label: '💧 Humidity',
      icon: 'fa-droplet',
      v1: d1.main.humidity,
      v2: d2.main.humidity,
      fmt: (v) => `${v}%`,
      better: 'lower',
    },
    {
      label: '💨 Wind Speed',
      icon: 'fa-wind',
      v1: d1.wind.speed,
      v2: d2.wind.speed,
      fmt: (v) => `${Math.round(v * 3.6)} km/h`,
      better: 'lower',
    },
    {
      label: '🌡️ Feels Like',
      icon: 'fa-thermometer-half',
      v1: d1.main.feels_like,
      v2: d2.main.feels_like,
      fmt: (v) => formatTemp(v),
      better: 'neither',
    },
    {
      label: '📊 Pressure',
      icon: 'fa-gauge',
      v1: d1.main.pressure,
      v2: d2.main.pressure,
      fmt: (v) => `${v} hPa`,
      better: 'neither',
    },
    {
      label: '👁️ Visibility',
      icon: 'fa-eye',
      v1: d1.visibility || 0,
      v2: d2.visibility || 0,
      fmt: (v) => `${(v / 1000).toFixed(1)} km`,
      better: 'higher',
    },
  ];


  let city1Wins = 0;
  let city2Wins = 0;
  let rows = '';

  for (const m of metrics) {

    let c1class = '';
    let c2class = '';

    if (m.better === 'lower') {
      if (m.v1 < m.v2) { c1class = 'winner'; city1Wins++; }
      else if (m.v2 < m.v1) { c2class = 'winner'; city2Wins++; }
    } else if (m.better === 'higher') {
      if (m.v1 > m.v2) { c1class = 'winner'; city1Wins++; }
      else if (m.v2 > m.v1) { c2class = 'winner'; city2Wins++; }
    }


    rows += `
      <tr>
        <td><i class="fa-solid ${m.icon}"></i> ${m.label}</td>
        <td class="${c1class}">${m.fmt(m.v1)}</td>
        <td class="${c2class}">${m.fmt(m.v2)}</td>
      </tr>`;
  }

  tbody.innerHTML = rows;

  renderVerdict(d1.name, d2.name, city1Wins, city2Wins);
}



function buildTableData(d1, d2) {
  return [
    { Metric: 'Temperature', [d1.name]: `${d1.main.temp}°C`, [d2.name]: `${d2.main.temp}°C` },
    { Metric: 'Humidity', [d1.name]: `${d1.main.humidity}%`, [d2.name]: `${d2.main.humidity}%` },
    { Metric: 'Wind Speed', [d1.name]: `${d1.wind.speed} m/s`, [d2.name]: `${d2.wind.speed} m/s` },
  ];
}


function renderVerdict(city1, city2, wins1, wins2) {
  const { $ } = window.CG;
  const box = $('verdictBox');
  if (!box) return;


  const verdict = wins1 > wins2
    ? `<strong>${city1}</strong> has better overall conditions for travel! 🏆`
    : wins2 > wins1
      ? `<strong>${city2}</strong> has better overall conditions for travel! 🏆`
      : `Both cities are <strong>equally matched</strong> in conditions! 🤝`;

  box.innerHTML = `⚖️ Verdict: ${verdict}`;
}


function showCompareError(msg) {
  const { $, showEl } = window.CG;
  const el = $('compareError');
  if (el) { el.textContent = msg; showEl(el, true); }
}

function hideCompareError() {
  const { $, showEl } = window.CG;
  const el = $('compareError');
  if (el) showEl(el, false);
}

window.initCompare = initCompare;
