/* Power House Gym — shared behaviour
   Performance rules: rAF-throttled pointer work, transform/opacity only,
   everything degrades gracefully without GSAP. */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && typeof window.ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
  if (prefersReduced || !hasGsap) document.documentElement.classList.add("no-anim");

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector(".burger");
  var navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.textContent = open ? "✕" : "☰";
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { navLinks.classList.remove("open"); burger.textContent = "☰"; }
    });
  }

  /* ---------- scroll progress (rAF) ---------- */
  var bar = document.getElementById("progressBar");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      if (bar && max > 0) bar.style.width = (h.scrollTop / max) * 100 + "%";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- smooth scroll (Lenis, desktop, motion-safe) ---------- */
  var lenis = null;
  try {
    if (!prefersReduced && typeof window.Lenis !== "undefined" && window.innerWidth > 760) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (hasGsap && typeof window.ScrollTrigger !== "undefined") lenis.on("scroll", ScrollTrigger.update);
    }
  } catch (e) { lenis = null; }

  /* ---------- page wipe (in) ---------- */
  var wipe = document.querySelector(".wipe");
  if (wipe && hasGsap && !prefersReduced) {
    gsap.fromTo(wipe, { scaleY: 1, transformOrigin: "bottom" }, { scaleY: 0, duration: .7, ease: "power3.inOut", delay: .05 });
  }

  /* ---------- hero intro + reveals ---------- */
  if (hasGsap && !prefersReduced) {
    gsap.utils.toArray(".hero h1 .line > span").forEach(function (el, i) {
      gsap.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 1, delay: .15 + i * .12, ease: "power4.out" });
    });
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(el, { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, ease: "power3.out",
        delay: parseFloat(el.getAttribute("data-delay") || 0),
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
    /* parallax images */
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
  }

  /* ---------- 3D hero stage (mouse depth) ---------- */
  var stage = document.querySelector(".stage-inner");
  if (stage && finePointer && !prefersReduced) {
    var layers = stage.querySelectorAll("[data-depth]");
    var rx = 0, ry = 0, tx = 0, ty = 0, rafId = null;
    function loop() {
      rx += (tx - rx) * .07; ry += (ty - ry) * .07;
      stage.style.transform = "rotateX(" + (-ry * 4).toFixed(2) + "deg) rotateY(" + (rx * 5).toFixed(2) + "deg)";
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-depth")) || 20;
        el.style.transform = "translate3d(" + (rx * d).toFixed(1) + "px," + (ry * d).toFixed(1) + "px,0)";
      });
      if (Math.abs(tx - rx) > .001 || Math.abs(ty - ry) > .001) rafId = requestAnimationFrame(loop);
      else rafId = null;
    }
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2;
      ty = ((e.clientY - r.top) / r.height - .5) * 2;
      if (!rafId) rafId = requestAnimationFrame(loop);
    });
    stage.addEventListener("pointerleave", function () { tx = 0; ty = 0; if (!rafId) rafId = requestAnimationFrame(loop); });
  }

  /* ---------- tilt cards + shine ---------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      var raf = null, nx = 0, ny = 0;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        nx = (e.clientX - r.left) / r.width; ny = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", nx * 100 + "%");
        card.style.setProperty("--my", ny * 100 + "%");
        if (raf) return;
        raf = requestAnimationFrame(function () {
          card.style.transform = "perspective(900px) rotateX(" + ((.5 - ny) * 7).toFixed(2) + "deg) rotateY(" + ((nx - .5) * 9).toFixed(2) + "deg) translateY(-3px)";
          raf = null;
        });
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ---------- custom cursor ---------- */
  var cursor = document.getElementById("cursor");
  if (cursor && finePointer && !prefersReduced) {
    var ring = cursor.querySelector(".cursor-ring");
    var dot = cursor.querySelector(".cursor-dot");
    var mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function cur() {
      cx += (mx - cx) * .16; cy += (my - cy) * .16;
      if (dot) dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      if (ring) ring.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(cur);
    })();
    document.querySelectorAll("a,button,.photo-card,.tilt").forEach(function (el) {
      el.addEventListener("pointerenter", function () {
        if (el.classList.contains("photo-card")) cursor.classList.add("is-view");
        if (ring && el.classList.contains("photo-card")) ring.querySelector("span").textContent = "View";
      });
      el.addEventListener("pointerleave", function () { cursor.classList.remove("is-view"); });
    });
  }

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var target = parseFloat(en.target.getAttribute("data-count"));
        var dec = (en.target.getAttribute("data-count").split(".")[1] || "").length;
        var suffix = en.target.getAttribute("data-suffix") || "";
        if (prefersReduced || !hasGsap) { en.target.textContent = target.toFixed(dec) + suffix; return; }
        var obj = { v: 0 };
        gsap.to(obj, { v: target, duration: 1.6, ease: "power2.out", onUpdate: function () { en.target.textContent = obj.v.toFixed(dec) + suffix; } });
      });
    }, { threshold: .4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------- pricing toggle ---------- */
  var toggleBtns = document.querySelectorAll(".toggle button");
  if (toggleBtns.length) {
    toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var mode = btn.getAttribute("data-mode");
        document.querySelectorAll("[data-price-monthly]").forEach(function (el) {
          var m = el.getAttribute("data-price-monthly"), q = el.getAttribute("data-price-quarter");
          el.innerHTML = (mode === "quarter" && q ? q : m);
        });
        document.querySelectorAll("[data-per]").forEach(function (el) {
          el.textContent = mode === "quarter" ? "/ 3 months" : "/ month";
        });
      });
    });
  }

  /* ---------- gallery filter + lightbox ---------- */
  var filterBtns = document.querySelectorAll(".filters button");
  var figs = document.querySelectorAll(".masonry figure");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      figs.forEach(function (fig) {
        fig.classList.toggle("hide", f !== "all" && fig.getAttribute("data-cat") !== f);
      });
    });
  });
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img"), lbCap = lightbox.querySelector("p");
    figs.forEach(function (fig) {
      fig.addEventListener("click", function () {
        var img = fig.querySelector("img");
        lbImg.src = img.src; lbImg.alt = img.alt;
        var cap = fig.querySelector("figcaption");
        lbCap.textContent = cap ? cap.textContent.trim() : img.alt;
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", function (e) { if (e.target !== lbImg) lightbox.classList.remove("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lightbox.classList.remove("open"); });
  }

  /* ---------- trial form -> WhatsApp + inline confirm ---------- */
  document.querySelectorAll("form[data-trial]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector("[name=name]") || {}).value || "Member";
      var goal = (form.querySelector("[name=goal]") || {}).value || "General fitness";
      var phone = (form.querySelector("[name=phone]") || {}).value || "";
      var ok = form.parentElement.querySelector(".form-ok");
      if (ok) { ok.classList.add("show"); ok.textContent = "Shukriya, " + name.split(" ")[0] + "! Aapki request note kar li hai. Team isi number par rabta karegi: " + (phone || "—") + ". Jaldi milte hain, Y-Block mein."; ok.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" }); }
      var msg = encodeURIComponent("Assalam-o-Alaikum Power House Gym! Main " + name + " hoon. Mujhe trial session chahiye. Mera goal: " + goal + ". Mera number: " + phone);
      var wa = document.getElementById("waSend");
      if (wa) { wa.href = "https://wa.me/923217593916?text=" + msg; wa.style.display = "inline-flex"; }
      form.reset();
    });
  });

  /* ---------- BMI calculator ---------- */
  var bmiForm = document.getElementById("bmiForm");
  if (bmiForm) {
    bmiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var w = parseFloat(document.getElementById("bmiW").value);
      var hCm = parseFloat(document.getElementById("bmiH").value);
      var out = document.getElementById("bmiOut"), note = document.getElementById("bmiNote"), dot = document.getElementById("bmiDot");
      if (!w || !hCm) return;
      var bmi = w / Math.pow(hCm / 100, 2);
      out.textContent = bmi.toFixed(1);
      var pct = Math.min(96, Math.max(4, ((bmi - 14) / (36 - 14)) * 100));
      if (dot) dot.style.left = pct + "%";
      note.textContent = bmi < 18.5 ? "Underweight range — strength + surplus plan suit karega. Coach se free assessment lein." :
        bmi < 25 ? "Healthy range — ab goal performance ya muscle par rakhein. Great base!" :
        bmi < 30 ? "Overweight range — fat-loss plan + cardio block best rahega. Pehla trial free mein book karein." :
        "Obese range — ghabrana nahi, structured shuruaat sab se best hai. Coach low-impact plan banayega.";
    });
  }

  /* ---------- year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
