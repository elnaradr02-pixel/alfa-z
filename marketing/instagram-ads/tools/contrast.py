#!/usr/bin/env python3
"""Проверка контраста тем (WCAG 2.x). Использование:
  python3 tools/contrast.py [путь/к/themes.css]      (по умолчанию src/themes.css)
Печатает таблицу по каждой теме; код выхода 1, если есть нарушения обязательных порогов."""
import re, sys, os, math
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "src", "themes.css")
css = open(path, encoding="utf-8").read()

def parse(css):
    themes = {}
    for m in re.finditer(r'((?:[:\w.\-, \n]+))\{([^}]*)\}', css):
        sel, body = m.group(1), m.group(2)
        names = re.findall(r'\.theme-([\w\-]+)', sel)
        if not names: continue
        toks = dict(re.findall(r'--([\w\-]+)\s*:\s*([^;]+);', body))
        for n in names: themes.setdefault(n, {}).update(toks)
    return themes

def rgb(h):
    h = h.strip().lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def lum(c):
    def f(v):
        v /= 255
        return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126*r + 0.7152*g + 0.0722*b

def cr(a, b):
    la, lb = lum(rgb(a)), lum(rgb(b))
    if la < lb: la, lb = lb, la
    return (la+0.05)/(lb+0.05)

def hue(h):
    r, g, b = [v/255 for v in rgb(h)]
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == mn: return 0
    d = mx-mn
    hh = ((g-b)/d) % 6 if mx == r else ((b-r)/d + 2 if mx == g else (r-g)/d + 4)
    return round(hh*60)

# (название, foreground, background, минимум обязательный, рекомендуемый)
PAIRS = [
 ("текст ink на paper",         "ink",       "paper",  7.0, 12.0),
 ("текст ink на tint",          "ink",       "tint",   7.0, 10.0),
 ("текст paper на night",       "paper",     "night",  7.0, 12.0),
 ("текст paper на night-2",     "paper",     "night-2",7.0, 10.0),
 ("кнопка: on-accent на accent","on-accent", "accent", 3.0, 4.5),
 ("наклейка: on-hi на hi",      "on-hi",     "hi",     7.0, 9.0),
 ("акцент-текст accent-d на paper","accent-d", "paper",  3.0, 4.5),
 ("акцент-текст accent на night","accent",   "night",  4.5, 6.0),
 ("accent-2 на night",          "accent-2",  "night",  4.5, 7.0),
 ("hi на night",                "hi",        "night",  4.5, 7.0),
 ("ink на accent (маркер/пузыри)","ink",     "accent", 3.0, 4.5),
]
themes = parse(css); bad = 0
print(f"Файл: {path}   тем: {len(themes)}")
for name, t in themes.items():
    print(f"\n● theme-{name}   accent {t.get('accent')}  hue≈{hue(t['accent']) if 'accent' in t else '?'}°")
    for label, fg, bg, must, rec in PAIRS:
        if fg not in t or bg not in t: print(f"   ? нет токена для «{label}»"); bad += 1; continue
        v = cr(t[fg].strip(), t[bg].strip())
        flag = "OK " if v >= rec else ("ok~" if v >= must else "FAIL")
        if v < must: bad += 1
        print(f"   {flag}  {v:5.1f}:1  {label}   (мин {must}, реком {rec})")
hs = sorted((hue(t['accent']), n) for n, t in themes.items() if 'accent' in t)
print("\nОттенки акцентов:", ", ".join(f"{n} {h}°" for h, n in hs))
for i in range(len(hs)):
    a, b = hs[i], hs[(i+1) % len(hs)]
    d = (b[0]-a[0]) % 360
    if len(hs) > 1 and d < 20: print(f"   ⚠ {a[1]} и {b[1]} слишком близки по оттенку ({d}°)")
print(f"\nНарушений обязательных порогов: {bad}")
sys.exit(1 if bad else 0)
