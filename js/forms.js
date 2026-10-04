/* ============================================================
   DH TECH AGENCY — Forms handling (accessibilité + anti-spam)
   Validation native, messages d'erreur ARIA, honeypot.
   ============================================================ */
(function () {
  'use strict';

  function handleForm(formId, trackingEvent) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Honeypot anti-spam (champ caché rempli par les robots)
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.cssText =
      'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
    form.appendChild(honeypot);

    // Zone d'annonce pour les lecteurs d'écran
    let liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    liveRegion.className = 'sr-only visually-hidden';
    form.appendChild(liveRegion);

    function announce(message) {
      liveRegion.textContent = message;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Si le honeypot est rempli -> robot, on simule un succès sans traiter
      if (honeypot.value) {
        announce('Votre message a bien été envoyé.');
        form.reset();
        return;
      }

      // Validation native avec messages personnalisés en français
      if (!form.checkValidity()) {
        form.reportValidity();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid && firstInvalid.focus && firstInvalid.setAttribute) {
          firstInvalid.focus();
          firstInvalid.setAttribute('aria-invalid', 'true');
        }
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : '';

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Envoi en cours...';
      }
      announce('Envoi en cours...');

      // Simulate submission (replace with real endpoint / email service)
      setTimeout(function () {
        // Track event
        if (window.gtag) {
          window.gtag('event', trackingEvent);
        }

        // Show success message
        const success = document.createElement('div');
        success.className = 'alert alert-success mt-3';
        success.setAttribute('role', 'status');
        success.textContent = 'Merci ! Votre demande a bien été envoyée. Notre équipe vous répondra sous 48h.';

        form.appendChild(success);
        form.reset();
        announce('Votre demande a bien été envoyée.');

        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }

        // Retirer le message de succès après quelques secondes
        setTimeout(function () {
          if (success.parentNode) success.parentNode.removeChild(success);
        }, 8000);
      }, 1200);
    });
  }

  // Libérer les attributs aria-invalid quand l'utilisateur corrige le champ
  document.addEventListener('input', function (e) {
    if (e.target.matches && e.target.matches('.form-control')) {
      if (e.target.checkValidity && e.target.checkValidity()) {
        e.target.removeAttribute('aria-invalid');
      }
    }
  });

  handleForm('contact-form', 'form_submit');
  handleForm('devis-form', 'quote_request');
  handleForm('rdv-form', 'booking_request');
})();
