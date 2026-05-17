

'use strict';


(function initLoader() {
  const { $ } = window.CG; 

  const loaderEl   = $('loader');
  const progressEl = $('progressBar');
  const textEl     = $('loaderText');

  if (!loaderEl) return;

 
  const messages = [
    'Initializing systems...',
    'Loading climate data...',
    'Calibrating sensors...',
    'Almost ready...',
  ];

  let progress   = 0;     
  let msgIndex   = 0;      
  let done       = false;  

 
  const interval = setInterval(() => {
    if (done) return;

    
    const increment = progress < 70 ? 4 : 1;
    progress = Math.min(progress + increment, 95);

    
    if (progressEl) progressEl.style.width = progress + '%';

    
    if (progress % 25 === 0 && textEl && msgIndex < messages.length - 1) {
      msgIndex++;
      textEl.textContent = messages[msgIndex]; 
    }
  }, 60);


  window.addEventListener('load', () => {
    done = true;
    clearInterval(interval);

    if (progressEl) progressEl.style.width = '100%';
    if (textEl)     textEl.textContent = 'Ready!';

   
    setTimeout(() => {
      if (loaderEl) {
        loaderEl.classList.add('hidden'); 
      }
    }, 400);
  });


  setTimeout(() => {
    if (!done) {
      done = true;
      clearInterval(interval);
      if (loaderEl) loaderEl.classList.add('hidden');
    }
  }, 4000);
})();
