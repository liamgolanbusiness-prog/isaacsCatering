/* אייזיקיס · Isaacs Catering — interactions */
(() => {
  'use strict';

  /* ============== Year ============== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============== Header scroll state ============== */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============== Mobile nav ============== */
  const burger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const closeNav = () => {
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeNav();
    } else {
      burger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  /* ============== Reveal on scroll ============== */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger inside the same intersection batch
          const delay = Math.min(i * 80, 320);
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ============== 3D tilt cards (desktop pointer only) ============== */
  const supportsHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const max = 6; // degrees
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============== Cursor orb ============== */
  const cursor = document.querySelector('.cursor-orb');
  if (cursor && supportsHover) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
    });
    const animate = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    // Grow on interactive
    document.querySelectorAll('a, button, [data-tilt], summary, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(2.5)');
      el.addEventListener('mouseleave', () => {/* size resets via animate loop */});
    });
  }

  /* ============== Hero parallax (subtle) ============== */
  const orbs = document.querySelectorAll('.hero-bg .orb');
  const plate = document.querySelector('.hero-plate');
  let ticking = false;
  const onParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      orbs.forEach((o, i) => {
        const speed = (i + 1) * 0.05;
        o.style.transform = `translateY(${y * speed}px)`;
      });
      if (plate) {
        plate.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onParallax, { passive: true });

  /* ============== Smooth scroll polyfill for older browsers ============== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============== Contact form → WhatsApp ============== */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const event = (data.get('event') || '').toString().trim();
      const guests = (data.get('guests') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !phone) {
        alert('נא למלא שם וטלפון.');
        return;
      }

      const text = [
        `*בקשת הצעת מחיר — אייזיקיס קייטרינג*`,
        ``,
        `שם: ${name}`,
        `טלפון: ${phone}`,
        event ? `סוג אירוע: ${event}` : '',
        guests ? `מספר אורחים: ${guests}` : '',
        message ? `\nפרטים נוספים:\n${message}` : ''
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/972524175004?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    });
  }
})();
