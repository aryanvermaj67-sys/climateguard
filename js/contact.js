
'use strict';

function initContact() {
  const { $ } = window.CG;

  const form = $('contactFormEl');
  if (!form) return; 

  form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const name    = $('contactName')  ? $('contactName').value.trim()  : '';
    const email   = $('contactEmail') ? $('contactEmail').value.trim() : '';
    const message = $('contactMsg')   ? $('contactMsg').value.trim()   : '';

    
    clearErrors();

    let valid = true; 
 
    if (!name) {
      showFieldError('nameError', 'Name is required.');
      valid = false;
    } else if (name.length < 2) {
      showFieldError('nameError', 'Name must be at least 2 characters.');
      valid = false;
    }

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showFieldError('emailError', 'Email is required.');
      valid = false;
    } else if (!emailRegex.test(email)) { 
      showFieldError('emailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message) {
      showFieldError('msgError', 'Message cannot be empty.');
      valid = false;
    } else if (message.length < 10) {
      showFieldError('msgError', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    const successEl = $('formSuccess');
    if (successEl) {
      successEl.style.display = ''; 
    }
    form.reset(); 
    setTimeout(() => {
      if (successEl) successEl.style.display = 'none';
    }, 4000);

    console.log('[CG] Contact form submitted:', { name, email, message });
  });
}


function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}


function clearErrors() {

  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
  });
}

window.initContact = initContact;
