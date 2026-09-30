/* V1 · «Зритель → Создатель» — единый приостановленный GSAP-таймлайн.
   Контракт с render-video.mjs: window.__duration, window.seek(t), window.__cues, window.__music.
   Никаких CSS-анимаций / rAF / setTimeout / Math.random: случайность — только seeded PRNG. */
(function () {
  "use strict";

  // ── тайминги сцен (сек) ──
  const T = [0, 2.4, 5.0, 10.5, 14.8, 19.5];
  const DUR = 25.0;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // seeded PRNG (mulberry32)
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // звуковые метки
  const cues = [];
  function cue(t, type, gain, pan) {
    const c = { t: Math.round(t * 1000) / 1000, type: type };
    if (gain != null) c.gain = gain;
    if (pan) c.pan = pan;
    cues.push(c);
  }

  const tl = gsap.timeline({ paused: true });

  const show = (sel, t) => tl.set(sel, { visibility: "visible" }, t);
  const hide = (sel, t) => tl.set(sel, { visibility: "hidden" }, t);

  function sparkle(parent, x, y, size, color) {
    const d = document.createElement("div");
    d.className = "spark";
    d.style.left = x + "px"; d.style.top = y + "px";
    d.style.width = size + "px"; d.style.height = size + "px";
    d.innerHTML = '<svg style="fill:' + color + '"><use href="#i-star"/></svg>';
    parent.appendChild(d);
    return d;
  }

  /* ═══════════════ ПОДГОТОВКА DOM ═══════════════ */

  // лента (серые карточки) для сцены 1
  (function buildFeed() {
    let h = "";
    for (let i = 0; i < 9; i++) {
      h += '<div class="fc"><div class="fh"><i class="av"></i><div><b style="width:' + (170 + (i * 47) % 110) + 'px"></b><b style="width:' + (96 + (i * 31) % 60) + 'px"></b></div></div>' +
        '<div class="fi v' + (i % 4) + '"><s></s></div><div class="fa"><i></i><i></i><i></i></div></div>';
    }
    $("#fl").innerHTML = h;
  })();

  // код для сцены 3 (посимвольно)
  const CODE = [
    [["n", "name"], ["p", " = "], ["f", "input"], ["p", "("], ["s", "\"Как тебя зовут?\""], ["p", ")"]],
    [["n", "quiz"], ["p", " = "], ["f", "make_quiz"], ["p", "("], ["s", "\"Какой ты герой?\""], ["p", ")"]],
    [["n", "quiz"], ["p", "."], ["f", "run"], ["p", "()"]],
  ];
  const lineLens = [];
  (function buildCode() {
    let h = '<i class="cr cr0"></i>';
    CODE.forEach(function (toks) {
      let n = 0;
      h += '<span class="ln">';
      toks.forEach(function (tk) {
        for (const c of tk[1]) { h += '<span class="ch k-' + tk[0] + '">' + c + '<i class="cr"></i></span>'; n++; }
      });
      h += "</span>";
      lineLens.push(n);
    });
    $("#code3").innerHTML = h;
  })();

  /* ═══════════════ НАЧАЛЬНЫЕ СОСТОЯНИЯ ═══════════════ */
  gsap.set("#ph1", { transformOrigin: "50% 0%", rotation: -3 });
  gsap.set(".bricks .br", { transformOrigin: "50% 100%" });
  gsap.set("#msgL", { transformOrigin: "0% 100%" });
  gsap.set("#msgR .bub", { transformOrigin: "100% 100%" });
  gsap.set("#win3", { transformOrigin: "50% 0%" });
  gsap.set("#stk6", { transformOrigin: "50% 50%", rotation: -9 });

  /* ═══════════════ ПЕРЕХОДЫ ═══════════════ */
  // T1 (2.4): косой «удар» справа
  show("#s2", T[1] - 0.01);
  tl.fromTo("#s2", { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
    { clipPath: "polygon(-65% 0%, 100% 0%, 100% 100%, -35% 100%)", duration: 0.62, ease: "power4.out" }, T[1]);
  tl.to("#s1", { x: -240, duration: 0.6, ease: "power3.out" }, T[1]);
  hide("#s1", T[1] + 0.62);
  cue(T[1] - 0.28, "whoosh", 1.0);

  // T2 (5.0): круговое раскрытие
  show("#s3", T[2] - 0.12);
  tl.fromTo("#s3", { clipPath: "circle(0% at 50% 44%)" },
    { clipPath: "circle(150% at 50% 44%)", duration: 0.7, ease: "power3.inOut" }, T[2] - 0.1);
  hide("#s2", T[2] + 0.66);
  cue(T[2] - 0.3, "whoosh", 1.0);

  // T3 (10.5): занавес снизу
  show("#s4", T[3] - 0.01);
  tl.fromTo("#s4", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
    { clipPath: "polygon(0% -60%, 100% -30%, 100% 100%, 0% 100%)", duration: 0.66, ease: "power4.out" }, T[3]);
  tl.to("#s3", { y: -160, duration: 0.6, ease: "power3.out" }, T[3]);
  hide("#s3", T[3] + 0.64);
  cue(T[3] - 0.28, "whoosh", 1.0);

  // T4 (14.8): косой «удар» слева
  show("#s5", T[4] - 0.01);
  tl.fromTo("#s5", { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
    { clipPath: "polygon(0% 0%, 165% 0%, 135% 100%, 0% 100%)", duration: 0.62, ease: "power4.out" }, T[4]);
  tl.to("#s4", { x: 200, duration: 0.6, ease: "power3.out" }, T[4]);
  hide("#s4", T[4] + 0.62);
  cue(T[4] - 0.28, "whoosh", 1.0);

  // T5 (19.5): круговое раскрытие снизу
  show("#s6", T[5] - 0.12);
  tl.fromTo("#s6", { clipPath: "circle(0% at 50% 62%)" },
    { clipPath: "circle(150% at 50% 62%)", duration: 0.7, ease: "power3.inOut" }, T[5] - 0.1);
  hide("#s5", T[5] + 0.66);
  cue(T[5] - 0.3, "whoosh", 1.0);

  /* ═══════════════ СЦЕНА 1 · ХУК (0–2.4) ═══════════════ */
  // лента ползёт и ускоряется — «затягивает»
  tl.fromTo("#fl", { y: 0 }, { y: -2300, duration: T[1], ease: "power1.in" }, 0);
  tl.fromTo("#ph1", { scale: 1, y: 0 }, { scale: 1.07, y: -40, duration: T[1], ease: "sine.in" }, 0);
  tl.fromTo("#s1 .g1", { scale: 1, opacity: 0.85 }, { scale: 1.12, opacity: 1, duration: T[1], ease: "sine.inOut" }, 0);

  function bubbleIn(sel, t, rot, dx) {
    tl.fromTo(sel, { scale: 0.2, opacity: 0, y: 70, x: dx, rotation: rot * 2.5 },
      { scale: 1, opacity: 1, y: 0, x: 0, rotation: rot, duration: 0.55, ease: "back.out(2)" }, t);
    tl.fromTo(sel + " .bd", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(3.2)" }, t + 0.14);
    tl.to(sel, { y: -18, duration: 1.4, ease: "sine.inOut" }, t + 0.6);
  }
  bubbleIn("#n1", 0.30, 2, 60);
  bubbleIn("#n2", 0.90, -2, -60);
  bubbleIn("#n3", 1.50, 2, 60);
  cue(0.30, "notif", 1.0, 0.35);
  cue(0.90, "notif", 1.0, -0.35);
  cue(1.50, "pop", 0.6, 0.35);
  // «вибрация» телефона на уведомлениях
  [0.30, 0.90, 1.50].forEach(function (t) {
    tl.fromTo("#ph1", { x: 0 }, { x: 7, duration: 0.045, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, t);
  });
  // нарастающее напряжение перед поворотом
  cue(0.85, "riser", 0.55);

  /* ═══════════════ СЦЕНА 2 · ПОВОРОТ (2.4–5.0) ═══════════════ */
  const s2 = T[1];
  tl.fromTo("#clock", { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.6)" }, s2 + 0.1);
  tl.fromTo("#clockArc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, s2 + 0.3);
  tl.fromTo("#clockHand", { rotation: 0, svgOrigin: "150 150" }, { rotation: 720, svgOrigin: "150 150", duration: T[2] - s2, ease: "none" }, s2);

  const revealLine = function (sel, t) {
    tl.fromTo(sel, { yPercent: 135, rotation: 5, transformOrigin: "0% 100%" },
      { yPercent: 0, rotation: 0, duration: 0.6, ease: "expo.out" }, t);
  };
  revealLine("#lines2 .ln1 .w", s2 + 0.14);
  revealLine("#w2", s2 + 0.55);
  revealLine("#w3", s2 + 1.0);
  cue(s2 + 0.14, "swipe", 0.45, -0.2);
  cue(s2 + 0.55, "swipe", 0.5, 0.15);
  cue(s2 + 1.0, "pop", 0.75);
  // «не листать,» — зачёркиваем и приглушаем
  tl.fromTo("#strike", { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease: "power3.inOut" }, s2 + 1.05);
  tl.to("#w2", { color: "rgba(15,15,26,.5)", duration: 0.3, ease: "power2.out" }, s2 + 1.1);
  cue(s2 + 1.08, "scratch", 0.35);
  // жёлтый маркер под «создавать»
  tl.fromTo("#mk2", { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.5, ease: "power2.out" }, s2 + 1.35);
  tl.fromTo("#w3", { scale: 1 }, { scale: 1.035, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut", transformOrigin: "0% 50%", immediateRender: false }, s2 + 1.3);
  // кирпичики-«приложение» растут
  tl.fromTo("#bricks .br", { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: "back.out(1.8)", stagger: 0.09 }, s2 + 1.55);
  [0, 1, 2, 3].forEach(function (i) { cue(s2 + 1.6 + i * 0.09, "tick", 0.8, -0.3 + i * 0.2); });
  // искры у слова
  const sp2 = [[820, 800, 78, "#ffd23f"], [70, 1180, 56, "#fffbf5"], [930, 1210, 64, "#ffd23f"]];
  sp2.forEach(function (s, i) {
    const el = sparkle($("#s2"), s[0], s[1], s[2], s[3]);
    tl.fromTo(el, { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.4)" }, s2 + 1.6 + i * 0.1);
    tl.to(el, { rotation: 90, duration: 1, ease: "sine.inOut" }, s2 + 2.0 + i * 0.1);
  });
  gsap.set("#s2 .spark", { transformOrigin: "50% 50%" });

  /* ═══════════════ СЦЕНА 3 · СОЗДАЁТ (5.0–10.5) ═══════════════ */
  const s3 = T[2];
  gsap.set("#ph3", { y: 890, opacity: 0 });
  gsap.set("#grpA", { y: 380 });

  tl.fromTo("#pill3", { scale: 0.5, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, s3 + 0.2);
  cue(s3 + 0.25, "pop", 0.7);
  tl.fromTo("#win3", { y: 70, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }, s3 + 0.35);
  cue(s3 + 0.35, "swipe", 0.4);
  tl.fromTo("#ph3", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, s3 + 0.5);
  tl.set(".cr0", { opacity: 1 }, s3 + 0.5);

  // печать кода
  const r3 = rng(20260930);
  const chars = $$("#code3 .ch");
  let tt = s3 + 0.62;
  tl.set(".cr0", { opacity: 0 }, tt);
  let prevCr = null, typed = 0, nextTick = 1, ci = 0, tickPan = -0.18;
  lineLens.forEach(function (len, li) {
    for (let k = 0; k < len; k++) {
      const ch = chars[ci++];
      const cr = $(".cr", ch);
      tl.set(ch, { opacity: 1 }, tt);
      tl.set(cr, { opacity: 1 }, tt);
      if (prevCr) tl.set(prevCr, { opacity: 0 }, tt);
      prevCr = cr;
      typed++;
      if (typed === nextTick) {
        cue(tt, "tick", 0.55 + r3() * 0.35, tickPan);
        tickPan = -tickPan;
        nextTick += 2 + (r3() < 0.5 ? 0 : 1);
      }
      tt += 0.019 + r3() * 0.014;
    }
    tt += (li < 2) ? 0.14 : 0.08;
  });
  const typeEnd = tt;              // ≈ 7.95
  const PB = typeEnd;

  // фаза B: код уезжает вверх, снизу выезжает телефон с готовым приложением
  tl.fromTo("#grpA", { y: 380 }, { y: 0, duration: 0.7, ease: "power3.inOut", immediateRender: false }, PB);
  tl.to("#win3", { scale: 0.86, duration: 0.7, ease: "power3.inOut" }, PB);
  tl.set(prevCr, { opacity: 0 }, PB);
  tl.fromTo("#ph3", { y: 890 }, { y: 0, duration: 0.8, ease: "back.out(1.1)", immediateRender: false }, PB + 0.2);
  cue(PB - 0.05, "whoosh", 0.65);
  tl.to("#qdim", { opacity: 0, duration: 0.35, ease: "power2.out" }, PB + 0.45);
  tl.fromTo("#qh", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, PB + 0.55);
  tl.fromTo(".qbar i", { width: "0%" }, { width: "32%", duration: 0.5, ease: "power2.out" }, PB + 0.55);
  const BT = PB + 0.68;            // кнопки поп-ап синхронно с арпеджио success (0.085 с)
  tl.fromTo("#qz .qb", { scale: 0.55, opacity: 0, y: 34 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(2.2)", stagger: 0.085 }, BT);
  cue(BT, "success", 1.0);
  // конфетти
  (function confetti() {
    const box = $("#conf");
    const r = rng(777);
    const cols = ["#ff6b47", "#ffd23f", "#46d39a", "#4aa8ff", "#7a5cff", "#fffbf5", "#ffb088"];
    const t0 = BT + 0.3;
    for (let i = 0; i < 54; i++) {
      const el = document.createElement("i");
      const circle = r() < 0.3;
      const w = 14 + r() * 16, h = circle ? w : 26 + r() * 20;
      el.style.width = w + "px"; el.style.height = h + "px";
      el.style.background = cols[Math.floor(r() * cols.length)];
      el.style.borderRadius = circle ? "50%" : (r() < 0.5 ? "4px" : "8px");
      el.style.left = (-w / 2) + "px"; el.style.top = (-h / 2) + "px";
      box.appendChild(el);
      const ang = -Math.PI / 2 + (r() - 0.5) * 2.5;
      const v = 700 + r() * 1100, g = 2600, D = 1.7 + r() * 0.5;
      const vx = Math.cos(ang) * v * 0.85, vy = Math.sin(ang) * v;
      const dly = r() * 0.08;
      tl.fromTo(el, { x: 0, opacity: 1, scale: 0 }, { x: vx * D * 0.62, scale: 1, duration: D, ease: "power1.out" }, t0 + dly);
      tl.fromTo(el, { y: 0 }, { y: 1, duration: D, ease: function (p) { const s = p * D; return vy * s + 0.5 * g * s * s; }, immediateRender: false }, t0 + dly);
      tl.fromTo(el, { rotation: 0 }, { rotation: (r() < 0.5 ? -1 : 1) * (360 + r() * 720), duration: D, ease: "none", immediateRender: false }, t0 + dly);
      tl.to(el, { opacity: 0, duration: 0.35, ease: "power1.in" }, t0 + dly + D - 0.4);
    }
  })();
  // искры вокруг телефона
  [[130, 760, 84, "#ffd23f"], [880, 700, 64, "#fffbf5"], [110, 1250, 60, "#ff8f6b"], [900, 1200, 90, "#ffd23f"], [860, 930, 44, "#46d39a"]].forEach(function (s, i) {
    const el = sparkle($("#s3"), s[0], s[1], s[2], s[3]);
    el.style.zIndex = 7;
    gsap.set(el, { scale: 0, transformOrigin: "50% 50%" });
    tl.to(el, { scale: 1, rotation: 45, duration: 0.5, ease: "back.out(2.4)" }, BT + 0.25 + i * 0.07);
    tl.to(el, { scale: 0.75, rotation: 120, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 1 }, BT + 0.8 + i * 0.07);
  });
  // подпись
  tl.fromTo("#cap3 span", { y: 60, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, BT + 0.45);
  cue(BT + 0.45, "pop", 0.6);
  // «нажатие» на вариант
  tl.fromTo("#qz .q2", { scale: 1 }, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, BT + 1.25);
  cue(BT + 1.25, "tick", 0.9);

  /* ═══════════════ СЦЕНА 4 · ЭМОЦИЯ (10.5–14.8) ═══════════════ */
  const s4 = T[3];
  tl.fromTo("#note4", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, s4 + 0.2);
  cue(s4 + 0.25, "swipe", 0.35, -0.3);
  tl.fromTo("#msgL", { scale: 0.5, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, s4 + 0.55);
  cue(s4 + 0.55, "notif", 1.0, -0.3);
  // индикатор набора → ответ
  tl.fromTo("#msgR .avt", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, s4 + 1.35);
  tl.fromTo("#typing", { scale: 0, opacity: 0, transformOrigin: "100% 100%" }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, s4 + 1.35);
  $$("#typing i").forEach(function (d, i) {
    tl.fromTo(d, { y: 0 }, { y: -14, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3, immediateRender: false }, s4 + 1.5 + i * 0.08);
  });
  tl.to("#typing", { opacity: 0, scale: 0.6, duration: 0.15 }, s4 + 1.92);
  tl.fromTo("#msgR .bub", { scale: 0.4, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, s4 + 1.95);
  cue(s4 + 1.95, "pop", 0.9, 0.3);
  // сердечки над ответом
  [[915, 930, 66, 0.0], [975, 870, 46, 0.12], [880, 850, 42, 0.22]].forEach(function (h, i) {
    const el = document.createElement("div");
    el.className = "heart";
    el.style.left = h[0] + "px"; el.style.top = h[1] + "px"; el.style.width = h[2] + "px"; el.style.height = h[2] + "px";
    el.innerHTML = '<svg><use href="#i-heart"/></svg>';
    $("#s4").appendChild(el);
    tl.fromTo(el, { scale: 0, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(2.5)" }, s4 + 2.15 + h[3]);
    tl.to(el, { y: -90, opacity: 0, duration: 1.0, ease: "power1.out" }, s4 + 2.6 + h[3]);
  });
  // подпись
  ["#c4a", "#c4b", "#c4c"].forEach(function (sel, i) {
    tl.fromTo(sel, { yPercent: 135, rotation: 4, transformOrigin: "0% 100%" }, { yPercent: 0, rotation: 0, duration: 0.6, ease: "expo.out" }, s4 + 2.4 + i * 0.13);
  });
  cue(s4 + 2.4, "swipe", 0.5);

  /* ═══════════════ СЦЕНА 5 · ПОЧЕМУ ЭТО ПРОСТО (14.8–19.5) ═══════════════ */
  const s5 = T[4];
  [["#k1", 0.55, 0.85, -0.35], ["#k2", 1.75, 1.0, 0.0], ["#k3", 2.95, 1.25, 0.35]].forEach(function (c) {
    const t = s5 + c[1];
    tl.fromTo(c[0], { x: 200, opacity: 0, scale: 0.94 }, { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }, t);
    tl.fromTo(c[0] + " .ckc", { scale: 0 }, { scale: 1, duration: 0.45, ease: "back.out(2.6)" }, t + 0.15);
    tl.fromTo(c[0] + " .ckp", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, t + 0.35);
    tl.fromTo(c[0] + " .mark-sun", { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.5, ease: "power2.out" }, t + 0.5);
    cue(t - 0.02, "swipe", 0.35, c[3] * 0.6);
    cue(t + 0.3, "ding", c[2], c[3]);
  });
  // лёгкое «дыхание» фона
  tl.fromTo("#s5 .blob.a", { x: 0, y: 0 }, { x: -60, y: 60, duration: T[5] - s5, ease: "none" }, s5);

  /* ═══════════════ СЦЕНА 6 · ОФФЕР + CTA (19.5–25.0) ═══════════════ */
  const s6 = T[5];
  gsap.set("#brand6", { opacity: 0 });
  gsap.set("#hint6", { opacity: 0 });
  // наклейка «шлёпается»
  tl.fromTo("#stk6", { scaleX: 2.8, scaleY: 2.8, rotation: -32, opacity: 0 },
    { scaleX: 1, scaleY: 1, rotation: -9, opacity: 1, duration: 0.3, ease: "power3.in" }, s6 + 0.15);
  tl.fromTo("#stk6", { scaleX: 1.16, scaleY: 0.86 }, { scaleX: 1, scaleY: 1, duration: 0.55, ease: "elastic.out(1,0.4)", immediateRender: false }, s6 + 0.45);
  cue(s6 + 0.45, "impact", 1.2);
  tl.fromTo("#shock", { scale: 1, opacity: 0.9 }, { scale: 2.1, opacity: 0, duration: 0.6, ease: "power2.out" }, s6 + 0.45);
  tl.fromTo("#s6c", { x: 0, y: 0 }, { x: 10, y: -8, duration: 0.04, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, s6 + 0.45);
  // подпись «Дешевле…»
  tl.fromTo("#cap6", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, s6 + 0.95);
  cue(s6 + 0.95, "swipe", 0.5);
  // призыв
  tl.fromTo("#call6", { y: 70, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" }, s6 + 1.55);
  cue(s6 + 1.55, "pop", 0.8);
  // подсказка «Нажмите «Записаться» ↓» + пульсирующая стрелка
  tl.fromTo("#hint6", { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, s6 + 2.15);
  tl.fromTo("#ht6", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, s6 + 2.15);
  cue(s6 + 2.15, "pop", 0.9);
  tl.fromTo("#arr6", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, s6 + 2.35);
  tl.fromTo("#arr6", { y: 0, scale: 1 }, { y: 20, scale: 1.1, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: 5, immediateRender: false }, s6 + 2.75);
  // финал: логотип и @alfaz.school (последние ~1.5 с)
  const BR = T[5] + 3.95;   // 23.45
  tl.to("#cap6", { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, BR - 0.05);
  tl.to("#call6", { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, BR - 0.05);
  tl.to("#brand6", { opacity: 1, duration: 0.01 }, BR + 0.05);
  tl.fromTo("#brand6 .logo", { scale: 0.6, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.8)" }, BR + 0.05);
  tl.fromTo("#brand6 .tag", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, BR + 0.25);
  tl.fromTo("#brand6 .hd", { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, BR + 0.35);
  tl.to("#stk6", { scale: 0.9, rotation: -6, duration: 0.5, ease: "power3.inOut" }, BR);
  cue(BR + 0.05, "pop", 0.8);
  cue(BR + 0.3, "ding", 0.9);

  /* ═══════════════ ЭКСПОРТ ═══════════════ */
  cues.sort(function (a, b) { return a.t - b.t; });
  // пустышка, растягивающая таймлайн ровно до конца ролика
  tl.to("#frame", { opacity: 1, duration: 0.001 }, DUR - 0.001);

  window.__debug = { PB: PB, typeEnd: typeEnd, BT: BT };
  window.__duration = DUR;
  window.__cues = cues;
  window.__music = { bpm: 108, mood: "bright", intro: 1.4, gain: 0.5 };
  window.seek = function (t) { tl.time(Math.max(0, Math.min(DUR, t)), false); };
  window.seek(0);
})();
