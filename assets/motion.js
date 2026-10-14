/* Antiquariato Angelo · motion (GSAP + ScrollTrigger only, native scrolling)
   - Without GSAP, or with reduced motion, every page is complete and still.
   - Each block runs only if its elements exist on the current page.
   - Wide screens: parallax, magnetic buttons, pinned "up close" scene, lens.
     Phones: light reveals only. */
(function () {
  var root = document.documentElement;
  function release() { root.classList.remove("intro-pending"); }
  if (!window.gsap || !window.ScrollTrigger) { root.classList.add("no-motion-lib"); release(); return; }
  gsap.registerPlugin(ScrollTrigger);
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return gsap.utils.toArray(s); };
  var has = function (s) { return !!document.querySelector(s); };

  // floating pill header after the first scroll
  ScrollTrigger.create({ start: 40, end: "max", onToggle: function (self) { root.classList.toggle("is-scrolled", self.isActive); } });

  var mm = gsap.matchMedia();
  mm.add({ wide: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)", fine: "(pointer: fine)" }, function (ctx) {
    var c = ctx.conditions, wide = c.wide, cleanups = [];
    if (!c.motion) { release(); return; }

    /* 1. Page intro: header, heading words, then the rest.
       The CSS start state is removed first, so GSAP never mistakes it
       for the words' resting position (that left the title half hidden). */
    release();
    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.fromTo("[data-intro-head]", { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0);
    if (has("main h1 [data-word]")) intro.fromTo("main h1 [data-word]", { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.15);
    if (has("[data-intro]")) intro.fromTo("[data-intro]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.45);
    if (has("[data-intro-chip]")) intro.fromTo("[data-intro-chip]", { autoAlpha: 0, y: 16, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.6)" }, 0.9);
    if (has(".gallery__main")) {
      intro.fromTo(".gallery__main", { clipPath: "inset(8% 8% 8% 8% round 36px)", autoAlpha: 0 }, { clipPath: "inset(0% 0% 0% 0% round 28px)", autoAlpha: 1, duration: 1.3, ease: "power4.inOut", clearProps: "clipPath" }, 0.1)
           .fromTo(".gallery__main img", { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0.1);
      if (has(".gallery__thumbs li")) intro.fromTo(".gallery__thumbs li", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.8);
    }
    release();
    var introGuard = setTimeout(function () { if (intro.progress() < 1) intro.progress(1); gsap.set("main h1 [data-word]", { y: 0, yPercent: 0 }); }, 3500);
    cleanups.push(function () { clearTimeout(introGuard); });

    /* 2-3. Section headings and blocks: revealed when they enter the screen.
       IntersectionObserver is used because it keeps working inside frames;
       a safety net shows anything still hidden after a few seconds on screen. */
    var pending = [];
    $$("main h2").forEach(function (h) {
      var w = h.querySelectorAll("[data-word]"); if (!w.length) return;
      gsap.set(w, { y: 0, yPercent: 110 });
      pending.push({ el: h, play: function () { gsap.to(w, { y: 0, yPercent: 0, duration: 1.1, stagger: 0.08, ease: "power3.out", overwrite: true }); } });
    });
    $$("[data-reveal]").forEach(function (el, i) {
      gsap.set(el, { autoAlpha: 0, y: 40 });
      pending.push({ el: el, play: function () { gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, delay: (i % 3) * 0.1, ease: "power3.out", overwrite: true }); } });
    });
    var reveal = function (item) { if (item.done) return; item.done = true; item.play(); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        pending.forEach(function (it) { if (it.el === en.target) reveal(it); });
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    pending.forEach(function (it) { io.observe(it.el); });
    var net = setInterval(function () {
      pending.forEach(function (it) { if (!it.done && it.el.getBoundingClientRect().top < innerHeight) reveal(it); });
    }, 1500);
    cleanups.push(function () { io.disconnect(); clearInterval(net); pending.forEach(function (it) { if (!it.done) it.play(); }); });

    /* 4. Home: scrolling away from the first screen */
    if (has(".hero") && wide) {
      var away = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero__text", { yPercent: -12, autoAlpha: 0.4, ease: "none", scrollTrigger: away });
      gsap.to(".visit-card", { y: -30, ease: "none", scrollTrigger: away });
    }

    /* 5. Home: the statement lines draw in, one after another */
    if (has(".statement")) {
      gsap.timeline({ scrollTrigger: { trigger: ".statement", start: "top 78%", once: true } })
        .fromTo(".statement__rule", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .fromTo(".statement__kicker, .statement__info", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }, 0.3);
    }

    /* 6. Home: category marquee speeds up while scrolling */
    var track = $(".marquee__track");
    if (track && track.getAnimations) {
      var anim = track.getAnimations()[0];
      if (anim) ScrollTrigger.create({ trigger: ".marquee", start: "top bottom", end: "bottom top", onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 600, 4);
        gsap.to(anim, { playbackRate: 1 + v, duration: 0.3, overwrite: true, onComplete: function () { gsap.to(anim, { playbackRate: 1, duration: 1.2 }); } });
      } });
    }

    /* 7. Home: "up close" room. Wide screens pin it: whole piece, face, rose */
    if (has(".feature")) {
      gsap.fromTo(".feature__pin", { scale: 0.94, borderRadius: 48 }, { scale: 1, borderRadius: 24, ease: "none", scrollTrigger: { trigger: ".feature", start: "top bottom", end: "top top", scrub: true } });
      if (wide) {
        root.classList.add("is-pinned");
        var steps = $$(".feature .step"), img = $(".feature__img"), bar = $(".feature__progress i");
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 14 });
        var focus = function (fx, fy, s) {
          var lim = (s - 1) / 2 * 100, cl = function (v) { return Math.max(-lim, Math.min(lim, v)); };
          return { scale: s, xPercent: cl(-(fx - 0.5) * 100 * s), yPercent: cl(-(fy - 0.5) * 100 * s) };
        };
        var pts = (($(".feature__stage") || {}).getAttribute ? $(".feature__stage").getAttribute("data-focus") : "") || "0.5,0.38,2.2;0.38,0.72,2.5";
        pts = pts.split(";").map(function (p) { return p.split(",").map(Number); });
        gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: ".feature", start: "top top", end: "+=240%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (self) { if (bar) bar.style.transform = "scaleX(" + self.progress.toFixed(3) + ")"; } } })
          .to({}, { duration: 0.35 })
          .to(img, Object.assign({ duration: 1 }, focus(pts[0][0], pts[0][1], pts[0][2])))
          .to(steps[0], { autoAlpha: 0, y: -14, duration: 0.3 }, "<0.2").to(steps[1], { autoAlpha: 1, y: 0, duration: 0.35 }, "<0.15")
          .to({}, { duration: 0.4 })
          .to(img, Object.assign({ duration: 1 }, focus(pts[1][0], pts[1][1], pts[1][2])))
          .to(steps[1], { autoAlpha: 0, y: -14, duration: 0.3 }, "<0.2").to(steps[2], { autoAlpha: 1, y: 0, duration: 0.35 }, "<0.15")
          .to({}, { duration: 0.5 });
        cleanups.push(function () { root.classList.remove("is-pinned"); });
      } else {
        $$(".feature .frame, .feature .crop").forEach(function (el) {
          gsap.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
      }
    }

    /* 8. Cards (home, catalogue, related): rise from their mats */
    var cards = $$(".card");
    if (cards.length) {
      gsap.set(cards, { autoAlpha: 0, y: 60 });
      var shownCard = function (cd, d) {
        if (cd._in) return; cd._in = true;
        gsap.to(cd, { autoAlpha: 1, y: 0, duration: 1.1, delay: d || 0, ease: "power3.out", overwrite: true });
        var im = cd.querySelector(".card__media img");
        if (im) gsap.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1.6, delay: d || 0, ease: "power2.out", clearProps: "transform" });
      };
      var cio = new IntersectionObserver(function (entries) {
        var k = 0;
        entries.forEach(function (en) { if (en.isIntersecting && !en.target.hidden) { shownCard(en.target, (k++) * 0.1); cio.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -5% 0px" });
      cards.forEach(function (cd) { cio.observe(cd); });
      var cnet = setInterval(function () { cards.forEach(function (cd) { if (!cd._in && !cd.hidden && cd.getBoundingClientRect().top < innerHeight) shownCard(cd); }); }, 1500);
      var onUpdate = function () { ScrollTrigger.refresh(); cards.forEach(function (cd) { if (!cd._in && !cd.hidden) cio.observe(cd); }); };
      document.addEventListener("catalog:update", onUpdate);
      cleanups.push(function () { cio.disconnect(); clearInterval(cnet); document.removeEventListener("catalog:update", onUpdate); cards.forEach(function (cd) { gsap.set(cd, { clearProps: "all" }); }); });
    }

    /* 9. Home: category tiles drift; dark panels grow in */
    if (wide) $$(".cat-tile img").forEach(function (im) {
      gsap.fromTo(im, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: im.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });
    $$(".visit__panel, .trade__panel, .sell__panel").forEach(function (p) {
      gsap.fromTo(p, { scale: 0.95, borderRadius: 48 }, { scale: 1, borderRadius: 24, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "top 40%", scrub: true } });
    });

    /* 10. Story page: photos move gently inside their frames */
    if (wide) $$(".story__clip img").forEach(function (im) {
      gsap.fromTo(im, { yPercent: -4, scale: 1.1 }, { yPercent: 4, scale: 1.1, ease: "none", scrollTrigger: { trigger: im.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* 11. Mouse only: magnetic buttons and a magnifying lens on every piece */
    if (wide && c.fine) {
      $$(".magnetic").forEach(function (el) {
        var xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }), yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        var move = function (e) { var r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.25); yTo((e.clientY - r.top - r.height / 2) * 0.35); };
        var leave = function () { xTo(0); yTo(0); };
        el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
        cleanups.push(function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); gsap.set(el, { x: 0, y: 0 }); });
      });
      $$(".card__media").forEach(function (media) {
        var im = media.querySelector("img"); if (!im) return;
        var lens = document.createElement("span"); lens.className = "lens"; lens.setAttribute("aria-hidden", "true"); media.appendChild(lens);
        var Z = 2.6, R = 84, xTo = gsap.quickTo(lens, "x", { duration: 0.35, ease: "power3.out" }), yTo = gsap.quickTo(lens, "y", { duration: 0.35, ease: "power3.out" });
        var enter2 = function () { lens.style.backgroundImage = 'url("' + (im.currentSrc || im.src) + '")'; gsap.to(lens, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)" }); };
        var move2 = function (e) {
          var r = media.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          xTo(x); yTo(y);
          lens.style.backgroundSize = (r.width * Z) + "px " + (r.height * Z) + "px";
          lens.style.backgroundPosition = (R - x * Z) + "px " + (R - y * Z) + "px";
        };
        var leave2 = function () { gsap.to(lens, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }); };
        media.addEventListener("pointerenter", enter2); media.addEventListener("pointermove", move2); media.addEventListener("pointerleave", leave2);
        cleanups.push(function () { media.removeEventListener("pointerenter", enter2); media.removeEventListener("pointermove", move2); media.removeEventListener("pointerleave", leave2); lens.remove(); });
      });
    }

    return function () { cleanups.forEach(function (f) { f(); }); };
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
