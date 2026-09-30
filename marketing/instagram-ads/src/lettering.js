/* Alfa Z · кампания 2 — «ерекше жазулар»: анимация надписей для видео (в паре с lettering.css).
   Все функции ДОБАВЛЯЮТ твины в ОДИН приостановленный GSAP-таймлайн (gsap.timeline({paused:true})); время `at` — абсолютное, в секундах
   таймлайна. Ничего не запускается само: кадр определяется только tl.time(t) → детерминированный seek (window.seek = t => tl.time(t)).
   Никаких rAF / setTimeout / Math.random. Всё, что меняется, — CSS-переменные (--lt-p, --lt-sdim), transform и opacity.
   Подключение:  <script src="../../../node_modules/gsap/dist/gsap.min.js"></script><script src="../../lettering.js"></script>
   (в видео-папке src/video-c2/<имя>/ путь к lettering.js — ../../lettering.js; CSS: ../../lettering.css, ../../fonts-c2.css)

   API (глобально доступно как L и как Lettering; el — элемент или CSS-селектор; каждая функция возвращает время окончания):

   L.write(tl, el, at, dur, {pen, gap, ease})
        Надпись «пишется» слева направо: слова по очереди открываются вайпом с мягким краем (время слова ∝ его длине).
        Работает по тексту внутри el на любой вложенности (в т.ч. внутри .lt-under/.lt-mark — их росчерки проявляются вместе со словом,
        если не вызвать для них L.draw). До момента `at` текст скрыт. pen:true — перо-маркер бежит за краем (.lt-pen), gap — доля dur на паузы между словами (0.05).
   L.erase(tl, el, at, dur, {ease})
        Обратное: надпись «стирается» (справа налево, по словам). Ожидается, что она была написана L.write либо видна целиком.
   L.strike(tl, el, at, dur, {dim, erase, ease})
        Штрих зачёркивает «тревогу»: на el появляется .lt-strike, рукописный штрих прорисовывается за dur, слово приглушается (dim: true|0…100|false).
        erase:true — после штриха слово ещё и растворяется («стёрли»).
   L.draw(tl, el, at, dur, {ease, dir, from})
        Прорисовка росчерка. el может быть:
          • HTML-элемент с росчерком (.lt-under/.lt-mark/.lt-circle/.lt-strike/.lt-arrow/.lt-ico) — проявление маской: линейный вайп по направлению рисования
            (dir — угол градиента в градусах, 90 = слева направо; для обводок — конический, from — начальный угол, по умолчанию 200);
          • SVG-геометрия (<path>, <line>, <circle>…) со stroke — классический stroke-dashoffset;
          • <svg> целиком — все его фигуры по очереди пропорционально длине.
   L.pop(tl, el, at, {dur, from, rot, ease})
        Пружинное появление (масштаб + лёгкий поворот + прозрачность, ease back.out(2.6)); «состояние покоя» берётся из CSS (поворот −3° у .lt-hand и т.п. сохраняется).
   L.split(el)  → массив <span class="lt-w"> (слова), идемпотентно.     L.words(el) — то же без побочных эффектов, если уже разбито.
   L.init(root) — проставляет data-t у .lt-orn (для статик-креативов вызывается автоматически при загрузке).
   L.audit(root) → массив предупреждений о нарушении правил читаемости (>6 слов в рукописном, кегль < 96 px, тонкое начертание).
   Через ?ltdebug=1 в адресе предупреждения audit выводятся в консоль. */
(function () {
  "use strict";
  var W = window;
  var PEN_PAD = 0.2;                       // отступ .lt-w по X (em), должен совпадать с lettering.css
  function $(x, root) { return typeof x === "string" ? (root || document).querySelector(x) : x; }
  function all(x) { return typeof x === "string" ? Array.prototype.slice.call(document.querySelectorAll(x)) : (x && x.length !== undefined && !x.nodeType ? Array.prototype.slice.call(x) : [x]); }
  function g() { if (!W.gsap) throw new Error("lettering.js: gsap не подключён"); return W.gsap; }

  /* ── разбиение на слова ── */
  function split(el) {
    el = $(el);
    if (el.__ltWords) return el.__ltWords;
    var out = [];
    (function walk(node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.nodeValue.split(/(\s+)/);
          if (parts.join("").trim() === "") return;
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (p === "") return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement("span"); s.className = "lt-w"; s.textContent = p;
            frag.appendChild(s); out.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !/^(br|svg|i|img)$/i.test(n.tagName) && !n.classList.contains("lt-w") && !n.classList.contains("lt-pen") && !n.classList.contains("lt-ico") && !n.classList.contains("lt-arrow")) {
          walk(n);
        }
      });
    })(el);
    // порядок слов — как в документе (walk уже так и идёт)
    el.__ltWords = out;
    return out;
  }
  function words(el) { el = $(el); return el.__ltWords || split(el); }

  /* смещение узла относительно el по цепочке offsetParent (слова могут лежать внутри позиционированных .lt-under/.lt-mark) */
  function offsetIn(node, el) {
    var x = 0, y = 0, n = node;
    while (n && n !== el && n.offsetParent !== undefined) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x: x, y: y };
  }

  /* ── написание ── */
  function write(tl, el, at, dur, o) {
    o = o || {}; el = $(el);
    var ws = split(el); if (!ws.length) return at;
    var n = ws.length, weights = ws.map(function (w) { return w.textContent.length + 1.2; });
    var tot = weights.reduce(function (a, b) { return a + b; }, 0);
    var gap = o.gap == null ? 0.05 : o.gap;
    var active = dur * (1 - gap), pause = n > 1 ? (dur * gap) / (n - 1) : 0;
    var pen = null;
    if (o.pen) {
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      pen = el.querySelector(":scope > .lt-pen");
      if (!pen) { pen = document.createElement("i"); pen.className = "lt-pen"; el.appendChild(pen); }
      g().set(pen, { opacity: 0 });
    }
    var t = at;
    ws.forEach(function (w, i) {
      var d = active * weights[i] / tot;
      tl.fromTo(w, { "--lt-p": 0 }, { "--lt-p": 115, duration: d, ease: o.ease || "none" }, t);
      if (pen) {
        var fs = parseFloat(getComputedStyle(el).fontSize) || 100, pad = fs * PEN_PAD;
        var off = offsetIn(w, el), x0 = off.x + pad, x1 = off.x + w.offsetWidth - pad, y = off.y + w.offsetHeight * 0.66;
        tl.set(pen, { x: x0, y: y, opacity: 1 }, t);
        tl.fromTo(pen, { x: x0 }, { x: x1, duration: d, ease: "none", immediateRender: false }, t);
        tl.fromTo(pen, { y: y + fs * 0.02 }, { y: y - fs * 0.05, duration: d, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, t);
      }
      t += d + pause;
    });
    if (pen) tl.to(pen, { opacity: 0, duration: 0.2, ease: "none" }, at + dur);
    return at + dur;
  }

  function erase(tl, el, at, dur, o) {
    o = o || {}; el = $(el);
    var ws = split(el).slice().reverse(); if (!ws.length) return at;
    var d = dur / ws.length;
    ws.forEach(function (w, i) {
      tl.to(w, { "--lt-p": 0, duration: d, ease: o.ease || "none" }, at + i * d);
    });
    return at + dur;
  }

  /* ── зачёркивание ── */
  function strike(tl, el, at, dur, o) {
    o = o || {}; el = $(el);
    el.classList.add("lt-strike");
    tl.fromTo(el, { "--lt-p": 0, "--lt-sdim": 0 }, { "--lt-p": 115, duration: dur, ease: o.ease || "power2.inOut" }, at);
    if (o.dim !== false) {
      var dimTo = o.dim == null || o.dim === true ? 100 : +o.dim;
      tl.to(el, { "--lt-sdim": dimTo, duration: Math.max(0.25, dur * 0.6), ease: "none" }, at + dur * 0.45);
    }
    var end = at + dur;
    if (o.erase) {
      var ed = o.eraseDur || 0.4;
      tl.to(el, { opacity: 0, y: -8, duration: ed, ease: "power1.in" }, end + (o.eraseDelay == null ? 0.25 : o.eraseDelay));
      end += (o.eraseDelay == null ? 0.25 : o.eraseDelay) + ed;
    }
    return end;
  }

  /* ── прорисовка росчерка ── */
  var SVGNS = "http://www.w3.org/2000/svg";
  function isGeom(e) { return e && e.nodeType === 1 && typeof e.getTotalLength === "function"; }
  function draw(tl, el, at, dur, o) {
    o = o || {}; el = $(el);
    var ease = o.ease || "power1.inOut";
    if (isGeom(el)) {
      var L_ = el.getTotalLength();
      tl.fromTo(el, { strokeDasharray: L_, strokeDashoffset: L_ }, { strokeDashoffset: 0, duration: dur, ease: ease }, at);
      return at + dur;
    }
    if (el instanceof SVGElement && el.tagName.toLowerCase() === "svg") {
      var gs = Array.prototype.slice.call(el.querySelectorAll("path,line,polyline,polygon,circle,ellipse,rect")).filter(isGeom);
      var lens = gs.map(function (p) { return p.getTotalLength(); }), sum = lens.reduce(function (a, b) { return a + b; }, 0) || 1, t = at;
      gs.forEach(function (p, i) {
        var d = dur * lens[i] / sum;
        tl.fromTo(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }, { strokeDashoffset: 0, duration: d, ease: "none" }, t); t += d;
      });
      return at + dur;
    }
    if (o.dir != null) el.style.setProperty("--lt-wa", o.dir + "deg");
    if (o.from != null) el.style.setProperty("--lt-a0", o.from + "deg");
    tl.fromTo(el, { "--lt-p": 0 }, { "--lt-p": 115, duration: dur, ease: ease }, at);
    return at + dur;
  }

  /* ── пружинное появление ── */
  function pop(tl, el, at, o) {
    o = o || {}; el = $(el);
    var G = g(), dur = o.dur || 0.6, k = o.from == null ? 0.25 : o.from;
    var sx = G.getProperty(el, "scaleX"), sy = G.getProperty(el, "scaleY"), r = G.getProperty(el, "rotation") || 0;
    tl.fromTo(el, { scaleX: sx * k, scaleY: sy * k, rotation: r + (o.rot == null ? -14 : o.rot), opacity: 0 },
      { scaleX: sx, scaleY: sy, rotation: r, duration: dur, ease: o.ease || "back.out(2.6)" }, at);
    tl.to(el, { opacity: 1, duration: Math.min(0.2, dur * 0.35), ease: "none" }, at);
    return at + dur;
  }

  /* ── служебное ── */
  function init(root) {
    all(".lt-orn").forEach(function (e) { if (!e.getAttribute("data-t")) e.setAttribute("data-t", e.textContent.replace(/\s+/g, " ").trim()); });
  }
  function audit(root) {
    var out = [];
    Array.prototype.forEach.call((root || document).querySelectorAll(".lt-hand,.lt-hand2,.lt-note"), function (e) {
      if (e.closest("[data-lt-skip]")) return;
      var txt = e.textContent.replace(/\s+/g, " ").trim(), n = txt ? txt.split(" ").length : 0, cs = getComputedStyle(e), fs = parseFloat(cs.fontSize);
      var id = (e.className + "").split(" ").slice(0, 2).join(".") + " «" + txt.slice(0, 28) + "»";
      if (n > 6) out.push(id + ": слов " + n + " > 6 — рукописный только для коротких фраз");
      if (fs < 95.5) out.push(id + ": кегль " + Math.round(fs) + "px < 96");
      if (+cs.fontWeight < 600 && !e.classList.contains("lt-hand2")) out.push(id + ": тонкое начертание (" + cs.fontWeight + ")");
    });
    return out;
  }

  var API = { write: write, erase: erase, strike: strike, draw: draw, pop: pop, split: split, words: words, init: init, audit: audit };
  W.Lettering = API; if (!W.L) W.L = API;
  init();
  W.addEventListener("load", function () { init(); });   // на случай, если словарь i18n подставлен уже после этого скрипта
  try { if (/[?&]ltdebug=1/.test(location.search)) { var a = audit(); if (a.length) console.warn("lettering audit:\n" + a.join("\n")); } } catch (e) {}
})();
