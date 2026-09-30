#!/usr/bin/env python3
"""Контакт-лист: python3 contact.py out.png 4x5|9x16 [префиксы...]  — сетка превью для быстрой проверки."""
import sys, glob, os
from PIL import Image, ImageDraw
out, ratio, pref = sys.argv[1], sys.argv[2], sys.argv[3:]
files = sorted(f for f in glob.glob(f"out/statics/*_{ratio}.png") if not pref or any(os.path.basename(f).startswith(p) for p in pref))
W = 420 if ratio == "4x5" else 300
cols = min(len(files), 4 if ratio == "4x5" else 5)
ims = []
for f in files:
    im = Image.open(f).convert("RGB"); h = int(im.height * W / im.width); ims.append((os.path.basename(f)[:3], im.resize((W, h), Image.LANCZOS)))
rows = (len(ims) + cols - 1) // cols
H = ims[0][1].height
sheet = Image.new("RGB", (cols * (W + 14) + 14, rows * (H + 14) + 14), (30, 30, 36))
for i, (n, im) in enumerate(ims):
    sheet.paste(im, (14 + (i % cols) * (W + 14), 14 + (i // cols) * (H + 14)))
sheet.save(out); print(out, sheet.size)
