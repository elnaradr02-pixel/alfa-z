// Рендер статичных креативов: src/creatives/<ID>.html × 2 формата → out/statics/*.png
// Запуск:  node render-statics.mjs            (все)
//          node render-statics.mjs E1 F1      (только выбранные)
import { chromium } from "playwright-core";
import { readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(root, "src", "creatives");
const out = path.join(root, "out", "statics");
mkdirSync(out, { recursive: true });

const only = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith(".html")).filter((f) => !only.length || only.some((o) => f.startsWith(o + "-")));

const FORMATS = [
  { key: "feed", ratio: "4x5", w: 1080, h: 1350 },
  { key: "story", ratio: "9x16", w: 1080, h: 1920 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--font-render-hinting=none", "--allow-file-access-from-files"],
});

for (const f of files) {
  for (const fmt of FORMATS) {
    const page = await browser.newPage({ viewport: { width: fmt.w, height: fmt.h }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(dir, f)).href + `?f=${fmt.key}`);
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
      const sx = document.documentElement.scrollWidth > fr.width + 1; if (sx) out.push("горизонтальное переполнение");
      return out;
    });
    if (issues.length) console.warn("  ⚠", f, fmt.key, issues.join("; "));
    const name = `${f.replace(/\.html$/, "")}_${fmt.ratio}.png`;
    await page.locator(".frame").screenshot({ path: path.join(out, name) });
    await page.close();
    console.log("✓", name);
  }
}
await browser.close();
