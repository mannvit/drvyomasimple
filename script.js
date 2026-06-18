/* ==========================================================================
   Dr. Vyoma Dermatology Clinic — Main Script
   Premium, production-quality JS with full feature set.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---------- Utility: Debounce ---------- */
  function debounce(fn, delay = 16) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* =======================================================================
     1. PAGE LOADER — Hide immediately or after load
     ======================================================================= */
  const pageLoader = document.getElementById('pageLoader');

  function hideLoader() {
    if (pageLoader && !pageLoader._hidden) {
      pageLoader._hidden = true;
      pageLoader.classList.add('hidden');
      setTimeout(() => { pageLoader.style.display = 'none'; }, 600);
    }
  }

  // Hide on window load
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
  // Safety fallback — always hide after 2.5 seconds max
  setTimeout(hideLoader, 2500);

  /* =======================================================================
     2. OFFER BANNER DISMISS
     ======================================================================= */
  const offerBanner = document.querySelector('.offer-banner');
  const offerClose  = document.querySelector('.offer-close');
  const navbar      = document.querySelector('.navbar');

  if (offerBanner && sessionStorage.getItem('offerDismissed')) {
    offerBanner.style.display = 'none';
    if (navbar) navbar.classList.remove('banner-open');
  }

  if (offerClose && offerBanner) {
    offerClose.addEventListener('click', () => {
      offerBanner.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease';
      offerBanner.style.maxHeight  = offerBanner.scrollHeight + 'px';
      offerBanner.offsetHeight; // force reflow
      offerBanner.style.maxHeight = '0';
      offerBanner.style.opacity   = '0';
      offerBanner.style.padding   = '0';
      offerBanner.style.overflow  = 'hidden';

      if (navbar) navbar.classList.remove('banner-open');

      setTimeout(() => { offerBanner.style.display = 'none'; }, 400);
      sessionStorage.setItem('offerDismissed', 'true');
    });
  }

  /* =======================================================================
     3. STICKY NAVBAR
     ======================================================================= */
  function handleNavbarScroll() {
    if (!navbar) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', debounce(handleNavbarScroll, 10), { passive: true });
  handleNavbarScroll();

  /* =======================================================================
     4. MOBILE MENU TOGGLE
     ======================================================================= */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* =======================================================================
     5. SMOOTH SCROLLING
     ======================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      if (hamburger) hamburger.classList.remove('active');
      if (mobileMenu) mobileMenu.classList.remove('active');
      document.body.style.overflow = '';

      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =======================================================================
     6. ACTIVE NAV LINK ON SCROLL
     ======================================================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));

  /* =======================================================================
     7. SCROLL ANIMATIONS (Intersection Observer)
     ======================================================================= */
  const animElements = document.querySelectorAll('.animate-on-scroll');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add('visible');
        animObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  animElements.forEach(el => animObserver.observe(el));

  /* =======================================================================
     8. ANIMATED COUNTERS
     ======================================================================= */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el._counted) return;
        el._counted = true;

        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + '+';
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* =======================================================================
     9. BEFORE/AFTER SLIDER
     ======================================================================= */
  const slideData = [
    { label: 'Acne Treatment → Clear Skin', desc: 'Significant improvement in acne and skin texture after 12 weeks of personalized treatment.' },
    { label: 'Pigmentation → Even Tone', desc: 'Visible reduction in pigmentation and dark spots with advanced laser therapy.' },
    { label: 'Dull Skin → Radiant Glow', desc: 'Complete skin rejuvenation with our premium chemical peel treatment.' },
  ];

  let baIndex = 0;
  const baLabel  = document.getElementById('baLabel');
  const baDesc   = document.getElementById('baDescription');
  const baPrev   = document.getElementById('baPrev');
  const baNext   = document.getElementById('baNext');
  const baDots   = document.querySelectorAll('.slider-dot');
  const baSlider = document.getElementById('baSlider');

  function updateBA(index) {
    baIndex = ((index % slideData.length) + slideData.length) % slideData.length;
    if (baSlider) {
      baSlider.style.opacity = '0';
      setTimeout(() => {
        if (baLabel) baLabel.textContent = slideData[baIndex].label;
        if (baDesc)  baDesc.textContent  = slideData[baIndex].desc;
        baSlider.style.opacity = '1';
      }, 250);
    }
    baDots.forEach((dot, i) => dot.classList.toggle('active', i === baIndex));
  }

  if (baPrev) baPrev.addEventListener('click', () => updateBA(baIndex - 1));
  if (baNext) baNext.addEventListener('click', () => updateBA(baIndex + 1));
  baDots.forEach(dot => {
    dot.addEventListener('click', () => updateBA(parseInt(dot.dataset.index, 10)));
  });

  /* =======================================================================
     10. TESTIMONIALS CAROUSEL
     ======================================================================= */
  let testIndex = 0;
  let testAutoplay;
  const testTrack = document.getElementById('testimonialTrack');
  const testPrev  = document.getElementById('testPrev');
  const testNext  = document.getElementById('testNext');
  const testDots  = document.querySelectorAll('.test-dot');
  const testCards = testTrack ? testTrack.children.length : 0;
  const carousel  = document.getElementById('testimonialCarousel');

  function updateTest(index) {
    testIndex = ((index % testCards) + testCards) % testCards;
    if (testTrack) testTrack.style.transform = `translateX(-${testIndex * 100}%)`;
    testDots.forEach((dot, i) => dot.classList.toggle('active', i === testIndex));
  }

  if (testPrev) testPrev.addEventListener('click', () => updateTest(testIndex - 1));
  if (testNext) testNext.addEventListener('click', () => updateTest(testIndex + 1));
  testDots.forEach(dot => {
    dot.addEventListener('click', () => updateTest(parseInt(dot.dataset.index, 10)));
  });

  // Autoplay
  function startAutoplay() {
    testAutoplay = setInterval(() => updateTest(testIndex + 1), 5000);
  }
  startAutoplay();

  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(testAutoplay));
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  /* =======================================================================
     11. FAQ ACCORDION
     ======================================================================= */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(el => el.classList.remove('active'));

      // Toggle current
      if (!isOpen) item.classList.add('active');
    });
  });

  /* =======================================================================
     12. WHATSAPP FLOAT
     ======================================================================= */
  const WHATSAPP_URL =
    'https://wa.me/919876543210?text=Hi%20Dr.%20Vyoma,%20I%20would%20like%20to%20book%20a%20consultation.';

  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    });
  }

  /* =======================================================================
     13. BUTTON RIPPLE EFFECT
     ======================================================================= */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width  = ripple.style.height = `${size}px`;
      ripple.style.left   = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top    = `${e.clientY - rect.top  - size / 2}px`;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
      setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 1000);
    });
  });

  /* =======================================================================
     14. PARALLAX EFFECT (hero section)
     ======================================================================= */
  const heroSection = document.querySelector('.hero');

  function handleParallax() {
    if (!heroSection || window.innerWidth <= 768) return;
    const scrollY = window.scrollY || window.pageYOffset;
    heroSection.style.backgroundPositionY = `${scrollY * 0.3}px`;
  }

  window.addEventListener('scroll', debounce(handleParallax, 10), { passive: true });

  /* =======================================================================
     15. CTA BUTTONS
     ======================================================================= */
  document.querySelectorAll('.cta-whatsapp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    });
  });

  document.querySelectorAll('.cta-call').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('[Dr. Vyoma Clinic] Call CTA clicked —', btn.getAttribute('href'));
    });
  });

  /* =======================================================================
     16. ENQUIRY FORM — Validation & Submission
     ======================================================================= */
  const enquiryForm   = document.getElementById('enquiryForm');
  const formToast     = document.getElementById('formToast');
  const toastClose    = document.getElementById('toastClose');
  const toastIcon     = document.getElementById('toastIcon');
  const toastMessage  = document.getElementById('toastMessage');

  function showFieldError(fieldId, errorId, message) {
    const group = document.getElementById(fieldId)?.closest('.form-group');
    const errorEl = document.getElementById(errorId);
    if (group) { group.classList.add('error'); group.classList.remove('valid'); }
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(fieldId, errorId) {
    const group = document.getElementById(fieldId)?.closest('.form-group');
    const errorEl = document.getElementById(errorId);
    if (group) group.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function markFieldValid(fieldId) {
    const group = document.getElementById(fieldId)?.closest('.form-group');
    if (group) { group.classList.remove('error'); group.classList.add('valid'); }
  }

  // Real-time validation
  const nameInput  = document.getElementById('enquiry-name');
  const phoneInput = document.getElementById('enquiry-phone');
  const emailInput = document.getElementById('enquiry-email');

  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      if (!nameInput.value.trim()) showFieldError('enquiry-name', 'nameError', 'Please enter your full name');
      else { clearFieldError('enquiry-name', 'nameError'); markFieldValid('enquiry-name'); }
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) clearFieldError('enquiry-name', 'nameError');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const p = phoneInput.value.replace(/[\s\-\+]/g, '');
      if (!p) showFieldError('enquiry-phone', 'phoneError', 'Please enter your mobile number');
      else if (p.length < 10) showFieldError('enquiry-phone', 'phoneError', 'Please enter a valid 10-digit mobile number');
      else { clearFieldError('enquiry-phone', 'phoneError'); markFieldValid('enquiry-phone'); }
    });
    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.replace(/[\s\-\+]/g, '').length >= 10) clearFieldError('enquiry-phone', 'phoneError');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const e = emailInput.value.trim();
      if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) showFieldError('enquiry-email', 'emailError', 'Please enter a valid email address');
      else { clearFieldError('enquiry-email', 'emailError'); if (e) markFieldValid('enquiry-email'); }
    });
  }

  // Toast
  function showToast(msg, isError = false) {
    if (!formToast) return;
    toastMessage.textContent = msg;
    toastIcon.textContent = isError ? '✕' : '✓';
    formToast.classList.remove('error');
    if (isError) formToast.classList.add('error');
    formToast.classList.add('show');
    clearTimeout(formToast._t);
    formToast._t = setTimeout(() => formToast.classList.remove('show'), 6000);
  }

  if (toastClose) toastClose.addEventListener('click', () => formToast.classList.remove('show'));

  // Submit
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      const name  = nameInput?.value.trim();
      const phone = phoneInput?.value.replace(/[\s\-\+]/g, '');
      const email = emailInput?.value.trim();

      if (!name) { showFieldError('enquiry-name', 'nameError', 'Please enter your full name'); isValid = false; }
      else { clearFieldError('enquiry-name', 'nameError'); markFieldValid('enquiry-name'); }

      if (!phone) { showFieldError('enquiry-phone', 'phoneError', 'Please enter your mobile number'); isValid = false; }
      else if (phone.length < 10) { showFieldError('enquiry-phone', 'phoneError', 'Please enter a valid 10-digit number'); isValid = false; }
      else { clearFieldError('enquiry-phone', 'phoneError'); markFieldValid('enquiry-phone'); }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('enquiry-email', 'emailError', 'Please enter a valid email address'); isValid = false;
      }

      if (!isValid) {
        const firstErr = enquiryForm.querySelector('.form-group.error');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = document.getElementById('formSubmitBtn');
      const btnText   = submitBtn?.querySelector('.btn-text');
      const btnLoader = submitBtn?.querySelector('.btn-loader');

      if (submitBtn) submitBtn.classList.add('loading');
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline-flex';

      try {
        const formData = new FormData(enquiryForm);
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
        const result = await response.json();

        if (result.success) {
          showToast('Thank you! Your enquiry has been sent. We\'ll contact you shortly.', false);
          enquiryForm.reset();
          enquiryForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('valid', 'error'));
          enquiryForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('[Dr. Vyoma Clinic] Form error:', err);
        showToast('Something went wrong. Please try WhatsApp or call us directly.', true);
      } finally {
        if (submitBtn) submitBtn.classList.remove('loading');
        if (btnText) btnText.style.display = 'inline-flex';
        if (btnLoader) btnLoader.style.display = 'none';
      }
    });
  }
});
