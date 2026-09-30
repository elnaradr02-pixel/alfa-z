// Рендер статичных креативов → PNG.
//   node render-statics.mjs                     кампания 1: src/creatives/*.html → out/statics (лента 4:5 и Stories 9:16)
//   node render-statics.mjs E1 F1               только выбранные ID
//   node render-statics.mjs --set c2            кампания 2 (казахский/русский): src/creatives-c2 → out/statics-c2,
//                                               файлы <имя>_<kk|ru>_<4x5|9x16>.png
//   node render-statics.mjs --set c2 K1 --lang kk   один язык
import { chromium } from "playwright-core";
import { readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const flagVals = new Set(["--set", "--lang"].flatMap((f) => (args.includes(f) ? [args[args.indexOf(f) + 1]] : [])));
const only = args.filter((a) => !a.startsWith("--") && !flagVals.has(a));
const set = opt("set", "c1");
const SETS = {
  c1: { dir: "creatives", out: "statics", langs: [null] },
  c2: { dir: "creatives-c2", out: "statics-c2", langs: ["kk", "ru"] },
};
const cfg = SETS[set];
if (!cfg) { console.error("неизвестный --set", set); process.exit(1); }
const langs = opt("lang", null) ? [opt("lang", null)] : cfg.langs;
const dir = path.join(root, "src", cfg.dir);
const out = path.join(root, "out", cfg.out);
mkdirSync(out, { recursive: true });
const files = readdirSync(dir).filter((f) => f.endsWith(".html") && !f.startsWith("_")).filter((f) => !only.length || only.some((o) => f.startsWith(o + "-") || f === o + ".html"));

const FORMATS = [
  { key: "feed", ratio: "4x5", w: 1080, h: 1350 },
  { key: "story", ratio: "9x16", w: 1080, h: 1920 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--font-render-hinting=none", "--allow-file-access-from-files"],
});

for (const f of files) {
  for (const lang of langs) {
    for (const fmt of FORMATS) {
      const page = await browser.newPage({ viewport: { width: fmt.w, height: fmt.h }, deviceScaleFactor: 1 });
      page.on("pageerror", (e) => console.warn("  ⚠ page error:", f, e.message));
      await page.goto(pathToFileURL(path.join(dir, f)).href + `?f=${fmt.key}` + (lang ? `&lang=${lang}` : ""));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForLoadState("load");
      await page.waitForTimeout(150);
      const issues = await page.evaluate(() => {
        const c = document.querySelector(".content"); if (!c) return [];
        const fr = document.querySelector(".frame").getBoundingClientRect();
        const cs = getComputedStyle(document.querySelector(".frame"));
        const pb = parseFloat(cs.getPropertyValue("--pb")) || 0, pt = parseFloat(cs.getPropertyValue("--pt")) || 0;
        const kids = [...c.children].filter((e) => getComputedStyle(e).position !== "absolute");
        const out = [];
        kids.forEach((k, i) => {
          const r = k.getBoundingClientRect();
          if (i === kids.length - 1 && r.bottom > fr.bottom - pb + 2) out.push(`низ выходит за безопасную зону на ${Math.round(r.bottom - (fr.bottom - pb))}px`);
          if (i === 0 && r.top < fr.top + pt - 2) out.push("верх выходит за безопасную зону");
          const n = kids[i + 1];
          if (n && r.bottom > n.getBoundingClientRect().top + 1) out.push(`блок ${i + 1} налезает на блок ${i + 2} на ${Math.round(r.bottom - n.getBoundingClientRect().top)}px`);
        });
        // горизонтальное переполнение текста внутри блоков
        c.querySelectorAll("*").forEach((el) => { if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== "visible" && el.clientWidth > 0) out.push(`переполнение по ширине: ${el.tagName.toLowerCase()}.${el.className}`); });
        if (document.documentElement.scrollWidth > fr.width + 1) out.push("горизонтальное переполнение страницы");
        if (window.__missing && window.__missing.length) out.push("нет переводов: " + window.__missing.join(", "));
        return out;
      });
      const tag = `${f}${lang ? " " + lang : ""} ${fmt.key}`;
      if (issues.length) console.warn("  ⚠", tag, issues.join("; "));
      const name = `${f.replace(/\.html$/, "")}${lang ? "_" + lang : ""}_${fmt.ratio}.png`;
      await page.locator(".frame").screenshot({ path: path.join(out, name) });
      await page.close();
      console.log("✓", name);
    }
  }
}
await browser.close();
