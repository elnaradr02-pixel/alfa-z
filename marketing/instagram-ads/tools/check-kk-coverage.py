#!/usr/bin/env python3
"""Проверка покрытия казахской кириллицы шрифтами — по cmap реальных woff2, с учётом unicode-range и порядка @font-face.

  python3 tools/check-kk-coverage.py [css ...]          (по умолчанию: src/fonts.css src/fonts-c2.css — как в креативах кампании 2)
  python3 tools/check-kk-coverage.py src/fonts.css                    ← покажет, что Manrope/Unbounded казахских букв НЕ содержат
  python3 tools/check-kk-coverage.py src/fonts.css src/fonts-c2.css   ← итог с заплатками (фактическая картина в креативах)

Как выбирает Chromium (проверено опытом): все @font-face одной группы (family + style + weight-диапазон) образуют составной шрифт; для символа
перебираются грани, чей unicode-range его содержит (поздние объявления — раньше), берётся первая, где глиф реально есть. Так же считаем.
ВАЖНО: дескрипторы font-style/font-weight у граней-заплаток должны совпадать с основной группой — иначе браузер выберет ОДНУ группу.
Требует: pip install fonttools brotli.  Код возврата 1, если у какого-то семейства чего-то не хватает."""
import re, sys, os
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
paths = sys.argv[1:] or [os.path.join(ROOT, "src", "fonts.css"), os.path.join(ROOT, "src", "fonts-c2.css")]
UP = "АӘБВГҒДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ"
LETTERS = sorted(set(UP + UP.lower()))
assert len(LETTERS) == 84

def ranges(s):
    out = []
    for part in s.split(","):
        part = part.strip().lstrip("Uu+")
        if not part: continue
        a, _, b = part.partition("-")
        out.append((int(a, 16), int(b or a, 16)))
    return out

faces = []
for path in paths:
    base = os.path.dirname(os.path.abspath(path))
    css = open(path, encoding="utf8").read()
    for m in re.finditer(r"@font-face\s*\{(.*?)\}", css, re.S):
        body = m.group(1)
        g = lambda k: (re.search(k + r"\s*:\s*([^;]+);", body) or [None, ""])[1].strip()
        url = re.search(r"url\(['\"]?([^'\")]+)", body).group(1)
        faces.append(dict(fam=g("font-family").strip("'\""), style=g("font-style"), weight=g("font-weight"), file=os.path.normpath(os.path.join(base, url)),
                          ur=ranges(g("unicode-range")) or [(0, 0x10FFFF)]))

cmaps = {}
def cmap(f):
    if f not in cmaps: cmaps[f] = set(TTFont(f).getBestCmap())
    return cmaps[f]

groups = {}
for f in faces: groups.setdefault((f["fam"], f["style"], f["weight"]), []).append(f)

bad = 0
for key, fs in groups.items():
    if not any("cyrillic" in os.path.basename(f["file"]) for f in fs):
        continue   # ₸-заплатки, латиница и т.п. не проверяем
    miss, donors = [], set()
    for ch in LETTERS:
        cp = ord(ch)
        chosen = next((f for f in reversed(fs) if any(a <= cp <= b for a, b in f["ur"]) and cp in cmap(f["file"])), None)
        if chosen is None: miss.append(ch)
        elif not os.path.basename(chosen["file"]).startswith(key[0].lower().split()[0]): donors.add(os.path.basename(chosen["file"]).split("-")[0])
    note = ("  (часть знаков — из донора: " + ", ".join(sorted(donors)) + ")") if donors else ""
    print(f"{key[0]:14s} {key[1]:7s} {key[2]:8s} {84 - len(miss)}/84", ("  НЕ ХВАТАЕТ: " + "".join(miss)) if miss else "  ok" + note)
    bad += bool(miss)
sys.exit(1 if bad else 0)
