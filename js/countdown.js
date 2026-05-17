'use strict';


let countdownInterval = null;

function startCountdown(targetDateStr) {
  const { $ } = window.CG;

  const cdCard  = $('countdownCard');
  const cdDays  = $('cdDays');
  const cdHours = $('cdHours');
  const cdMins  = $('cdMins');
  const cdSecs  = $('cdSecs');
  const cdLabel = $('cdLabel');

  if (!cdCard || !cdDays) return; 


  cdCard.style.display = '';

  if (countdownInterval) clearInterval(countdownInterval);


  const targetDate = new Date(targetDateStr + 'T00:00:00');
  if (isNaN(targetDate.getTime())) return;

  const tick = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      cdDays.textContent  = '00';
      cdHours.textContent = '00';
      cdMins.textContent  = '00';
      cdSecs.textContent  = '00';

      const isSameDay = now.getFullYear() === targetDate.getFullYear() &&
                        now.getMonth() === targetDate.getMonth() &&
                        now.getDate() === targetDate.getDate();

      if (isSameDay) {
        if (cdLabel) cdLabel.textContent = '🌍 Your trip starts today!';
      } else {
        stopCountdown();
        if (cdLabel) cdLabel.textContent = '🎉 Your trip has begun!';
      }
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days      = Math.floor(totalSecs / 86400);
    const hours     = Math.floor((totalSecs % 86400) / 3600);
    const mins      = Math.floor((totalSecs % 3600) / 60);
    const secs      = totalSecs % 60;

    cdDays.textContent  = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent  = String(mins).padStart(2, '0');
    cdSecs.textContent  = String(secs).padStart(2, '0');

    if (cdLabel) {
      if (days > 0) {
        cdLabel.textContent = `Your adventure awaits!`;
      } else {
        cdLabel.textContent = `Starts in less than 24 hours!`;
      }
    }
  };

  tick();
  countdownInterval = setInterval(tick, 1000);

  console.log(`[CG] Countdown started for: ${targetDateStr}`);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval); 
    countdownInterval = null;
  }
}


window.startCountdown = startCountdown;
window.stopCountdown  = stopCountdown;
