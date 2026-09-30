#!/usr/bin/env python3
"""WCAG-контраст ролей леттеринга (src/lettering.css) на всех темах themes-c2.css — светлая и тёмная сцена.
  python3 tools/contrast-lettering.py [src/themes-c2.css]
Роли: см. шапку lettering.css (--lt-hero, --lt-b, --lt-a, --lt-mark/--lt-on-mark, --lt-orn-*). Пороги: главная рукописная фраза и
текст на маркере — ≥ 3:1 (крупный текст ≥ 96 px по WCAG 1.4.3); декор (росчерки, штрихи) — информативно, ≥ 1.5:1 против фона."""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "src", "themes-c2.css")
css = open(path, encoding="utf8").read()
def rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def lum(c):
    f = lambda v: (v/255)/12.92 if v/255 <= .03928 else (((v/255)+.055)/1.055)**2.4
    r, g, b = map(f, c); return .2126*r + .7152*g + .0722*b
def cr(a, b):
    la, lb = lum(a), lum(b); la, lb = max(la, lb), min(la, lb); return (la+.05)/(lb+.05)
def mix(fg, bg, a): return tuple(round(f*a + b*(1-a)) for f, b in zip(fg, bg))
themes = {}
for m in re.finditer(r'\.theme-([\w-]+)\s*\{([^}]*)\}', css):
    themes[m.group(1)] = {k: rgb(v.strip()) for k, v in re.findall(r'--([\w-]+)\s*:\s*(#[0-9A-Fa-f]{6})', m.group(2))}
bad = 0
print("роль                                     " + "  ".join(f"{t:>7s}" for t in themes))
def row(name, fn, need):
    global bad
    vals = []
    for t, T in themes.items():
        v = fn(T, t); vals.append(v)
    flag = "" if all(v >= need for v in vals) else "   ← ниже порога %.1f" % need
    bad += bool(flag)
    print(f"{name:40s} " + "  ".join(f"{v:6.1f}:1" for v in vals) + flag)
gold = lambda T, t: T["accent"] if t == "altyn" else T["hi"]
ongold = lambda T, t: T["on-accent"] if t == "altyn" else T["on-hi"]
deep = lambda T, t: T["accent-d"]   # у altyn это бронза (hi — светлая бирюза для тёмной сцены)
print("── светлая сцена (фон paper)")
row("hero (--lt-deep) на paper", lambda T, t: cr(deep(T, t), T["paper"]), 3.0)
row("note/circle (--lt-b = deep) на paper", lambda T, t: cr(deep(T, t), T["paper"]), 3.0)
row("ink на маркере (gold 88% на paper)", lambda T, t: cr(T["ink"], mix(gold(T, t), T["paper"], .88)), 7.0)
row("[декор] подчёркивание gold на paper", lambda T, t: cr(gold(T, t), T["paper"]), 1.5)
row("[декор] штрих coral (logo-accent) на paper", lambda T, t: cr((255, 107, 71), T["paper"]), 1.5)
row("ink приглушённый (68%) на paper", lambda T, t: cr(mix(T["ink"], T["paper"], .68), T["paper"]), 4.5)
row("drop: буква paper на deep (крупная)", lambda T, t: cr(T["paper"], deep(T, t)), 3.0)
row("orn: gold-мотив на deep-базе", lambda T, t: cr(gold(T, t), deep(T, t)), 1.5)
print("── тёмная сцена (фон night)")
row("hero (gold) на night", lambda T, t: cr(gold(T, t), T["night"]), 3.0)
row("note/circle (--lt-b = gold) на night", lambda T, t: cr(gold(T, t), T["night"]), 3.0)
row("on-gold на маркере (gold)", lambda T, t: cr(ongold(T, t), gold(T, t)), 7.0)
row("[декор] подчёркивание accent-2 на night", lambda T, t: cr(T["accent-2"], T["night"]), 1.5)
row("[декор] штрих coral на night", lambda T, t: cr((255, 107, 71), T["night"]), 1.5)
row("paper приглушённый (62%) на night", lambda T, t: cr(mix(T["paper"], T["night"], .62), T["night"]), 4.5)
row("drop: буква gold на night-2 (крупная)", lambda T, t: cr(gold(T, t), T["night-2"]), 3.0)
row("orn: night-мотив на gold-базе", lambda T, t: cr(T["night"], gold(T, t)), 1.5)
sys.exit(1 if bad else 0)
