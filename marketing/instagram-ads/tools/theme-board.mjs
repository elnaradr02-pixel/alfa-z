// Доска тем: рендерит для каждой темы светлую и тёмную сцену с реальными компонентами.
//   node tools/theme-board.mjs [--css src/themes.css] [--out out/.cache/board.png] [--themes coral,indigo]
// Позволяет проверять кандидатную палитру ДО того, как она попадёт в общий themes.css.
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf("--" + k); return i >= 0 ? a[i + 1] : d; };
const cssPath = path.resolve(opt("css", path.join(root, "src", "themes.css")));
const out = path.resolve(opt("out", path.join(root, ".cache", "board.png")));
mkdirSync(path.dirname(out), { recursive: true });
const css = readFileSync(cssPath, "utf8");
const all = [...new Set([...css.matchAll(/\.theme-([\w-]+)/g)].map((m) => m[1]))];
const themes = (opt("themes", "") ? opt("themes", "").split(",") : all);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium", args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: 1980, height: 1200 } });
const board = pathToFileURL(path.join(root, "src", "tools", "board.html")).href;
await page.goto(`${board}?themes=${themes.join(",")}&css=${encodeURIComponent(pathToFileURL(cssPath).href)}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: true });
console.log("board →", out, "·", themes.join(", "));
await browser.close();
