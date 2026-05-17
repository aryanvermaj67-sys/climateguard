
'use strict';

const EMERGENCY_DATA = [
  { country: 'India',          flag: '🇮🇳', dialCode: '+91', police: '100', fire: '101', medical: '108', general: '112' },
  { country: 'United States',  flag: '🇺🇸', dialCode: '+1',  police: '911', fire: '911', medical: '911', general: '911' },
  { country: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', police: '999', fire: '999', medical: '999', general: '112' },
  { country: 'Australia',      flag: '🇦🇺', dialCode: '+61', police: '000', fire: '000', medical: '000', general: '000' },
  { country: 'Canada',         flag: '🇨🇦', dialCode: '+1',  police: '911', fire: '911', medical: '911', general: '911' },
  { country: 'Germany',        flag: '🇩🇪', dialCode: '+49', police: '110', fire: '112', medical: '112', general: '112' },
  { country: 'France',         flag: '🇫🇷', dialCode: '+33', police: '17',  fire: '18',  medical: '15',  general: '112' },
  { country: 'Japan',          flag: '🇯🇵', dialCode: '+81', police: '110', fire: '119', medical: '119', general: '110' },
  { country: 'China',          flag: '🇨🇳', dialCode: '+86', police: '110', fire: '119', medical: '120', general: '110' },
  { country: 'Brazil',         flag: '🇧🇷', dialCode: '+55', police: '190', fire: '193', medical: '192', general: '190' },
  { country: 'Russia',         flag: '🇷🇺', dialCode: '+7',  police: '102', fire: '101', medical: '103', general: '112' },
  { country: 'South Africa',   flag: '🇿🇦', dialCode: '+27', police: '10111', fire: '10111', medical: '10177', general: '112' },
  { country: 'UAE',            flag: '🇦🇪', dialCode: '+971', police: '999', fire: '997', medical: '998', general: '999' },
  { country: 'Saudi Arabia',   flag: '🇸🇦', dialCode: '+966', police: '999', fire: '998', medical: '997', general: '911' },
  { country: 'Pakistan',       flag: '🇵🇰', dialCode: '+92', police: '15',  fire: '16',  medical: '115', general: '1122' },
  { country: 'Italy',          flag: '🇮🇹', dialCode: '+39', police: '113', fire: '115', medical: '118', general: '112' },
  { country: 'Spain',          flag: '🇪🇸', dialCode: '+34', police: '091', fire: '080', medical: '061', general: '112' },
  { country: 'Mexico',         flag: '🇲🇽', dialCode: '+52', police: '060', fire: '068', medical: '065', general: '911' },
  { country: 'South Korea',    flag: '🇰🇷', dialCode: '+82', police: '112', fire: '119', medical: '119', general: '119' },
  { country: 'Turkey',         flag: '🇹🇷', dialCode: '+90', police: '155', fire: '110', medical: '112', general: '112' },
  { country: 'Indonesia',      flag: '🇮🇩', dialCode: '+62', police: '110', fire: '113', medical: '118', general: '112' },
  { country: 'Netherlands',    flag: '🇳🇱', dialCode: '+31', police: '0900', fire: '112', medical: '112', general: '112' },
  { country: 'Singapore',      flag: '🇸🇬', dialCode: '+65', police: '999', fire: '995', medical: '995', general: '999' },
  { country: 'New Zealand',    flag: '🇳🇿', dialCode: '+64', police: '111', fire: '111', medical: '111', general: '111' },
  { country: 'Sweden',         flag: '🇸🇪', dialCode: '+46', police: '112', fire: '112', medical: '112', general: '112' },
  { country: 'Nigeria',        flag: '🇳🇬', dialCode: '+234', police: '199', fire: '199', medical: '199', general: '112' },
  { country: 'Egypt',          flag: '🇪🇬', dialCode: '+20', police: '122', fire: '180', medical: '123', general: '123' },
  { country: 'Argentina',      flag: '🇦🇷', dialCode: '+54', police: '101', fire: '100', medical: '107', general: '911' },
  { country: 'Thailand',       flag: '🇹🇭', dialCode: '+66', police: '191', fire: '199', medical: '1669', general: '191' },
  { country: 'Malaysia',       flag: '🇲🇾', dialCode: '+60', police: '999', fire: '994', medical: '999', general: '999' },
];

function initEmergency() {
  const { $, log } = window.CG;

  const gridEl   = $('emergencyGrid');
  const searchEl = $('countrySearch');
  if (!gridEl) return;

  renderGrid(EMERGENCY_DATA);


  if (searchEl) {
    searchEl.addEventListener('input', () => {
      const query = searchEl.value.trim().toLowerCase(); 
      filterAndRender(query);
    });
  }

  log('Emergency module initialized:', EMERGENCY_DATA.length, 'countries loaded');

  console.log('[CG] Emergency data sample:');
  console.table(EMERGENCY_DATA.slice(0, 3));
}


function filterAndRender(query) {
  const { $ } = window.CG;
  const noResults = $('noResults');

  if (!query) {
    renderGrid(EMERGENCY_DATA);
    if (noResults) noResults.style.display = 'none';
    return;
  }

  const filtered = EMERGENCY_DATA.filter(entry =>
    entry.country.toLowerCase().includes(query) ||    
    entry.dialCode.includes(query)                    
  );

  if (filtered.length === 0) {
    renderGrid([]);
    if (noResults) noResults.style.display = ''; 
  } else {
    renderGrid(filtered);
    if (noResults) noResults.style.display = 'none';
  }
}


function renderGrid(data) {
  const { $, createElement } = window.CG;
  const gridEl = $('emergencyGrid');
  if (!gridEl) return;


  gridEl.innerHTML = '';

  if (!data.length) return;

  const cards = data.map(entry => createCountryCard(entry));


  cards.forEach(card => gridEl.appendChild(card)); 
}


function createCountryCard(entry) {
 
  const { country, flag, dialCode, police, fire, medical, general } = entry;

  
  const card = document.createElement('div');
  card.className = 'country-card';

  const numberRows = [
    { type: 'Police',   icon: 'fa-shield-halved emergency-icon-police',  num: police  },
    { type: 'Fire',     icon: 'fa-fire         emergency-icon-fire',     num: fire    },
    { type: 'Medical',  icon: 'fa-kit-medical   emergency-icon-medical',  num: medical },
    { type: 'General',  icon: 'fa-phone         emergency-icon-general',  num: general },
  ];


  const validRows = numberRows.filter(r => r.num !== undefined && r.num !== null);


  const rowsHTML = validRows
    .map(r => `
      <div class="number-row">
        <span class="number-type">
          <i class="fa-solid ${r.icon}"></i>
          ${r.type}
        </span>
        <span class="number-value">${r.num}</span>
      </div>`)
    .join('');


  card.innerHTML = `
    <div class="country-header">
      <span class="country-flag">${flag}</span>
      <div>
        <div class="country-name">${country}</div>
        <div class="country-code">${dialCode}</div>
      </div>
    </div>
    <div class="country-numbers">
      ${rowsHTML}
    </div>`;

  return card;
}


window.initEmergency = initEmergency;
