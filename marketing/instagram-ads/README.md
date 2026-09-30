# Alfa Z · рекламные креативы для Instagram

Готовые файлы для Ads Manager лежат в `out/`. Начните с **`LAUNCH-PLAN.md`** (план теста и список того, что нужно от команды), затем **`COPY-DECK.md`** / `ads-copy.csv` (тексты под каждый креатив) и **`FACTS.md`** (что можно и нельзя говорить).

```
out/statics/   E1…C2 × (4x5 Лента · 9x16 Stories/Reels), PNG
out/video/     v1-…mp4, v2-…mp4 (9:16, 1080×1920, 30 fps)
src/           исходники: base.css (дизайн-система), creatives/*.html, video/*/index.html, fonts, assets
audio/synth.py музыка и звуковые эффекты видео — синтез кодом, оригинальные, без лицензий
tools/gen_copy.py  генератор COPY-DECK.md и ads-copy.csv
```

## Пересборка (нужны Node 20+, Python 3.10+, Chromium)

```bash
cd marketing/instagram-ads
npm install                                   # playwright-core + gsap
pip install pillow numpy scipy imageio-ffmpeg  # для звука/видео и контакт-листа
export CHROMIUM_PATH=/path/to/chromium         # по умолчанию /opt/pw-browsers/chromium

node render-statics.mjs            # все картинки (или: node render-statics.mjs E1 F1)
node render-video.mjs v1-zritel-sozdatel      # видео (несколько минут)
node render-video.mjs v1-zritel-sozdatel --still 5.0   # один кадр для проверки вёрстки
python3 tools/gen_copy.py          # обновить тексты и CSV
python3 contact.py sheet.png 4x5   # контакт-лист превью
```

Меняете текст — правьте HTML в `src/creatives/` (или `src/video/…`), запускайте рендер. Шрифты (Manrope, Unbounded, JetBrains Mono, Inter) лежат локально в `src/fonts`; палитра и логотип — из сайта. Рендер картинок сам предупреждает, если что-то налезает друг на друга или выходит за безопасные зоны Stories/Reels.
