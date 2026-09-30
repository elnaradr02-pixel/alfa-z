// Рендер видео-креатива: src/video/<name>/index.html → out/video/<name>.mp4 (1080×1920, 30 fps, H.264 + AAC)
//
// Сцена — обычная HTML-страница, которая обязана экспортировать:
//   window.__duration  — длительность в секундах
//   window.seek(t)     — выставить кадр на момент t (детерминированно; удобно на GSAP: tl.time(t))
//   window.__cues      — (необязательно) массив звуковых меток [{t, type, gain?}] для audio/synth.py
//   window.__music     — (необязательно) {bpm, key, mood} для музыкальной подложки
//
// Запуск:  node render-video.mjs v1-ne-listaet [--fps 30] [--no-audio] [--still 3.5]
//          node render-video.mjs k1-ustaz --dir video-c2 --lang kk   (кампания 2: src/video-c2/<name>, язык kk|ru → out/video-c2/<name>_kk.mp4)
//          --still T  сохранить один кадр (PNG) на моменте T секунд — для быстрой проверки вёрстки
import { chromium } from "playwright-core";
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valueFlags = new Set(["--fps", "--still", "--dir", "--lang"]);
const name = args.find((a, i) => !a.startsWith("--") && !valueFlags.has(args[i - 1]));
if (!name) { console.error("usage: node render-video.mjs <video-dir-name> [--fps 30] [--no-audio] [--still T]"); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const FPS = Number(opt("fps", 30));
const still = opt("still", null);
const noAudio = args.includes("--no-audio");
const vdir = opt("dir", "video");
const lang = opt("lang", null);

const ffmpeg = process.env.FFMPEG || execFileSync("python3", ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();
const outDir = path.join(root, "out", vdir); mkdirSync(outDir, { recursive: true });
const tag = lang ? `${name}_${lang}` : name;
const tmpDir = path.join(root, ".cache", tag); mkdirSync(tmpDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--font-render-hinting=none", "--allow-file-access-from-files"],
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("  page error:", e.message));
await page.goto(pathToFileURL(path.join(root, "src", vdir, name, "index.html")).href + (lang ? `?lang=${lang}` : ""));
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => typeof window.seek === "function" && window.__duration > 0, null, { timeout: 15000 });
await page.waitForTimeout(300);
const duration = await page.evaluate(() => window.__duration);
const cues = await page.evaluate(() => window.__cues || []);
const music = await page.evaluate(() => window.__music || {});

if (still !== null) {
  await page.evaluate((t) => window.seek(t), Number(still));
  await page.waitForTimeout(80);
  const p = path.join(tmpDir, `still-${still}.png`);
  await page.screenshot({ path: p });
  console.log("still →", p);
  await browser.close();
  process.exit(0);
}

// ── аудио ──
let audioPath = null;
if (!noAudio) {
  writeFileSync(path.join(tmpDir, "cues.json"), JSON.stringify({ duration, cues, music }, null, 1));
  audioPath = path.join(tmpDir, "audio.wav");
  execFileSync("python3", [path.join(root, "audio", "synth.py"), path.join(tmpDir, "cues.json"), audioPath], { stdio: "inherit" });
}

// ── кадры → ffmpeg ──
const total = Math.round(duration * FPS);
const outFile = path.join(outDir, `${tag}.mp4`);
const ffArgs = ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-"];
if (audioPath) ffArgs.push("-i", audioPath);
ffArgs.push("-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-profile:v", "high", "-r", String(FPS), "-movflags", "+faststart");
if (audioPath) ffArgs.push("-c:a", "aac", "-b:a", "192k", "-shortest");
ffArgs.push(outFile);
const ff = spawn(ffmpeg, ffArgs, { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((res, rej) => { ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exit " + c)))); });

const t0 = Date.now();
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => window.seek(t), i / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 96 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % 60 === 0) process.stdout.write(`\r  кадр ${i}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await done;
await browser.close();
console.log(`\n✓ ${path.relative(root, outFile)}  ${duration}s @ ${FPS}fps`);
