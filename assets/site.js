/* Antiquariato Angelo · interface (no libraries needed)
   - mobile menu (native <dialog>)
   - catalogue: search, sort, empty state, "show more"
   - item gallery: thumbnails, full-screen viewer with zoom, keyboard
   Everything is usable without this file: links and photos are plain HTML. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- mobile menu ---------- */
  var menu = $("#mobile-menu"), toggle = $(".menu-toggle");
  if (menu && toggle && menu.showModal) {
    toggle.addEventListener("click", function () {
      menu.showModal(); document.documentElement.style.overflow = "hidden"; toggle.setAttribute("aria-expanded", "true");
    });
    $(".mobile-menu__close", menu).addEventListener("click", function () { menu.close(); });
    menu.addEventListener("close", function () {
      document.documentElement.style.overflow = ""; toggle.setAttribute("aria-expanded", "false"); toggle.focus();
    });
    menu.addEventListener("click", function (e) { if (e.target === menu || e.target.closest("a")) menu.close(); });
    matchMedia("(min-width: 1024px)").addEventListener("change", function (e) { if (e.matches && menu.open) menu.close(); });
  }

  /* ---------- catalogue ---------- */
  var cat = $("[data-catalog]");
  if (cat && $("[data-grid]", cat)) {
    var grid = $("[data-grid]", cat), cards = $$(".card", grid), input = $("[data-search]", cat), sort = $("[data-sort]", cat);
    var count = $("[data-count]", cat), empty = $("[data-empty]", cat), more = $("[data-more]", cat), reset = $("[data-reset]", cat);
    var size = +cat.getAttribute("data-page-size") || 24, shown = size;
    var norm = function (s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
    cards.forEach(function (c) { c._n = norm(c.getAttribute("data-name")); c._t = norm($(".card__title", c).textContent); });

    function apply(resetPaging) {
      if (resetPaging) shown = size;
      var q = norm(input.value.trim());
      var list = cards.filter(function (c) { return !q || c._n.indexOf(q) > -1; });
      list.sort(sort.value === "name"
        ? function (a, b) { return a._t.localeCompare(b._t); }
        : function (a, b) { return b.getAttribute("data-added").localeCompare(a.getAttribute("data-added")); });
      cards.forEach(function (c) { c.hidden = true; });
      list.forEach(function (c, i) { grid.appendChild(c); c.hidden = i >= shown; });
      var n = list.length;
      count.textContent = n === 1 ? count.getAttribute("data-one") : count.getAttribute("data-many").replace("{n}", n);
      empty.hidden = n > 0; grid.hidden = n === 0;
      more.hidden = n <= shown;
      document.dispatchEvent(new CustomEvent("catalog:update"));
    }
    var timer;
    input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { apply(true); }, 120); });
    sort.addEventListener("change", function () { apply(true); });
    more.addEventListener("click", function () { shown += size; apply(false); });
    reset.addEventListener("click", function () { input.value = ""; sort.value = "new"; apply(true); input.focus(); });
    apply(true);
  }

  /* ---------- item gallery + viewer ---------- */
  var gal = $("[data-gallery]");
  if (gal) {
    var main = $("[data-main]", gal), thumbs = $$("[data-thumb]", gal), box = $("[data-lightbox]", gal);
    var big = $("[data-big]", gal), stage = $("[data-stage]", gal), idx = 0;
    var srcs = thumbs.length ? thumbs.map(function (b) { return { src: b.getAttribute("data-src"), alt: b.getAttribute("data-alt") }; }) : [{ src: main.getAttribute("src"), alt: main.getAttribute("alt") }];

    function show(i) {
      idx = (i + srcs.length) % srcs.length;
      main.src = srcs[idx].src; main.alt = srcs[idx].alt;
      thumbs.forEach(function (b, j) { if (j === idx) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      if (box.open) { big.src = srcs[idx].src; big.alt = srcs[idx].alt; unzoom(); }
    }
    thumbs.forEach(function (b, j) { b.addEventListener("click", function () { show(j); }); });

    // viewer with zoom: click/tap toggles 2.5x at the pointer, then the photo follows the pointer
    var zoomed = false, Z = 2.5;
    function unzoom() { zoomed = false; stage.classList.remove("is-zoomed"); big.style.transform = ""; }
    function pan(e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      big.style.transformOrigin = (x * 100) + "% " + (y * 100) + "%";
    }
    stage.addEventListener("click", function (e) {
      if (e.target !== big) return;
      zoomed = !zoomed; stage.classList.toggle("is-zoomed", zoomed);
      if (zoomed) { pan(e); big.style.transform = "scale(" + Z + ")"; } else big.style.transform = "";
    });
    stage.addEventListener("pointermove", function (e) { if (zoomed) pan(e); });

    $("[data-open]", gal).addEventListener("click", function () {
      big.src = srcs[idx].src; big.alt = srcs[idx].alt; unzoom();
      if (box.showModal) { box.showModal(); document.documentElement.style.overflow = "hidden"; }
      else window.open(srcs[idx].src, "_blank");
    });
    box.addEventListener("close", function () { document.documentElement.style.overflow = ""; unzoom(); $("[data-open]", gal).focus(); });
    $("[data-close]", box).addEventListener("click", function () { box.close(); });
    var prev = $("[data-prev]", box), next = $("[data-next]", box);
    if (prev) prev.addEventListener("click", function () { show(idx - 1); });
    if (next) next.addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("keydown", function (e) {
      if (srcs.length < 2) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1); }
    });
    // swipe on touch screens
    var sx = null;
    stage.addEventListener("touchstart", function (e) { if (!zoomed) sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (sx === null || srcs.length < 2) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
  }
})();
