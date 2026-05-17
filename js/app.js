'use strict';
document.addEventListener('DOMContentLoaded', () => {
  console.log('[CG] DOM ready — ClimateGuard booting...');


  if (typeof window.initSettings === 'function') {
    window.initSettings();
  }

  
  const path = window.location.pathname; 


  console.log('[CG] Page:', path);
  console.log('[CG] Browser:', navigator.userAgent.split(' ').slice(-2).join(' ')); 
  console.log('[CG] Language:', navigator.language); 


  const isPage = (name) => path.includes(name) || path === '/' + name;

  if (isPage('plan.html')) {

    console.log('[CG] Initializing Plan page');
    if (typeof window.initTripPlanner === 'function') window.initTripPlanner();

  } else if (isPage('compare.html')) {
  
    console.log('[CG] Initializing Compare page');
    if (typeof window.initCompare === 'function') window.initCompare();

  } else if (isPage('emergency.html')) {

    console.log('[CG] Initializing Emergency page');
    if (typeof window.initEmergency === 'function') window.initEmergency();

  } else {

    console.log('[CG] Initializing Index page');
    if (typeof window.initWeather === 'function') window.initWeather();
    if (typeof window.initMap     === 'function') window.initMap();
    if (typeof window.initContact === 'function') window.initContact();
  }

  
  highlightActiveNav();


  initScrollEffects();

  console.log('[CG] Boot complete ✓');
});


function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-links a'); 
  const current = window.location.href;                    

  for (const link of links) {

    link.classList.remove('active');

    if (link.href && current.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  }
}

function initScrollEffects() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;


  window.addEventListener('scroll', () => {
   
    const scrolled = window.scrollY > 60;
    nav.style.boxShadow = scrolled
      ? '0 4px 30px rgba(0,0,0,0.4)'
      : 'none';
    nav.style.background = scrolled
      ? 'rgba(15, 20, 26, 0.95)'
      : 'rgba(15, 20, 26, 0.75)';
  });
}
