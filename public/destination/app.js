/* =========================================================
   BAD SHAHI MOSQUE — Animation Engine
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------------------------------------------------------
     1. SMOOTH SCROLL (Lenis) + ScrollTrigger sync
     --------------------------------------------------------- */
  let lenis = null;
  if (!REDUCED && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollTo = (target, offset) => {
    if (lenis) {
      lenis.scrollTo(target, { offset: offset === undefined ? -70 : offset, duration: 1.2 });
    } else {
      const el = typeof target === "string" ? $(target) : target;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (offset || 0), behavior: "smooth" });
    }
  };

  /* ---------------------------------------------------------
     2. CUSTOM CURSOR
     --------------------------------------------------------- */
  const cursor = $("#cursor");
  if (cursor && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const dot = $(".cursor-dot", cursor);
    const ring = $(".cursor-ring", cursor);
    const label = $(".cursor-label", cursor);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, dx = mx, dy = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!cursor.classList.contains("is-view")) label.textContent = "";
    });

    gsap.ticker.add(() => {
      dx += (mx - dx) * 0.9; dy += (my - dy) * 0.9;
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    });

    document.addEventListener("mouseover", (e) => {
      const view = e.target.closest("[data-cursor='view']");
      const link = e.target.closest("[data-cursor='link'], a, button");
      if (view) {
        cursor.classList.add("is-view");
        label.textContent = view.dataset.cursorLabel || "View";
      } else if (link) {
        cursor.classList.add("is-link");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("[data-cursor='view']")) cursor.classList.remove("is-view");
      if (e.target.closest("[data-cursor='link'], a, button")) cursor.classList.remove("is-link");
    });
    document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
  }

  /* ---------------------------------------------------------
     3. SCROLL PROGRESS BAR
     --------------------------------------------------------- */
  const bar = $("#progressBar");
  if (bar) {
    gsap.to(bar, {
      width: "100%",
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.25 }
    });
  }

  /* ---------------------------------------------------------
     4. NAVIGATION
     --------------------------------------------------------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const menu = $("#navMenu");
  let lastY = window.scrollY;

  const navScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-stuck", y > 40);
    if (y > 320 && y > lastY + 4) nav.style.transform = "translateY(-100%)";
    else if (y < lastY - 4) nav.style.transform = "translateY(0)";
    lastY = y;
  };
  navScroll();
  window.addEventListener("scroll", navScroll, { passive: true });

  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (lenis) open ? lenis.stop() : lenis.start();
    });
  }

  // smooth anchor scroll
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (menu && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      }
      scrollTo(target, -60);
    });
  });

  // active section
  $$("[data-nav]").forEach((link) => {
    const id = link.getAttribute("href");
    const sec = $(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (self) => link.classList.toggle("is-active", self.isActive)
    });
  });

  /* ---------------------------------------------------------
     5. COUNTERS
     --------------------------------------------------------- */
  const fmt = (n) => n.toLocaleString("en-US");
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.9, ease: "power2.out",
      onUpdate() { el.textContent = prefix + fmt(Math.round(obj.v)) + suffix; }
    });
  }
  const counters = $$("[data-count]").filter((el) => !el.closest(".hero-facts"));
  counters.forEach((el) => {
    if (el.dataset.static) return;
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => countUp(el)
    });
  });

  /* ---------------------------------------------------------
     6. GENERIC REVEAL
     --------------------------------------------------------- */
  if (!REDUCED) {
    $$("[data-reveal]").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.05, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  } else {
    $$("[data-reveal]").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------------------------------------------------------
     7. PARALLAX IMAGES
     --------------------------------------------------------- */
  if (!REDUCED) {
    $$("[data-parallax]").forEach((img) => {
      const speed = parseFloat(img.dataset.parallax) || 0.1;
      const host = img.closest("section, .quote-sec") || img.parentElement;
      gsap.fromTo(img,
        { yPercent: -speed * 45 },
        {
          yPercent: speed * 45, ease: "none",
          scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
        }
      );
    });
  }

  /* ---------------------------------------------------------
     8. HERO INTRO (after loader)
     --------------------------------------------------------- */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero-top", { opacity: 1, y: 0, duration: 0.9 }, 0)
      .to(".hero-title .in", { y: "0%", duration: 1.25, stagger: 0.11 }, 0.12)
      .to(".hero-urdu", { opacity: 1, y: 0, duration: 1 }, 0.55)
      .to(".hero-lead", { opacity: 1, y: 0, duration: 1 }, 0.7)
      .to(".hero-actions", { opacity: 1, y: 0, duration: 1 }, 0.85)
      .fromTo(".hf", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.0)
      .fromTo(".scroll-cue", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.3)
      .fromTo(".sc-line i", { xPercent: -100 }, { xPercent: 100, duration: 1.6, repeat: -1, ease: "none" }, 1.3);

    // hero numbers count up once the intro is running
    const heroNums = $$(".hero-facts [data-count]");
    heroNums.forEach((el, i) => {
      gsap.delayedCall(1.0 + i * 0.09, () => countUp(el));
    });
    return tl;
  }

  /* ---------------------------------------------------------
     9. LOADER
     --------------------------------------------------------- */
  const loader = $("#loader");
  const loaderCount = $("#loaderCount");
  const letterSpans = $$("#loaderWord span");

  function runLoader() {
    document.body.style.overflow = "hidden";

    // precise stroke lengths so the arches draw perfectly
    $$(".loader-mark path, .loader-mark line").forEach((p) => {
      try {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      } catch (e) { /* noop */ }
    });

    const c = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        loader.style.display = "none";
        document.body.style.overflow = "";
        heroIntro();
        ScrollTrigger.refresh();
      }
    });

    if (REDUCED) {
      loaderCount.textContent = "100";
      tl.to(loader, { autoAlpha: 0, duration: 0.2 });
      return;
    }

    tl.to(".lm-arch", { strokeDashoffset: 0, duration: 1.5, stagger: 0.14, ease: "power2.inOut" }, 0)
      .to(".lm-base", { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.35)
      .to(letterSpans, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power2.out" }, 0.5)
      .to(c, {
        v: 100, duration: 1.5, ease: "power2.inOut",
        onUpdate() { loaderCount.textContent = String(Math.round(c.v)).padStart(2, "0"); }
      }, 0)
      .to(loader, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.15")
      .to(".loader-curtain", { scaleY: 0, duration: 1.05, ease: "power4.inOut" }, "-=0.35");
  }

  /* ---------------------------------------------------------
     10. TICKER
     --------------------------------------------------------- */
  const tickerTrack = $("#tickerTrack");
  function startTicker() {
    if (!tickerTrack) return;
    const content = tickerTrack.innerHTML;
    tickerTrack.innerHTML = content + content; // duplicate for a seamless loop
    if (REDUCED) return;
    gsap.to(tickerTrack, {
      x: () => -(tickerTrack.scrollWidth / 2),
      duration: 28, ease: "none", repeat: -1
    });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startTicker);
  } else {
    startTicker();
  }

  /* ---------------------------------------------------------
     11. STATEMENT — word-by-word highlight
     --------------------------------------------------------- */
  const statement = $("#statementText");
  if (statement) {
    // split into words without breaking the <em> markup
    const words = [];
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          frag.appendChild(s);
          words.push(s);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    Array.from(statement.childNodes).forEach(walk);

    gsap.to(words, {
      color: "#F4EEE4", stagger: 0.3, ease: "none",
      scrollTrigger: { trigger: statement, start: "top 72%", end: "bottom 42%", scrub: 0.6 }
    });
  }

  /* ---------------------------------------------------------
     12. TIMELINE
     --------------------------------------------------------- */
  const tlFill = $("#tlFill");
  const timeline = $(".timeline");
  if (tlFill && timeline) {
    gsap.to(tlFill, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: $(".tl"), start: "top 60%", end: "bottom 75%", scrub: 0.4 }
    });
  }

  /* ---------------------------------------------------------
     13. GALLERY — horizontal scroll (desktop) / native (mobile)
     --------------------------------------------------------- */
  const galWrap = $("#galWrap");
  const galTrack = $("#galTrack");
  if (galWrap && galTrack) {
    const mm = gsap.matchMedia ? gsap.matchMedia() : null;

    const setupDesktop = () => {
      const distance = () => Math.max(0, galTrack.scrollWidth - window.innerWidth + 80);
      gsap.to(galTrack, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: galWrap,
          start: "top top",
          end: () => "+=" + (distance() + window.innerHeight * 0.4),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    };

    if (mm) {
      mm.add("(min-width: 901px)", setupDesktop);
    } else {
      const onResize = () => { if (window.innerWidth > 900) setupDesktop(); };
      onResize();
    }
  }

  /* ---------------------------------------------------------
     14. LIGHTBOX
     --------------------------------------------------------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  let lbIndex = 0;
  const cards = $$(".gal-card");

  function showLb(i) {
    if (!cards.length) return;
    lbIndex = (i + cards.length) % cards.length;
    const card = cards[lbIndex];
    const img = $("img", card);
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt") || "";
    lbCap.textContent = card.dataset.caption || "";
    if (!REDUCED) {
      gsap.fromTo(lbImg, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(lbCap, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.08 });
    } else {
      lbImg.style.opacity = 1; lbCap.style.opacity = 1;
    }
  }

  function openLb(i) {
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    showLb(i);
    $("#lbClose").focus();
  }
  function closeLb() {
    if (REDUCED) { lb.hidden = true; document.body.style.overflow = ""; if (lenis) lenis.start(); return; }
    gsap.to(lbImg, { opacity: 0, duration: 0.3, onComplete: () => {
      lb.hidden = true; document.body.style.overflow = ""; if (lenis) lenis.start();
    }});
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", () => openLb(i));
  });
  if (lb) {
    $("#lbClose").addEventListener("click", closeLb);
    $("#lbPrev").addEventListener("click", () => showLb(lbIndex - 1));
    $("#lbNext").addEventListener("click", () => showLb(lbIndex + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
    });
  }

  /* ---------------------------------------------------------
     15. FAQ ACCORDION
     --------------------------------------------------------- */
  $$(".faq-item").forEach((item) => {
    const btn = $(".faq-q", item);
    const panel = $(".faq-a", item);
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      $$(".faq-item.is-open").forEach((other) => {
        if (other === item) return;
        other.classList.remove("is-open");
        $(".faq-q", other).setAttribute("aria-expanded", "false");
        gsap.to($(".faq-a", other), { height: 0, duration: 0.45, ease: "power2.inOut" });
      });
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      gsap.to(panel, {
        height: isOpen ? 0 : "auto",
        duration: 0.55, ease: "power3.inOut"
      });
    });
  });

  /* ---------------------------------------------------------
     16. MAGNETIC BUTTONS
     --------------------------------------------------------- */
  if (!REDUCED && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------------------------------------------------------
     17. BOOT
     --------------------------------------------------------- */
  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    setTimeout(runLoader, REDUCED ? 0 : 180);
  };
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
