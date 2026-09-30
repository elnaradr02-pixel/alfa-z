// Рендер проверочной доски особых надписей: src/lettering-test.html → .cache/lettering-board.png
//   node tools/lettering-board.mjs [--themes kok,altyn] [--sections fonts,posters,shapes,phrases] [--out .cache/lettering-board.png] [--scale 1]
//   При --sections/--themes вырезает только нужное (для быстрого просмотра). Нужен chromium: /opt/pw-browsers/chromium (--allow-file-access-from-files для mask-image из file://).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf("--" + k); return i >= 0 ? a[i + 1] : d; };
const out = path.resolve(opt("out", path.join(root, ".cache", "lettering-board.png")));
mkdirSync(path.dirname(out), { recursive: true });
const q = new URLSearchParams();
if (opt("themes")) q.set("themes", opt("themes"));
if (opt("sections")) q.set("sections", opt("sections"));
q.set("ltdebug", "1");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium", args: ["--no-sandbox", "--font-render-hinting=none", "--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: 2356, height: 1200 }, deviceScaleFactor: Number(opt("scale", 1)) });
page.on("pageerror", (e) => console.error("page error:", e.message));
page.on("console", (m) => { if (m.type() === "warning" || m.type() === "error") console.log("[console]", m.text()); });
await page.goto(pathToFileURL(path.join(root, "src", "lettering-test.html")).href + "?" + q);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: out, fullPage: true });
console.log("board →", out);
await browser.close();
