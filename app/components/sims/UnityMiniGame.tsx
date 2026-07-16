"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/app/i18n/lang";

/**
 * UnityMiniGame — крошечная, но по-настоящему играбельная 2D-аркада «CoinCatcher»
 * для карточки курса «Разработка игр на Unity». Ловим падающие монеты корзиной,
 * которую можно двигать стрелками, мышью и пальцем (мобильный drag).
 *
 * Всё в одном файле: игровой цикл на requestAnimationFrame с delta-time,
 * без внешних ассетов и сети. Отрисовка — Canvas 2D. Бренд: коралл/персик на тёмном.
 */

// --- Логические размеры канваса (внутренние координаты, не CSS-пиксели) ---
const GAME_W = 440;
const GAME_H = 300;

// --- Игровые константы ---
const PLAYER_W = 76;
const PLAYER_H = 16;
const PLAYER_Y = GAME_H - 30;
const COIN_R = 12;
const BASE_FALL = 130; // px/сек в начале
const FALL_ACCEL = 7; // прирост скорости за пойманную монету
const SPAWN_EVERY = 0.85; // секунды между появлениями (уменьшается со временем)
const MAX_LIVES = 3;

type Coin = { x: number; y: number; vy: number };
type Phase = "idle" | "playing" | "over";

// Цвета бренда
const C_DARK = "#0F0F1A";
const C_CORAL = "#FF6B47";
const C_PEACH = "#FFB088";

export default function UnityMiniGame() {
  const { tr } = useLang();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React-состояние только для HUD/оверлеев (не для игрового цикла).
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [best, setBest] = useState(0);

  // Мутабельный игровой мир — живёт в ref, чтобы цикл не пересоздавался.
  const world = useRef({
    playerX: GAME_W / 2,
    targetX: GAME_W / 2, // куда тянемся (мышь/палец); клавиши двигают напрямую
    coins: [] as Coin[],
    fallSpeed: BASE_FALL,
    spawnTimer: 0,
    score: 0,
    lives: MAX_LIVES,
    running: false,
    keyLeft: false,
    keyRight: false,
    usePointer: false, // как только двигали мышью/пальцем — следуем за указателем
  });

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  // Сброс мира в начальное состояние.
  const resetWorld = useCallback(() => {
    const w = world.current;
    w.playerX = GAME_W / 2;
    w.targetX = GAME_W / 2;
    w.coins = [];
    w.fallSpeed = BASE_FALL;
    w.spawnTimer = 0;
    w.score = 0;
    w.lives = MAX_LIVES;
    w.usePointer = false;
    w.keyLeft = false;
    w.keyRight = false;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const w = world.current;

    // Фон
    ctx.fillStyle = C_DARK;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Тонкая нижняя «полка» — ориентир земли
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(0, PLAYER_Y + PLAYER_H, GAME_W, GAME_H - (PLAYER_Y + PLAYER_H));

    // Монеты
    for (const c of w.coins) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, COIN_R, 0, Math.PI * 2);
      ctx.fillStyle = C_PEACH;
      ctx.fill();
      // блик
      ctx.beginPath();
      ctx.arc(c.x - COIN_R * 0.3, c.y - COIN_R * 0.3, COIN_R * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fill();
    }

    // Игрок-корзина (скруглённый прямоугольник)
    const px = w.playerX - PLAYER_W / 2;
    const r = 7;
    ctx.beginPath();
    ctx.moveTo(px + r, PLAYER_Y);
    ctx.arcTo(px + PLAYER_W, PLAYER_Y, px + PLAYER_W, PLAYER_Y + PLAYER_H, r);
    ctx.arcTo(px + PLAYER_W, PLAYER_Y + PLAYER_H, px, PLAYER_Y + PLAYER_H, r);
    ctx.arcTo(px, PLAYER_Y + PLAYER_H, px, PLAYER_Y, r);
    ctx.arcTo(px, PLAYER_Y, px + PLAYER_W, PLAYER_Y, r);
    ctx.closePath();
    ctx.fillStyle = C_CORAL;
    ctx.fill();
    // Внутренняя «чаша»
    ctx.fillStyle = "rgba(15,15,26,0.35)";
    ctx.fillRect(px + 6, PLAYER_Y + 3, PLAYER_W - 12, 4);
  }, []);

  // Один шаг симуляции + отрисовка.
  const step = useCallback(
    (dt: number) => {
      const w = world.current;

      // Движение игрока
      const KEY_SPEED = 360; // px/сек
      if (w.keyLeft || w.keyRight) {
        w.usePointer = false;
        if (w.keyLeft) w.playerX -= KEY_SPEED * dt;
        if (w.keyRight) w.playerX += KEY_SPEED * dt;
      } else if (w.usePointer) {
        // Плавно тянемся к указателю
        w.playerX += (w.targetX - w.playerX) * Math.min(1, dt * 18);
      }
      // Границы
      const half = PLAYER_W / 2;
      if (w.playerX < half) w.playerX = half;
      if (w.playerX > GAME_W - half) w.playerX = GAME_W - half;

      // Спавн монет (интервал сокращается с ростом счёта)
      w.spawnTimer -= dt;
      const spawnInterval = Math.max(0.32, SPAWN_EVERY - w.score * 0.012);
      if (w.spawnTimer <= 0) {
        w.spawnTimer = spawnInterval;
        w.coins.push({
          x: COIN_R + Math.random() * (GAME_W - COIN_R * 2),
          y: -COIN_R,
          vy: w.fallSpeed * (0.85 + Math.random() * 0.3),
        });
      }

      // Обновление монет + столкновения
      const catchTop = PLAYER_Y - COIN_R;
      let scoreChanged = false;
      let livesChanged = false;
      for (let i = w.coins.length - 1; i >= 0; i--) {
        const c = w.coins[i];
        c.y += c.vy * dt;

        // Поймана? Проверяем на уровне корзины
        if (
          c.y >= catchTop &&
          c.y <= PLAYER_Y + PLAYER_H &&
          Math.abs(c.x - w.playerX) <= PLAYER_W / 2 + COIN_R * 0.5
        ) {
          w.coins.splice(i, 1);
          w.score += 1;
          w.fallSpeed += FALL_ACCEL;
          scoreChanged = true;
          continue;
        }

        // Пропущена (упала ниже пола)
        if (c.y - COIN_R > GAME_H) {
          w.coins.splice(i, 1);
          w.lives -= 1;
          livesChanged = true;
        }
      }

      if (scoreChanged) setScore(w.score);
      if (livesChanged) setLives(Math.max(0, w.lives));

      // Game over
      if (w.lives <= 0 && w.running) {
        w.running = false;
        setBest((b) => Math.max(b, w.score));
        setPhase("over");
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) draw(ctx);
    },
    [draw],
  );

  // Игровой цикл.
  const loop = useCallback(
    (ts: number) => {
      const w = world.current;
      if (!w.running) return;
      const last = lastTsRef.current || ts;
      let dt = (ts - last) / 1000;
      lastTsRef.current = ts;
      if (dt > 0.05) dt = 0.05; // защита от больших скачков (вкладка была неактивна)
      step(dt);
      if (w.running) rafRef.current = requestAnimationFrame(loop);
    },
    [step],
  );

  const startGame = useCallback(() => {
    resetWorld();
    setScore(0);
    setLives(MAX_LIVES);
    setPhase("playing");
    world.current.running = true;
    lastTsRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, resetWorld]);

  // Рисуем стартовый кадр в idle, чтобы канвас не был пустым.
  useEffect(() => {
    if (phase === "idle") {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) draw(ctx);
    }
  }, [phase, draw]);

  // Клавиатура
  useEffect(() => {
    const w = world.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        w.keyLeft = true;
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        w.keyRight = true;
      } else if ((e.key === " " || e.key === "Enter") && phase !== "playing") {
        startGame();
        return;
      } else {
        return;
      }
      if (phase === "playing") e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") w.keyLeft = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") w.keyRight = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [phase, startGame]);

  // Указатель (мышь + касание). touchmove с preventDefault только на канвасе.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = world.current;

    const setTargetFromClientX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const rel = (clientX - rect.left) / rect.width; // 0..1
      w.usePointer = true;
      w.targetX = Math.max(0, Math.min(1, rel)) * GAME_W;
    };

    const onMouseMove = (e: MouseEvent) => setTargetFromClientX(e.clientX);
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setTargetFromClientX(e.touches[0].clientX);
        // Сразу подставим корзину под палец
        w.playerX = w.targetX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setTargetFromClientX(e.touches[0].clientX);
        e.preventDefault(); // не скроллим страницу во время игры пальцем
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Полная остановка цикла на размонтировании.
  useEffect(() => {
    return () => {
      world.current.running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl">
      {/* Титул окна */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="ml-2.5 font-mono text-[11px] text-white/45">CoinCatcher.cs</span>
      </div>

      <div className="p-4 sm:p-5 min-h-[360px]">
        <div className="mx-auto max-w-[440px]">
          {/* HUD */}
          <div className="mb-3 flex items-center justify-between font-mono text-[13px]">
            <span className="text-white/80">
              {tr("Счёт", "Ұпай", "Score")}:{" "}
              <span className="text-accent" style={{ color: C_CORAL }}>
                {score}
              </span>
            </span>
            <span className="text-white/80">
              {tr("Жизни", "Өмір", "Lives")}:{" "}
              <span aria-hidden style={{ letterSpacing: "2px" }}>
                {Array.from({ length: MAX_LIVES }, (_, i) => (
                  <span
                    key={i}
                    style={{ color: i < lives ? C_CORAL : "rgba(255,255,255,0.18)" }}
                  >
                    ●
                  </span>
                ))}
              </span>
            </span>
          </div>

          {/* Игровое поле */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={GAME_W}
              height={GAME_H}
              className="block w-full rounded-lg border border-white/10 bg-[#0F0F1A] touch-none select-none"
              style={{ aspectRatio: `${GAME_W} / ${GAME_H}` }}
            />

            {/* Оверлей: старт */}
            {phase === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-[#0F0F1A]/80 backdrop-blur-[1px]">
                <p className="px-6 text-center font-mono text-[12px] text-white/60">
                  {tr(
                    "Лови монеты корзиной — двигай стрелками, мышью или пальцем",
                    "Себетпен тиынды ұста — көрсеткішпен, тінтуірмен немесе саусақпен жылжыт",
                    "Catch the coins — move with arrows, mouse or your finger",
                  )}
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="rounded-lg px-5 py-2 font-mono text-[13px] font-semibold text-[#0F0F1A] transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ backgroundColor: C_CORAL }}
                >
                  {tr("Старт", "Бастау", "Start")}
                </button>
              </div>
            )}

            {/* Оверлей: game over */}
            {phase === "over" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-[#0F0F1A]/85 backdrop-blur-[1px]">
                <p className="font-mono text-[15px] font-semibold" style={{ color: C_CORAL }}>
                  {tr("Игра окончена", "Ойын аяқталды", "Game Over")}
                </p>
                <p className="font-mono text-[12px] text-white/70">
                  {tr("Счёт", "Ұпай", "Score")}: {score}
                  {best > 0 && (
                    <span className="text-white/45">
                      {"  "}
                      {tr("Рекорд", "Рекорд", "Best")}: {Math.max(best, score)}
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="mt-1 rounded-lg px-5 py-2 font-mono text-[13px] font-semibold text-[#0F0F1A] transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ backgroundColor: C_CORAL }}
                >
                  {tr("Играть заново", "Қайта ойнау", "Play again")}
                </button>
              </div>
            )}
          </div>

          {/* Подсказка под полем */}
          <p className="mt-3 text-center font-mono text-[11px] text-white/45">
            {tr(
              "← → двигай стрелками или пальцем",
              "← → көрсеткішпен немесе саусақпен жылжыт",
              "← → move with arrows or your finger",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
