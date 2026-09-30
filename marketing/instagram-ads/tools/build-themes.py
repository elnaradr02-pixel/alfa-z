#!/usr/bin/env python3
"""Собирает src/themes.css из src/themes.json (единый источник цветов; rgb-варианты считаются автоматически).
   python3 tools/build-themes.py [--json src/themes.json] [--out src/themes.css]
Правьте ТОЛЬКО json (hex-значения), затем запускайте сборку и tools/contrast.py."""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
a = sys.argv[1:]
def opt(k, d):
    return a[a.index('--' + k) + 1] if ('--' + k) in a else d
src = opt('json', os.path.join(ROOT, 'src', 'themes.json')); dst = opt('out', os.path.join(ROOT, 'src', 'themes.css'))
themes = json.load(open(src, encoding='utf-8'))
def rgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return ','.join(str(int(h[i:i+2], 16)) for i in (0, 2, 4))
RGB = ['accent', 'accent-d', 'accent-2', 'hi', 'paper', 'tint', 'ink', 'night', 'night-2']
HEAD = """/* СГЕНЕРИРОВАНО tools/build-themes.py из src/themes.json — не правьте вручную.
   Токены переключаются классом на <body class="theme-XXX">. Для каждого цвета есть -rgb вариант: rgba(var(--accent-rgb), .5).
   --accent основной акцент (кнопка, маркер) · --accent-d тёмный оттенок · --accent-2 парный светлый (свечение, градиенты)
   --on-accent текст на акценте · --hi/--on-hi «наклейка» и текст на ней · --paper/--tint светлая поверхность/подложка
   --ink текст на светлом · --night/--night-2 тёмная сцена и панели · --logo-* плитка и буквы логотипа (фирменный коралл). */
"""
blocks = []
for name, t in themes.items():
    lines = [f"  --{k}: {v};" for k, v in t.items() if k != 'note']
    lines += [f"  --{k}-rgb: {rgb(t[k])};" for k in RGB]
    sel = f":root, .theme-{name}" if name == 'coral' else f".theme-{name}"
    note = f"/* {t.get('note','')} */\n" if t.get('note') else ''
    blocks.append(note + sel + " {\n" + "\n".join(lines) + "\n}")
open(dst, 'w', encoding='utf-8').write(HEAD + "\n" + "\n\n".join(blocks) + "\n")
print("themes.css ←", src, "·", ", ".join(themes))
