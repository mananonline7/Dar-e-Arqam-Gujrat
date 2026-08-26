/* =========================================================
   Mukabbir University section — page-specific interactions.
   Header/nav/footer behavior comes from the shared script.js;
   this file only handles what's unique to this page's content.
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".mu-reveal, .mu-tl-node");
  if ("IntersectionObserver" in window) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          rio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => rio.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Hero floating gold particles ---------- */
  const particleWrap = $(".mu-particles");
  if (particleWrap && !reduceMotion) {
    const count = window.innerWidth < 700 ? 16 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const size = 2 + Math.random() * 3.4;
      p.style.left = Math.random() * 100 + "%";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.setProperty("--mu-drift", (Math.random() * 90 - 45).toFixed(0) + "px");
      p.style.animationDuration = (14 + Math.random() * 16).toFixed(2) + "s";
      p.style.animationDelay = (Math.random() * 18).toFixed(2) + "s";
      particleWrap.appendChild(p);
    }
  }

  /* ---------- Hero parallax on scroll ---------- */
  const heroImg = $(".mu-hero-media img");
  const heroSection = $(".mu-hero");
  if (heroImg && heroSection && !reduceMotion) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = heroSection.offsetHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      heroImg.style.transform = `scale(${1.08 + p * 0.05}) translateY(${p * 26}px)`;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Generic lightbox for gallery + timeline figures ---------- */
  function initLightbox(figureSelector) {
    const figures = $$(figureSelector);
    if (!figures.length) return;

    const lb = document.createElement("div");
    lb.className = "mu-lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<figure class="mu-lb-figure" tabindex="-1">' +
        '<button type="button" class="mu-lb-close" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<button type="button" class="mu-lb-btn prev" aria-label="Previous image">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>' +
        '</button>' +
        '<img alt="" />' +
        '<button type="button" class="mu-lb-btn next" aria-label="Next image">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>' +
        '</button>' +
        '<figcaption class="mu-lb-cap"></figcaption>' +
      '</figure>';
    document.body.appendChild(lb);

    const img = $("img", lb);
    const cap = $(".mu-lb-cap", lb);
    const closeBtn = $(".mu-lb-close", lb);
    const prevBtn = $(".mu-lb-btn.prev", lb);
    const nextBtn = $(".mu-lb-btn.next", lb);
    let idx = 0;
    let lastFocused = null;

    const show = (i) => {
      idx = (i + figures.length) % figures.length;
      const source = $("img", figures[idx]);
      img.src = source.currentSrc || source.src;
      img.alt = source.alt || "";
      cap.textContent = figures[idx].getAttribute("data-caption") || source.alt || "";
    };
    const open = (i) => {
      lastFocused = document.activeElement;
      show(i);
      lb.classList.add("show");
      lb.setAttribute("aria-hidden", "false");
      body.classList.add("mu-lock");
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    };
    const close = () => {
      lb.classList.remove("show");
      lb.setAttribute("aria-hidden", "true");
      body.classList.remove("mu-lock");
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused) lastFocused.focus();
    };
    const onKeydown = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "ArrowLeft") show(idx - 1);
    };

    figures.forEach((fig, i) => {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.addEventListener("click", () => open(i));
      fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
    });
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(idx - 1));
    nextBtn.addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  }

  initLightbox(".mu-masonry figure");
  initLightbox(".mu-sports-row figure");
  initLightbox(".mu-tl-shots figure");
})();
