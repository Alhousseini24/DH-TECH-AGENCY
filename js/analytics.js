/* ============================================================
   DH TECH AGENCY — Analytics & Conversion tracking
   Cahier des charges §70 — Événements de conversion
   Collez votre identifiant Google Analytics dans la config.
   Ce fichier est chargé en defer sur toutes les pages.
   ============================================================ */
(function () {
  'use strict';

  var config = {
    gaPropertyId: 'G-XXXXXXXXXX' // Remplacez par votre ID GA4
  };

  /* ---------- Initialisation GA4 (si le snippet n'est pas en place) ---------- */
  function loadGA() {
    if (typeof gtag !== 'function' && config.gaPropertyId && config.gaPropertyId.indexOf('XXXX') === -1) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.gaPropertyId;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', config.gaPropertyId, { 'anonymize_ip': true });
    }
  }

  /* ---------- Helper pour envoyer un événement GA4 ---------- */
  function track(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params || {});
    }
    // Fallback console
    if (window.DEBUG_ANALYTICS) {
      console.log('[Analytics]', name, params || '');
    }
  }

  /* ---------- Écouteurs globaux (délégation, robuste) ---------- */
  function init() {
    loadGA();

    // Clics WhatsApp (bouton flottant, footer, CTA)
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('a[data-track="whatsapp"], a[href*="wa.me"]') : null;
      if (el) track('click_whatsapp', { url: el.href });
    });

    // Clics téléphone
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('click_phone', { number: el.getAttribute('href') });
      });
    });

    // Clics email
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('click_email', { to: el.getAttribute('href') });
      });
    });

    // Formulaires soumis (data-track-form)
    document.querySelectorAll('form[data-track-form]').forEach(function (form) {
      form.addEventListener('submit', function () {
        track('form_submit', { form: form.getAttribute('data-track-form') });
      });
    });

    // Demandes de devis
    document.querySelectorAll('[data-track="quote"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('quote_request');
      });
    });

    // Rendez-vous
    document.querySelectorAll('[data-track="booking"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('booking_request');
      });
    });

    // Newsletter
    document.querySelectorAll('[data-track="newsletter"]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('newsletter_signup');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
