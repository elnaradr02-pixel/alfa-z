/* KV1 · «Уайымдар өшеді» — один приостановленный GSAP-таймлайн.
   Контракт render-video.mjs: window.__duration, window.seek(t), window.__cues, window.__music.
   Тайминг считается из длины текстов текущего языка (kk/ru): каждая надпись держится ≈ 0,3–0,35 с/слово + 1 с,
   поэтому замена формулировок в i18n не ломает ритм. Никаких rAF / setTimeout / Math.random. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const r3 = (t) => Math.round(t * 1000) / 1000;

  const text = (el) => el.textContent.replace(/\s+/g, " ").trim();
  const nWords = (el) => text(el).split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const nChars = (el) => text(el).length;
  // скорость «письма»: рукопись ≈ 0,055 с на знак, печатный текст ≈ 0,03 с на знак
  const handDur = (el) => clamp(nChars(el) * 0.055 + 0.1, 0.75, 1.5);
  const typeDur = (el) => clamp(nChars(el) * 0.022 + 0.2, 0.55, 1.3);

  const cues = [];
  const cue = (t, type, gain) => cues.push({ t: r3(t), type: type, gain: gain == null ? 1 : gain });

  // рукописная строка не шире maxW: уменьшаем --lt-size, но не ниже 96 px (правило читаемости); если и так не влезает — переносится
  function fit(box, measure, maxW) {
    const base = parseFloat(getComputedStyle(box).fontSize);
    const ws = measure.style.whiteSpace; measure.style.whiteSpace = "nowrap";
    const w = measure.getBoundingClientRect().width / (box.__rs || 1);
    measure.style.whiteSpace = ws;
    const k = Math.floor(base * maxW / w);
    if (w > maxW && k >= 96) box.style.setProperty("--lt-size", k + "px");   // не влезает и в 96 px → оставляем кегль, строка переносится
  }

  function build() {
    // подгонка длины (kk/ru и будущие правки текста)
    $$(".slot").forEach((s) => { fit($(".worry", s), $(".wq", s), 850); fit($(".ans", s), $(".ans", s), 850); });
    fit($("#h1"), $("#h1"), 560);
    fit($("#h2"), $("#h2"), 690);
    const tl = gsap.timeline({ paused: true });
    const page = $("#page");
    const slots = [$("#s1"), $("#s2"), $("#s3")];

    // ── камера: страница «прокручивается» — сначала в центр встаёт тревога, после зачёркивания — вся пара «тревога → ответ» ──
    const Y_W = 1040, Y_A = 1060;                      // центр безопасной зоны Reels (y 270…1590) ≈ 930
    const lab = $("#label");
    const lineC = (el) => el.offsetTop + el.offsetHeight / 2;
    const fw = (i) => Y_W - lineC($(".worry", slots[i])) + (i === 0 ? 40 : 0);
    const fa = (i) => Y_A - lineC(slots[i]);
    gsap.set(page, { y: fw(0) });

    let t = 0.0;
    let transitionAt = 0;
    slots.forEach((s, i) => {
      const wq = $(".wq", s), ans = $(".ans", s), tick = $(".tick", s), fact = $(".fact", s);
      if (i > 0) {
        // страница едет вверх: следующая тревога встаёт в центр
        tl.to(page, { y: fw(i), duration: 0.8, ease: "power2.inOut" }, t - 0.45);
        // прошлые пары уходят на второй план: тревоги серые, ответы остаются читаемыми
        tl.to(slots.slice(0, i).concat(i === 1 ? [lab] : []), { opacity: 0.5, duration: 0.6, ease: "none" }, t - 0.45);
        cue(t - 0.45, "whoosh", 0.22);
      }
      // тревога пишется
      const wd = handDur(wq);
      L.write(tl, wq, t, wd, { pen: true });
      cue(t + 0.02, "scratch", 0.3);
      const strikeAt = t + Math.max(wd + 0.45, 0.35 * nWords(wq) + 0.4);
      // зачёркивание (рукописный штрих), страница чуть поднимается — освобождает место для ответа
      L.strike(tl, wq, strikeAt, 0.45, { dim: true });
      cue(strikeAt, "swipe", 0.55);
      tl.to(page, { y: fa(i), duration: 0.8, ease: "power2.inOut" }, strikeAt + 0.1);
      // ответ
      const aAt = strikeAt + 0.5;
      const ad = handDur(ans);
      L.write(tl, ans, aAt, ad, { pen: true });
      cue(aAt + 0.02, "scratch", 0.3);
      cue(aAt + 0.15, "ding", 0.4);
      const deco = $(".lt-under, .lt-circle, .lt-mark", ans);
      let aEnd = aAt + ad;
      if (deco) {
        const isCircle = deco.classList.contains("lt-circle");
        L.draw(tl, deco, aEnd - 0.05, isCircle ? 0.6 : 0.45, { ease: "power2.out" });
        aEnd += isCircle ? 0.45 : 0.3;
      }
      L.pop(tl, tick, aEnd - 0.1, { dur: 0.55 });
      L.draw(tl, tick, aEnd - 0.1, 0.4, { ease: "power2.out" });
      cue(aEnd - 0.05, "tick", 0.55);
      // факт (печатный) проявляется по словам
      const fAt = aEnd + 0.1;
      const fd = typeDur(fact);
      L.write(tl, fact, fAt, fd, { gap: 0.02 });
      // время на чтение ответа + факта с момента появления ответа
      const readEnd = aAt + 0.28 * (nWords(ans) + nWords(fact)) + 1.0;
      t = Math.max(readEnd, fAt + fd + 0.8);
      if (i === slots.length - 1) transitionAt = t;
    });

    // ── переход: пары растворяются, рисуется арка, снаружи — ночь ──
    const T = transitionAt;
    tl.to(page, { opacity: 0, duration: 0.5, ease: "power1.in" }, T);
    tl.to("#paper .orn-corner, #paper .orn-band", { opacity: 0, duration: 0.5, ease: "none" }, T);
    tl.fromTo("#archIn", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" }, T + 0.1);
    tl.fromTo("#night", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.in" }, T + 0.3);
    tl.set("#archLine", { opacity: 1 }, T + 0.15);
    tl.fromTo("#archLine", { "--ap": 0 }, { "--ap": 1, duration: 1.05, ease: "power2.inOut" }, T + 0.15);
    tl.fromTo("#archIn", { scale: 0.985 }, { scale: 1, duration: 1.2, ease: "power2.out", transformOrigin: "50% 60%" }, T + 0.15);
    cue(T - 0.9, "riser", 0.35);
    cue(T + 0.05, "whoosh", 0.55);

    // ── «Мама, уайымдамаңыз» ──
    const h1 = $("#h1"), h2 = $("#h2");
    const H1 = T + 1.1;
    const d1 = handDur(h1), d2 = handDur(h2) + 0.15;
    L.write(tl, h1, H1, d1, { pen: true });
    cue(H1 + 0.02, "scratch", 0.3);
    const H2 = H1 + d1 + 0.12;
    L.write(tl, h2, H2, d2, { pen: true });
    cue(H2 + 0.02, "scratch", 0.3);
    const sw = $(".lt-under", h2);
    const swEnd = H2 + d2;
    if (sw) L.draw(tl, sw, swEnd - 0.1, 0.6, { ease: "power2.out" });
    L.pop(tl, "#heart", swEnd + 0.05, { dur: 0.65 });
    cue(swEnd + 0.05, "success", 0.45);

    // ── печатный слой: «IT-де біз балаңызбен біргеміз» ──
    const HD = swEnd + 0.55;
    tl.fromTo("#head", { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, HD);
    cue(HD, "pop", 0.35);
    const PR = HD + 0.75;
    tl.fromTo("#price > span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.18 }, PR);

    // ── кнопка + контакт ──
    const CT = PR + 0.4;
    tl.fromTo("#btn", { opacity: 0, scale: 0.7, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)" }, CT);
    tl.fromTo("#contact", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, CT + 0.3);
    tl.fromTo("#btn .arr", { x: 0 }, { x: 12, duration: 0.42, ease: "sine.inOut", yoyo: true, repeat: 5, immediateRender: false }, CT + 0.8);
    L.pop(tl, "#spark", CT + 0.45, { dur: 0.5 });
    cue(CT + 0.05, "pop", 0.7);
    // держим финал: кнопка + цена + контакт читаются без звука
    const readCTA = 0.3 * (nWords($("#btn")) + nWords($("#price")) + nWords($("#contact"))) + 1.0;
    const DUR = r3(clamp(CT + readCTA, CT + 3.3, CT + 3.8));

    cues.sort((a, b) => a.t - b.t);
    tl.set({}, {}, DUR);
    window.__marks = { T: r3(T), H1: r3(H1), HD: r3(HD), CT: r3(CT), H: page.offsetHeight };
    window.__duration = DUR;
    window.__cues = cues;
    window.__music = { bpm: 84, key: "Dm", mood: "warm", lift: r3(T), gain: 0.5, intro: 0 };
    window.seek = function (x) { tl.time(clamp(x, 0, DUR), false); };
    window.seek(0);
  }

  const fonts = ["700 118px Caveat", "800 58px Geologica", "500 40px Onest", "600 38px Onest", "800 36px Inter"];
  Promise.all(fonts.map((f) => document.fonts.load(f, "ҚқӘәҰұ Ааα₸"))).catch(() => {}).then(() => document.fonts.ready).then(build);
})();
