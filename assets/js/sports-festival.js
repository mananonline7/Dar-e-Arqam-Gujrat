/* =========================================================
   Sports Festival page — bespoke motion only. Shared mechanics
   (.reveal, [data-parallax], [data-count], nav, lightbox) come
   from script.js; this file only adds what's unique to this
   page's stadium-broadcast feel.
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- hero floating particles ---------- */
  const pField = $(".sf-hero-particles");
  if (pField && !reduceMotion) {
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span");
      const size = Math.random() * 3 + 1.5;
      s.style.width = s.style.height = size.toFixed(1) + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.bottom = "-5%";
      s.style.animationDuration = (Math.random() * 6 + 7).toFixed(2) + "s";
      s.style.animationDelay = (Math.random() * 9).toFixed(2) + "s";
      pField.appendChild(s);
    }
  }

  /* ---------- cursor-reactive stadium spotlight ---------- */
  const hero = $(".sf-hero");
  const spot = $(".sf-hero-spot");
  if (hero && spot && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    let raf = null;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        spot.style.setProperty("--mx", mx.toFixed(1) + "%");
        spot.style.setProperty("--my", my.toFixed(1) + "%");
        raf = null;
      });
    });
  }

  /* ---------- floating broadcast card tilt ---------- */
  const cards = $$(".sf-hcard");
  if (cards.length && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    cards.forEach((card) => {
      let raf = null;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          card.style.transform = `translateY(-6px) scale(1.02) rotate(${(px * 3).toFixed(2)}deg)`;
          raf = null;
        });
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- year rail: highlight the year in view ---------- */
  const yearLinks = $$(".sf-yearnav a");
  const yearBlocks = $$(".sf-year[id]");
  if (yearLinks.length && yearBlocks.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      yearLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
    };
    const yio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.35, rootMargin: "-15% 0px -50% 0px" }
    );
    yearBlocks.forEach((el) => yio.observe(el));
  }
})();
