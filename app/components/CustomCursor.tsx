"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

/**
 * «Комета» — курсор школы программирования:
 *  • светящийся шлейф коралл → персик за указателем (canvas, рисуется только пока есть движение);
 *  • точка-ядро без задержки + пружинное кольцо;
 *  • над кнопками/ссылками/строками FAQ кольцо ПРЕВРАЩАЕТСЯ в подсветку по форме элемента
 *    (как указатель на iPad), над крупными кликабельными блоками — коралловый круг со стрелкой;
 *  • над кодом кольцо становится значком </>;
 *  • клик — вспышка-«ripple» и россыпь искр.
 * Только мышь (pointer:fine) и без prefers-reduced-motion; на телефонах — системное поведение.
 */

type Mode = "default" | "snap" | "big" | "code" | "hidden";

const SNAP = "a,button,[role='button'],summary,.cursor-target";
const FIELD = "input,textarea,select";
const TRAIL_MS = 420;
const RING = 34;

type Pt = { x: number; y: number; t: number };
type Spark = { x: number; y: number; vx: number; vy: number; t0: number; warm: boolean };
type Ripple = { x: number; y: number; t0: number };

export default function CustomCursor() {
  const { mounted, reducedMotion, isCoarsePointer } = useDeviceCapabilities();
  const enabled = mounted && !reducedMotion && !isCoarsePointer;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Ядро — мгновенно; кольцо — пружиной (позиция + размер + скругление)
  const dx = useMotionValue(-100);
  const dy = useMotionValue(-100);
  const cfg = { stiffness: 380, damping: 30, mass: 0.5 };
  const rx = useSpring(useMotionValue(-100), cfg);
  const ry = useSpring(useMotionValue(-100), cfg);
  const rw = useSpring(useMotionValue(RING), cfg);
  const rh = useSpring(useMotionValue(RING), cfg);
  const rr = useSpring(useMotionValue(RING / 2), cfg);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    // ── canvas: шлейф + искры ──
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const fit = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();

    const pts: Pt[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];
    let raf = 0;

    const frame = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      while (pts.length && now - pts[0].t > TRAIL_MS) pts.shift();

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(255,107,71,0.7)";
      ctx.shadowBlur = 12;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const k = 1 - (now - b.t) / TRAIL_MS; // 1 у головы → 0 у хвоста
        if (k <= 0) continue;
        ctx.strokeStyle = `rgba(255,${Math.round(107 + 69 * (1 - k))},${Math.round(71 + 65 * (1 - k))},${0.5 * k})`;
        ctx.lineWidth = 1.5 + 8 * k * (i / pts.length);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const p = (now - r.t0) / 520;
        if (p >= 1) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(255,107,71,${0.6 * (1 - p)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 8 + 46 * (1 - Math.pow(1 - p, 3)), 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const p = (now - s.t0) / 620;
        if (p >= 1) { sparks.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - p, 3);
        ctx.fillStyle = s.warm ? `rgba(255,107,71,${1 - p})` : `rgba(255,176,136,${1 - p})`;
        ctx.beginPath();
        ctx.arc(s.x + s.vx * 46 * e, s.y + s.vy * 46 * e + 10 * p * p, 3 * (1 - p) + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = pts.length || sparks.length || ripples.length ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    // ── состояние под курсором ──
    let target: Element | null = null;
    let lastMode: Mode = "default";
    const setModeOnce = (m: Mode) => { if (m !== lastMode) { lastMode = m; setMode(m); } };

    const place = (mx: number, my: number) => {
      const el = target;
      if (el && (lastMode === "snap")) {
        const r = el.getBoundingClientRect();
        const pad = 6;
        const cs = getComputedStyle(el);
        const br = parseFloat(cs.borderTopLeftRadius) || 0;
        rx.set(r.left - pad); ry.set(r.top - pad);
        rw.set(r.width + pad * 2); rh.set(r.height + pad * 2);
        rr.set(Math.min(br + pad, (r.height + pad * 2) / 2));
        return;
      }
      const size = lastMode === "big" ? 60 : lastMode === "code" ? 46 : RING;
      rx.set(mx - size / 2); ry.set(my - size / 2);
      rw.set(size); rh.set(size); rr.set(size / 2);
    };

    let mx = -100, my = -100;
    const classify = (t: Element | null) => {
      target = null;
      if (!t || !t.closest) return setModeOnce("default");
      if (t.closest(FIELD)) return setModeOnce("hidden"); // у полей остаётся системная I-каретка
      const el = t.closest(SNAP);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width <= 900 && r.height <= 160) { target = el; return setModeOnce("snap"); }
        return setModeOnce("big");
      }
      if (t.closest("code,pre")) return setModeOnce("code");
      return setModeOnce("default");
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      dx.set(mx); dy.set(my);
      setVisible(true);
      classify(e.target as Element | null);
      place(mx, my);
      pts.push({ x: mx, y: my, t: performance.now() });
      if (pts.length > 40) pts.shift();
      kick();
    };
    const rescan = () => { if (target) place(mx, my); };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setPressed(true);
      const t0 = performance.now();
      ripples.push({ x: e.clientX, y: e.clientY, t0 });
      for (let i = 0; i < 9; i++) {
        const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;
        sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * (0.6 + Math.random() * 0.6), vy: Math.sin(a) * (0.6 + Math.random() * 0.6), t0, warm: i % 2 === 0 });
      }
      kick();
    };
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("scroll", rescan, { passive: true });
    window.addEventListener("resize", fit);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      root.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("scroll", rescan);
      window.removeEventListener("resize", fit);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [enabled, dx, dy, rx, ry, rw, rh, rr]);

  if (!enabled) return null;

  const snap = mode === "snap";
  const big = mode === "big";
  const code = mode === "code";
  const hide = mode === "hidden" || !visible;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Кольцо: default → кольцо, snap → подсветка по форме элемента, big → круг со стрелкой, code → </> */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center border font-mono text-[11px] font-bold text-accent"
        style={{ x: rx, y: ry, width: rw, height: rh, borderRadius: rr }}
        animate={{
          opacity: hide ? 0 : 1,
          scale: pressed ? 0.94 : 1,
          borderColor: snap ? "rgba(255,107,71,0.9)" : "rgba(255,107,71,0.55)",
          backgroundColor: big ? "rgba(255,107,71,1)" : snap ? "rgba(255,107,71,0.13)" : code ? "rgba(255,107,71,0.10)" : "rgba(255,107,71,0)",
        }}
        transition={{ duration: 0.18 }}
      >
        {big && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        )}
        {code && <span>{"</>"}</span>}
      </motion.div>

      {/* Точка-ядро без задержки */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-accent"
        style={{ x: dx, y: dy, width: 6, height: 6, marginLeft: -3, marginTop: -3 }}
        animate={{ opacity: hide || snap || big ? 0 : 1, scale: pressed ? 1.8 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
