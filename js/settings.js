

'use strict';


function initSettings() {
  const { $, $q, lsSet, lsGet, convertTemperature, log, warn } = window.CG;

  const settingsBtn     = $('settingsBtn');
  const settingsPanel   = $('settingsPanel');
  const settingsOverlay = $('settingsOverlay');
  const settingsClose   = $('settingsClose');
  const themeToggle     = $('themeToggle');
  const btnCelsius      = $('btnCelsius');
  const btnFahrenheit   = $('btnFahrenheit');
  const convertInput    = $('convertInput');
  const convertFrom     = $('convertFrom');
  const convertTo       = $('convertTo');
  const convertBtn      = $('convertBtn');
  const convertResult   = $('convertResult');
  const statusDot       = $('statusDot');
  const statusText      = $('statusText');
  const networkStatus   = $('networkStatus');

  if (!settingsBtn) return; 


  const savedTheme = lsGet('cg_theme', 'dark');   
  const savedUnit  = lsGet('cg_unit',  'C');      

  applyTheme(savedTheme);
  if (themeToggle) themeToggle.checked = (savedTheme === 'dark');

  setActiveUnit(savedUnit);



  settingsBtn.addEventListener('click', () => openSettings());
  settingsClose.addEventListener('click', () => closeSettings());
  settingsOverlay.addEventListener('click', () => closeSettings());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });

  function openSettings() {
    settingsPanel.classList.add('open');      
    settingsOverlay.classList.add('active');  
    document.body.style.overflow = 'hidden';  
  }


  function closeSettings() {
    settingsPanel.classList.remove('open');
    settingsOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      
      const theme = themeToggle.checked ? 'dark' : 'light';
      applyTheme(theme);
      lsSet('cg_theme', theme); 
    });
  }


  function applyTheme(theme) {

    document.documentElement.setAttribute('data-theme', theme);
    log('Theme set to:', theme);
  }



  const unitToggle = $('unitToggle');
  if (unitToggle) {
    
    unitToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.unit-btn');
      if (!btn) return;

      const unit = btn.dataset.unit; 
      setActiveUnit(unit);
      lsSet('cg_unit', unit);


      window.dispatchEvent(new CustomEvent('cg:unitChanged', { detail: { unit } }));
    });
  }

 
  function setActiveUnit(unit) {
  
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
  }


  if (convertBtn) {
    convertBtn.addEventListener('click', handleConvert);
  }

  if (convertInput) {
    convertInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleConvert();
    });
  }

  function handleConvert() {
    const raw   = parseFloat(convertInput ? convertInput.value : '');
    const from  = convertFrom ? convertFrom.value : 'C';
    const to    = convertTo   ? convertTo.value   : 'F';

    
    if (isNaN(raw)) {
      if (convertResult) convertResult.textContent = '⚠️ Enter a valid number';
      return;
    }

    const result = convertTemperature(raw, from, to);
    if (convertResult) {
   
      convertResult.textContent = `${raw}° ${from}  =  ${result.toFixed(2)}° ${to}`;
    }
    log(`Converted: ${raw}°${from} → ${result.toFixed(2)}°${to}`);
  }


  function updateOnlineStatus() {
  
    const online = navigator.onLine; 

    if (statusDot)  statusDot.classList.toggle('offline', !online);
    if (statusText) statusText.textContent = online ? 'Online' : 'Offline';

   
    if (networkStatus) {
      networkStatus.textContent = online ? 'Connected' : 'No Connection';
      networkStatus.classList.toggle('offline', !online);
    }

   
    if (online) {
      console.log('[CG] Network: Online ✓');
    } else {
      console.warn('[CG] Network: Offline ✗');
    }
  }


  updateOnlineStatus();


  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  log('Settings module initialized');
}

window.initSettings = initSettings;
