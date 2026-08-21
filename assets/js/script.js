/* =========================================================
   Dar-e-Arqam Schools — Gujrat Region
   Home Page Interactions
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shrink + back-to-top visibility ---------- */
  const header = $(".site-header");
  const toTopBtn = $(".to-top");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    if (toTopBtn) toTopBtn.classList.toggle("show", window.scrollY > 600);
  };

  /* ---------- Mobile nav ---------- */
  const body = document.body;
  const toggle = $(".nav-toggle");
  const backdrop = $(".nav-backdrop");
  const isMobileNav = () => window.matchMedia("(max-width: 1300px)").matches;
  const closeNav = () => {
    body.classList.remove("nav-open");
    $$(".nav-item.dropdown-open").forEach((item) => item.classList.remove("dropdown-open"));
  };
  // Belt-and-braces alongside the CSS visibility-delay fix in styles.css:
  // removing .nav-open changes the panel's box/paint state immediately,
  // and doing that synchronously inside a link's own click handler risks
  // racing that same click's default navigation in some browsers — the
  // menu flashes shut and the page just... stays put. Deferring the close
  // by a tick lets the browser dispatch the navigation first; nav links
  // to the same page (anchors) still close the menu, just a beat later,
  // which isn't perceptible.
  const closeNavDeferred = () => { setTimeout(closeNav, 0); };
  toggle && toggle.addEventListener("click", () => body.classList.toggle("nav-open"));
  // Explicit close (never a toggle) so a stray bubbled event can't
  // accidentally reopen the menu. The backdrop is its own dedicated
  // element behind the sidebar (see styles.css) rather than a full-
  // screen catch-all, so in normal operation only a tap that actually
  // lands on it — i.e. outside the sidebar — reaches this handler; the
  // e.target check is a second guard against ever closing on a tap that
  // merely bubbled up through the backdrop from something else.
  backdrop && backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeNav(); });
  // Plain nav links (not dropdown triggers) close the mobile menu on tap.
  // Dropdown triggers are handled separately below, since on mobile they
  // toggle a submenu instead of navigating straight away.
  $$(".nav > a").forEach((a) => a.addEventListener("click", closeNavDeferred));
  $$(".dropdown-panel a").forEach((a) => a.addEventListener("click", closeNavDeferred));

  /* ---------- Nav dropdowns (Academics / Facilities / Extracurricular) ----------
     Desktop: CSS :hover keeps the panel open via a zero-gap hit-area, but a
     fast or diagonal mouse path can still outrun a pure-CSS hover chain for
     an instant, so a small close-delay grace timer backs it up here.
     Mobile (<=1300px, no real hover): the trigger becomes a tap-to-toggle
     accordion — the first tap expands its submenu instead of following the
     link (the submenu's own links are real destinations), and tapping an
     already-open trigger collapses it again. Only one submenu stays open
     at a time. */
  $$(".nav-item").forEach((item) => {
    const trigger = item.querySelector(":scope > a");
    let closeTimer = null;
    const open = () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      item.classList.add("dropdown-open");
    };
    const scheduleClose = () => {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(() => item.classList.remove("dropdown-open"), 200);
    };
    item.addEventListener("mouseenter", () => { if (!isMobileNav()) open(); });
    item.addEventListener("mouseleave", () => { if (!isMobileNav()) scheduleClose(); });
    item.addEventListener("focusin", () => { if (!isMobileNav()) open(); });
    item.addEventListener("focusout", (e) => {
      if (!isMobileNav() && !item.contains(e.relatedTarget)) scheduleClose();
    });

    trigger && trigger.addEventListener("click", (e) => {
      if (!isMobileNav()) return;
      e.preventDefault();
      const willOpen = !item.classList.contains("dropdown-open");
      $$(".nav-item.dropdown-open").forEach((other) => { if (other !== item) other.classList.remove("dropdown-open"); });
      item.classList.toggle("dropdown-open", willOpen);
    });
  });

  /* ---------- Hero: rotating typewriter subheadline ---------- */
  const typeEl = $(".hero-type .txt");
  if (typeEl && !reduceMotion) {
    const phrases = [
      "Gateway to Greatness.",
      "Excellence in this world and the hereafter.",
      "Hifz-e-Quran · Cambridge O-Levels · Vibrant Sports.",
      "A blend of Islamic values and modern learning.",
    ];
    let p = 0, i = 0, deleting = false;
    const tick = () => {
      const full = phrases[p];
      i += deleting ? -1 : 1;
      typeEl.textContent = full.slice(0, i);
      let delay = deleting ? 34 : 58;
      if (!deleting && i === full.length) { delay = 2100; deleting = true; }
      else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 380; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 900);
  } else if (typeEl) {
    typeEl.textContent = "A unique system for academic brilliance and spiritual growth.";
  }

  /* ---------- Hero: floating particles (any matching field on the page) ---------- */
  const fillParticles = (field, n) => {
    for (let k = 0; k < n; k++) {
      const s = document.createElement("span");
      const size = Math.random() * 6 + 2;
      s.style.width = s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDuration = (Math.random() * 6 + 5).toFixed(2) + "s";
      s.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
      field.appendChild(s);
    }
  };
  if (!reduceMotion) {
    const pField = $(".h2-particles") || $(".hero-particles");
    if (pField) fillParticles(pField, 16);

    /* Riding club: drifting trail dust */
    const dust = $(".rd-dust");
    if (dust) {
      for (let k = 0; k < 26; k++) {
        const s = document.createElement("span");
        const size = Math.random() * 5 + 1.5;
        s.style.width = s.style.height = size.toFixed(1) + "px";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = (60 + Math.random() * 40) + "%";
        s.style.animationDuration = (Math.random() * 7 + 6).toFixed(2) + "s";
        s.style.animationDelay = (Math.random() * 8).toFixed(2) + "s";
        dust.appendChild(s);
      }
    }
  }

  /* ---------- Hero 2: subtle mouse parallax on the portrait fan ---------- */
  const fanStage = $(".h2-fan");
  if (fanStage && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    const frames = $$(".fan-card", fanStage).map((card, i) => ({
      move: $(".fan-move", card),
      depth: [10, 16, 13, 20][i % 4],
    }));
    let raf = null;
    fanStage.addEventListener("mousemove", (e) => {
      const r = fanStage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        frames.forEach(({ move, depth }) => {
          if (!move) return;
          move.style.setProperty("--mx", (nx * depth).toFixed(1) + "px");
          move.style.setProperty("--my", (ny * depth).toFixed(1) + "px");
        });
        raf = null;
      });
    });
    fanStage.addEventListener("mouseleave", () => {
      frames.forEach(({ move }) => {
        if (!move) return;
        move.style.setProperty("--mx", "0px");
        move.style.setProperty("--my", "0px");
      });
    });
  }

  /* ---------- Hero 2: cursor-reactive background blobs (Antigravity-style) ---------- */
  const heroBg = $(".h2-bg");
  const heroSection = $(".hero2");
  if (heroBg && heroSection && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    let raf2 = null;
    const setVars = (px, py) => {
      heroBg.style.setProperty("--px", px.toFixed(3));
      heroBg.style.setProperty("--py", py.toFixed(3));
      raf2 = null;
    };
    heroSection.addEventListener("mousemove", (e) => {
      const r = heroSection.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (raf2) return;
      raf2 = requestAnimationFrame(() => setVars(px, py));
    });
    heroSection.addEventListener("mouseleave", () => {
      if (raf2) cancelAnimationFrame(raf2);
      raf2 = requestAnimationFrame(() => setVars(0, 0));
    });
  }

  /* ---------- Parallax (hero collage + tagged elements) ---------- */
  const parallaxEls = $$("[data-parallax]");
  let ticking = false;
  const applyParallax = () => {
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  const requestParallax = () => { if (!ticking && !reduceMotion) { ticking = true; requestAnimationFrame(applyParallax); } };

  window.addEventListener("scroll", () => { onScroll(); requestParallax(); }, { passive: true });
  onScroll();

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  const revealEls = $$(".reveal");
  const showAll = () => revealEls.forEach((el) => el.classList.add("in"));
  if (reduceMotion) {
    showAll();
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
    // Failsafe 1: reveal anything already within the viewport on load.
    const revealInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
      });
    };
    window.addEventListener("load", revealInView);
    revealInView();
    // Failsafe 2: never leave content permanently hidden if observers stall.
    setTimeout(showAll, 4500);
  } else {
    showAll();
  }

  /* ---------- Count-up counters ---------- */
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dur = 1800;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const val = Math.floor(ease(t) * target);
      el.firstChild.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(step);
      else el.firstChild.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else counters.forEach(runCount);

  /* ---------- Leadership tabs ---------- */
  const lTabs = $$(".leader-tab");
  const lSlides = $$(".leader-slide");
  lTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      lTabs.forEach((t) => t.classList.remove("active"));
      lSlides.forEach((s) => s.classList.remove("active"));
      tab.classList.add("active");
      const target = $("#" + tab.dataset.target);
      if (target) target.classList.add("active");
    });
  });

  /* ---------- Generic carousel factory ----------
     Drives every carousel/slider on the page (a page may hold several). */
  const initCarousel = (root, sel, autoMs) => {
    const track = $(sel.track, root);
    const slides = $$(sel.slide, root);
    const dotsWrap = $(sel.dots, root);
    if (!track || slides.length < 2) return;

    let idx = 0, timer = null;
    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (dotsWrap) $$("button", dotsWrap).forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    const next = () => go(idx + 1);
    const prev = () => go(idx - 1);
    const reset = () => { if (timer) clearInterval(timer); if (!reduceMotion) timer = setInterval(next, autoMs); };

    if (dotsWrap) {
      slides.forEach((_, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to slide " + (k + 1));
        if (k === 0) b.classList.add("active");
        b.addEventListener("click", () => { go(k); reset(); });
        dotsWrap.appendChild(b);
      });
    }
    const nextBtn = $(sel.next, root), prevBtn = $(sel.prev, root);
    nextBtn && nextBtn.addEventListener("click", () => { next(); reset(); });
    prevBtn && prevBtn.addEventListener("click", () => { prev(); reset(); });
    root.addEventListener("mouseenter", () => { if (timer) clearInterval(timer); });
    root.addEventListener("mouseleave", reset);
    reset();
  };

  /* Sports / about carousels */
  $$(".sports-carousel").forEach((el) => initCarousel(el, {
    track: ".carousel-track", slide: ".carousel-slide", dots: ".carousel-dots",
    next: ".carousel-btn.next", prev: ".carousel-btn.prev",
  }, 4200));

  /* Cambridge event sliders */
  $$(".cb-slider").forEach((el) => initCarousel(el, {
    track: ".cbs-track", slide: ".cbs-slide", dots: ".cbs-dots",
    next: ".cbs-btn.next", prev: ".cbs-btn.prev",
  }, 4600));

  /* ---------- Image showcase (feature + thumb rail) ---------- */
  $$(".showcase").forEach((sc) => {
    const main = $(".showcase-main", sc);
    const cap = $(".showcase-cap", sc);
    const slides = $$("img", main);
    const btns = $$(".showcase-rail button", sc);
    if (!slides.length || !btns.length) return;

    let idx = 0, timer = null;
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("on", i === idx));
      btns.forEach((b, i) => b.classList.toggle("active", i === idx));
      if (cap && btns[idx].dataset.cap) cap.textContent = btns[idx].dataset.cap;
    };
    const play = () => { if (timer) clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show(idx + 1), 5000); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };

    btns.forEach((b, i) => {
      b.addEventListener("click", () => { show(i); play(); });
      b.addEventListener("mouseenter", () => { show(i); stop(); });
    });
    sc.addEventListener("mouseleave", play);
    play();
  });

  /* ---------- Pillar tabs (Hifz / Nazra / Sports quick jump) ---------- */
  const pTabs = $$(".pillar-tab");
  pTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      pTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const el = $("#" + tab.dataset.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ---------- Results page: drifting confetti sparks in the hero ---------- */
  const sparkWrap = $(".rs-sparks");
  if (sparkWrap && !reduceMotion) {
    const tints = ["#ffc600", "#ffd84d", "#4fc3f7", "#ffffff"];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = tints[Math.floor(Math.random() * tints.length)];
      s.style.animationDuration = (6 + Math.random() * 7).toFixed(2) + "s";
      s.style.animationDelay = (Math.random() * 8).toFixed(2) + "s";
      const size = 4 + Math.random() * 5;
      s.style.width = size + "px";
      s.style.height = size * (Math.random() > 0.5 ? 1 : 2.2) + "px";
      s.style.opacity = 0;
      sparkWrap.appendChild(s);
    }
  }

  /* ---------- Generic image lightbox ----------
     Used by the Results page (posters carry the full name lists in small
     print) and the Events page (event photography). Every matching figure
     on the page joins one gallery, so prev/next walks the whole page in
     document order. Pass the dialog id, the trigger selector, and the
     class prefix used for the dialog's own parts. */
  const initLightbox = (dialogSel, triggerSel, p) => {
    const lb = $(dialogSel);
    const figs = $$(triggerSel);
    if (!lb || !figs.length) return;

    const lbImg = $("img", lb);
    const lbCap = $("." + p + "-cap", lb);
    const btnPrev = $("." + p + "-btn.prev", lb);
    const btnNext = $("." + p + "-btn.next", lb);
    const btnClose = $("." + p + "-close", lb);
    const blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    let current = 0;
    let lastFocus = null;

    const render = (n) => {
      current = (n + figs.length) % figs.length;
      const fig = figs[current];
      const img = $("img", fig);
      const cap = $("figcaption", fig);
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      if (cap && lbCap) {
        const small = $("small", cap);
        const title = cap.childNodes[0] ? cap.childNodes[0].textContent.trim() : "";
        lbCap.innerHTML = "";
        lbCap.appendChild(document.createTextNode(title));
        if (small) {
          const sub = document.createElement("span");
          sub.textContent = small.textContent;
          lbCap.appendChild(sub);
        }
      }
    };

    const open = (n) => {
      lastFocus = document.activeElement;
      lb.hidden = false;
      render(n);
      // let the browser paint the un-hidden node before transitioning in
      requestAnimationFrame(() => lb.classList.add("open"));
      document.body.style.overflow = "hidden";
      btnClose && btnClose.focus();
    };

    const close = () => {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      window.setTimeout(() => { lb.hidden = true; lbImg.src = blank; }, 360);
      if (lastFocus) lastFocus.focus();
    };

    figs.forEach((fig, i) => {
      fig.addEventListener("click", () => open(i));
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    btnPrev && btnPrev.addEventListener("click", (e) => { e.stopPropagation(); render(current - 1); });
    btnNext && btnNext.addEventListener("click", (e) => { e.stopPropagation(); render(current + 1); });
    btnClose && btnClose.addEventListener("click", close);
    // clicking the dark backdrop (but not the figure itself) closes
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") render(current - 1);
      else if (e.key === "ArrowRight") render(current + 1);
    });
  };

  initLightbox("#rsLightbox", ".rs-poster", "rs-lb");
  initLightbox("#evLightbox", ".ev-tile, .atc-photo", "ev-lb");
  initLightbox("#raLightbox", ".ra-photo", "ra-lb");
  initLightbox("#hfLightbox", ".hf-tile", "hf-lb");
  initLightbox("#ycLightbox", ".yc-photo", "yc-lb");
  initLightbox("#sfLightbox", ".sf-tile", "sf-lb");
  initLightbox("#rtLightbox", ".rt-photo", "rt-lb");

  /* ---------- Events page: rising gold motes in the hero ---------- */
  const moteWrap = $(".ev-motes");
  if (moteWrap && !reduceMotion) {
    for (let i = 0; i < 30; i++) {
      const m = document.createElement("i");
      const size = 2 + Math.random() * 4;
      m.style.left = Math.random() * 100 + "%";
      m.style.bottom = "-" + (Math.random() * 20) + "px";
      m.style.width = size + "px";
      m.style.height = size + "px";
      m.style.animationDuration = (11 + Math.random() * 12).toFixed(2) + "s";
      m.style.animationDelay = (Math.random() * 14).toFixed(2) + "s";
      if (Math.random() > 0.6) m.style.background = "#fff4e2";
      moteWrap.appendChild(m);
    }
  }

  /* ---------- Hifz-e-Quran page: floating gold motes in the hero ---------- */
  const hfMoteWrap = $(".hf-motes");
  if (hfMoteWrap && !reduceMotion) {
    for (let i = 0; i < 24; i++) {
      const m = document.createElement("i");
      const size = 2 + Math.random() * 4;
      m.style.left = Math.random() * 100 + "%";
      m.style.bottom = "-" + (Math.random() * 20) + "px";
      m.style.width = size + "px";
      m.style.height = size + "px";
      m.style.animationDuration = (12 + Math.random() * 13).toFixed(2) + "s";
      m.style.animationDelay = (Math.random() * 15).toFixed(2) + "s";
      hfMoteWrap.appendChild(m);
    }
  }

  /* ---------- Back to top ---------- */
  toTopBtn && toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = $$(".nav a[href^='#']");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          navLinks.forEach((a) => a.style.color = a.getAttribute("href") === id ? "var(--yellow)" : "");
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => sio.observe(s));
  }
})();

/* =========================================================
   Admissions popup — shows once per browser session, after
   the page finishes loading, on whichever page starts the
   session (this file is shared across every page).
   ========================================================= */
(function () {
  "use strict";
  const STORAGE_KEY = "dasPopupShown";
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML =
    '<div class="popup-modal" role="dialog" aria-modal="true" aria-label="Admissions announcement" tabindex="-1">' +
      '<button type="button" class="popup-close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<img src="assets/img/popup-admissions.jpg" alt="Dar-e-Arqam Schools admissions open 2026-27 — PG to 9th, PG to O-Level, Shoba Hifz. Apply now." />' +
    '</div>';
  document.body.appendChild(overlay);

  const modal = overlay.querySelector(".popup-modal");
  const closeBtn = overlay.querySelector(".popup-close");
  let lastFocused = null;

  const onKeydown = (e) => {
    if (e.key === "Escape") { closePopup(); return; }
    if (e.key === "Tab") {
      // Only one focusable element in this dialog — keep focus pinned to it.
      e.preventDefault();
      closeBtn.focus();
    }
  };

  function closePopup() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-lock");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function openPopup() {
    lastFocused = document.activeElement;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-lock");
    modal.focus();
    document.addEventListener("keydown", onKeydown);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  overlay.addEventListener("click", (e) => { if (e.target === overlay) closePopup(); });
  closeBtn.addEventListener("click", closePopup);

  if (document.readyState === "complete") openPopup();
  else window.addEventListener("load", openPopup);
})();

/* =========================================================
   Floating WhatsApp button — built here (rather than marked
   up on every page) so the shared script gives every page the
   same fixed, bottom-right chat link automatically.
   ========================================================= */
(function () {
  "use strict";
  const fab = document.createElement("a");
  fab.className = "whatsapp-fab";
  fab.href = "https://wa.me/923000347034";
  fab.target = "_blank";
  fab.rel = "noopener noreferrer";
  fab.setAttribute("aria-label", "Chat with us on WhatsApp");
  fab.innerHTML =
    '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">' +
      '<path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.694 4.61 1.885 6.487L4 29l7.72-1.844A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.7c-1.95 0-3.76-.55-5.3-1.5l-.38-.22-4.58 1.095 1.12-4.46-.25-.4A9.63 9.63 0 0 1 5.3 15c0-5.35 4.36-9.7 9.7-9.7 5.35 0 9.7 4.35 9.7 9.7 0 5.35-4.35 9.7-9.7 9.7zm5.32-7.26c-.29-.145-1.71-.845-1.975-.94-.265-.095-.46-.145-.65.145-.19.29-.745.94-.915 1.135-.17.19-.335.215-.625.07-.29-.145-1.225-.45-2.33-1.435-.86-.765-1.44-1.71-1.61-2-.17-.29-.02-.445.13-.59.13-.13.29-.335.435-.505.145-.17.19-.29.29-.485.095-.19.05-.36-.025-.505-.075-.145-.65-1.565-.89-2.145-.235-.565-.475-.49-.65-.5-.17-.01-.36-.01-.55-.01s-.505.07-.77.36c-.265.29-1 1-1 2.435 0 1.435 1.02 2.82 1.165 3.015.145.19 2 3.055 4.85 4.285.68.295 1.21.47 1.62.6.68.215 1.3.185 1.79.11.545-.08 1.71-.7 1.95-1.375.24-.675.24-1.255.17-1.375-.07-.12-.265-.195-.555-.34z"/>' +
    '</svg>';
  document.body.appendChild(fab);
})();
