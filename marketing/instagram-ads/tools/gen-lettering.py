#!/usr/bin/env python3
"""Генератор SVG-росчерков кампании 2 («ерекше жазулар»): подчёркивания, обводки, зачёркивания, стрелки, сердечки, искры, скобки,
маркерные мазки, галочки, завитки. Всё «нарисовано кистью»: переменный нажим, наклонное перо, дрожь руки, рваный край.

  python3 tools/gen-lettering.py                 → пишет src/lettering/*.svg и src/lettering/_preview.html
  python3 tools/gen-lettering.py --only ul1,ring2

Зависимости: numpy, shapely (только для генерации; итоговые SVG от них не зависят).
Каждый файл одноцветный: один <path fill="#000" fill-rule="evenodd"> — цвет задаётся в CSS через mask-image (см. src/lettering.css),
так же, как в ornament.css. Растягиваются под слово (preserveAspectRatio="none" + mask-size:100% 100%), поэтому у длинных знаков
(подчёркивания, маркеры, зачёркивания) штрих горизонтальный. Генерация детерминирована (seed = имя файла)."""
import math, os, sys, zlib
import numpy as np
from shapely.geometry import Polygon, Point, LineString, MultiPolygon
from shapely.ops import unary_union
from shapely import affinity

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "lettering")

# ───────────────────────── математика штриха ─────────────────────────
def catmull(pts, per=24, alpha=0.5):
    """центростремительный Catmull–Rom через опорные точки (концы дублируются)"""
    P = [np.array(p, float) for p in pts]
    if len(P) < 3:
        return np.array([P[0] + (P[-1] - P[0]) * t for t in np.linspace(0, 1, per)])
    P = [2 * P[0] - P[1]] + P + [2 * P[-1] - P[-2]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        t0 = 0.0
        t1 = t0 + max(np.linalg.norm(p1 - p0), 1e-6) ** alpha
        t2 = t1 + max(np.linalg.norm(p2 - p1), 1e-6) ** alpha
        t3 = t2 + max(np.linalg.norm(p3 - p2), 1e-6) ** alpha
        for t in np.linspace(t1, t2, per, endpoint=False):
            A1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
            A2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
            A3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
            B1 = (t2 - t) / (t2 - t0) * A1 + (t - t0) / (t2 - t0) * A2
            B2 = (t3 - t) / (t3 - t1) * A2 + (t - t1) / (t3 - t1) * A3
            out.append((t2 - t) / (t2 - t1) * B1 + (t - t1) / (t2 - t1) * B2)
    out.append(P[-2])
    return np.array(out)

def resample(c, ds):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(c, axis=0), axis=1))]
    n = max(int(d[-1] / ds), 8)
    s = np.linspace(0, d[-1], n)
    return np.c_[np.interp(s, d, c[:, 0]), np.interp(s, d, c[:, 1])], s / d[-1]

def smooth_noise(rng, n, scale=3.0, octaves=3):
    """гладкий шум n отсчётов, значения ~[-1,1]"""
    x = np.linspace(0, 1, n)
    y = np.zeros(n); amp = 1.0; tot = 0
    for o in range(octaves):
        f = scale * (2 ** o)
        y += amp * np.sin(2 * math.pi * (f * x + rng.random()) + rng.random() * 6.28)
        tot += amp; amp *= 0.5
    return y / tot

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a + 1e-9), 0, 1)
    return t * t * (3 - 2 * t)

_unit = [(math.cos(a), math.sin(a)) for a in np.linspace(0, 2 * math.pi, 18, endpoint=False)]

def stroke(pts, w, rng, nib=35, ratio=0.66, start=0.05, end=0.30, tip=0.10, s0=0.55, tremor=0.5,
           rough=0.035, press=0.14, per=24, dry=0.0, closed_taper=False):
    """Кисть-перо: эллиптический наконечник (ratio = мин/макс, угол nib) по кривой.
    start — доля длины на разгон нажима (начиная с s0·w), end — доля на сужение к концу (до tip·w),
    tremor — амплитуда дрожи (в единицах w/…), rough — рваность края, press — вариации нажима, dry — сухая кисть (полосы у конца)."""
    c = np.array(catmull(pts, per))
    c, s = resample(c, max(w * 0.10, 0.6))
    n = len(c)
    # дрожь руки: смещение по нормали
    t = np.gradient(c, axis=0); t /= (np.linalg.norm(t, axis=1)[:, None] + 1e-9)
    nrm = np.c_[-t[:, 1], t[:, 0]]
    c = c + nrm * (smooth_noise(rng, n, 2.2) * tremor * w * 0.18)[:, None]
    P = (s0 + (1 - s0) * smoothstep(0, max(start, 1e-3), s)) * (1 - (1 - tip) * smoothstep(1 - end, 1, s) ** 1.15)
    P *= 1 + press * smooth_noise(rng, n, 2.6)
    P *= 1 + rough * smooth_noise(rng, n, 23, 2) * 1.2
    th = math.radians(nib); ct, st = math.cos(th), math.sin(th)
    polys = []
    for (x, y), p in zip(c, P):
        a = w * p / 2; b = a * ratio
        polys.append(Polygon([(x + (ux * a) * ct - (uy * b) * st, y + (ux * a) * st + (uy * b) * ct) for ux, uy in _unit]))
    g = unary_union(polys)
    if dry > 0:   # полосы сухой кисти: вычитаем тонкие «щетинки» на последней трети мазка
        cuts = []
        m0 = int(n * (1 - dry))
        for k in range(int(4 + w / 6)):
            off = (rng.random() - 0.5) * w * 0.85
            a0 = m0 + int(rng.random() * (n - m0) * 0.55); a1 = min(n - 1, a0 + int((0.25 + rng.random() * 0.6) * (n - m0)))
            if a1 - a0 < 3: continue
            line = c[a0:a1] + nrm[a0:a1] * off
            cuts.append(LineString(line).buffer(w * (0.012 + 0.02 * rng.random()), cap_style=1))
        if cuts: g = g.difference(unary_union(cuts))
    return g

def barbed_arrow(shaft, w, rng, head=64, spread=27, **kw):
    """стрела: изогнутое древко + два «уса» у наконечника (нарисованы отдельными мазками)"""
    body = stroke(shaft, w, rng, **kw)
    c = catmull(shaft, 24); tip = c[-1]
    back = c[-1] - c[max(0, len(c) - 12)]; back = -back / (np.linalg.norm(back) + 1e-9)
    parts = [body]
    for sgn, ln, wob in ((1, head, 0.10), (-1, head * 0.92, -0.14)):
        a = math.radians(spread * sgn + (rng.random() - 0.5) * 6)
        d = np.array([back[0] * math.cos(a) - back[1] * math.sin(a), back[0] * math.sin(a) + back[1] * math.cos(a)])
        e = tip + d * ln
        mid = tip + d * ln * 0.5 + np.array([-d[1], d[0]]) * ln * wob * 0.5
        parts.append(stroke([e, mid, tip], w * 0.92, rng, nib=kw.get("nib", 35), ratio=kw.get("ratio", .66), start=0.02, s0=0.5, end=0.0, tip=1.0, tremor=0.3))
    return unary_union(parts)

def ellipse_pts(cx, cy, rx, ry, a0, a1, n=44, grow=0.0, rot=0.0, rng=None, wob=0.0):
    """точки по эллипсу (угол в градусах, против часовой на экране: y вниз → знак –), радиус плавно растёт/убывает (спираль)"""
    out = []
    ph = rng.random() * 6.28 if rng else 0
    for i in range(n):
        u = i / (n - 1)
        a = math.radians(a0 + (a1 - a0) * u)
        k = 1 + grow * u + wob * math.sin(a * 2 + ph)
        x = rx * k * math.cos(a); y = -ry * k * math.sin(a)
        xr = x * math.cos(rot) - y * math.sin(rot); yr = x * math.sin(rot) + y * math.cos(rot)
        out.append((cx + xr, cy + yr))
    return out

# ───────────────────────── вывод SVG ─────────────────────────
def to_path(g, digits=1, tol=0.16):
    g = g.simplify(tol, preserve_topology=True)
    polys = list(g.geoms) if isinstance(g, MultiPolygon) else ([g] if not g.is_empty else [])
    d = []
    def ring(coords):
        pts = [(round(x, digits), round(y, digits)) for x, y in coords[:-1]]
        if len(pts) < 3: return
        # сглаживание: квадратичные кривые через середины рёбер (углы кончика остаются мягкими, как у кисти)
        mids = [((pts[i][0] + pts[(i + 1) % len(pts)][0]) / 2, (pts[i][1] + pts[(i + 1) % len(pts)][1]) / 2) for i in range(len(pts))]
        f = lambda v: ("%.*f" % (digits, v)).rstrip("0").rstrip(".")
        d.append(f"M{f(mids[-1][0])} {f(mids[-1][1])}")
        for i, p in enumerate(pts):
            m = mids[i]
            d.append(f"Q{f(p[0])} {f(p[1])} {f(m[0])} {f(m[1])}")
        d.append("Z")
    for p in polys:
        if p.area < 1.0: continue
        ring(list(p.exterior.coords))
        for h in p.interiors:
            if Polygon(h).area > 4: ring(list(h.coords))
    return "".join(d)

def write_svg(name, W, H, g):
    minx, miny, maxx, maxy = g.bounds
    d = to_path(g)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" preserveAspectRatio="none"><path fill="#000" fill-rule="evenodd" d="{d}"/></svg>\n'
    open(os.path.join(OUT, name + ".svg"), "w").write(svg)
    return (minx, miny, maxx, maxy), len(svg)

def R(name): return np.random.default_rng(zlib.crc32(name.encode()))
class RN:  # обёртка: .random() как у random.Random — чтобы код читался проще
    def __init__(self, name): self.g = R(name)
    def random(self): return float(self.g.random())

SH = {}
def shape(name, W, H):
    def deco(fn):
        SH[name] = (W, H, fn); return fn
    return deco

# ───────────────────────── подчёркивания 600×80 ─────────────────────────
@shape("ul1", 600, 80)
def _(r):   # уверенный один росчерк с лёгким подъёмом к концу
    return stroke([(16, 50), (110, 43), (280, 38), (440, 36), (586, 25)], 22, r, nib=22, ratio=.6, start=.05, end=.34, tip=.08)
@shape("ul2", 600, 80)
def _(r):   # двойной: длинный + короткий обратный
    a = stroke([(14, 30), (150, 25), (340, 23), (583, 17)], 17, r, nib=20, ratio=.6, start=.04, end=.32, tip=.08)
    b = stroke([(505, 57), (380, 60), (200, 61), (92, 65)], 14, r, nib=20, ratio=.6, start=.03, end=.40, tip=.1)
    return unary_union([a, b])
@shape("ul3", 600, 80)
def _(r):   # волна
    pts = [(14 + i * 48, 42 + 12 * math.sin(i * 1.05 + .5)) for i in range(13)]
    return stroke(pts, 19, r, nib=15, ratio=.62, start=.05, end=.25, tip=.1, per=14)
@shape("ul4", 600, 80)
def _(r):   # с завитком-петлёй на конце
    main = [(12, 56), (120, 49), (300, 44), (440, 42), (530, 40), (572, 34), (590, 22), (574, 10), (556, 20), (566, 36), (596, 40)]
    return stroke(main, 18, r, nib=24, ratio=.6, start=.05, end=.14, tip=.12, per=20)
@shape("ul5", 600, 80)
def _(r):   # сухой маркер: широкий мазок, у конца видны щетинки
    return stroke([(34, 46), (170, 41), (330, 40), (470, 36), (566, 32)], 46, r, nib=6, ratio=.52, start=.02, end=.10, tip=.5, s0=.85, dry=.42, tremor=.6, rough=.05)

# ───────────────────────── маркерные мазки-подложки 600×110 ─────────────────────────
@shape("mark1", 600, 110)
def _(r):
    return stroke([(62, 62), (170, 57), (330, 54), (470, 52), (544, 50)], 124, r, nib=-10, ratio=.64, start=.02, end=.06, tip=.9, s0=.95, dry=.0, tremor=.5, rough=.045, press=.05)
@shape("mark2", 600, 110)
def _(r):   # два прохода маркером
    a = stroke([(46, 70), (300, 62), (556, 54)], 92, r, nib=-10, ratio=.6, start=.02, end=.05, tip=.9, s0=.95, dry=.0, rough=.045, press=.05)
    b = stroke([(54, 46), (300, 48), (546, 58)], 88, r, nib=-10, ratio=.6, start=.02, end=.05, tip=.9, s0=.95, dry=.0, rough=.045, press=.05)
    return unary_union([a, b])
@shape("mark3", 600, 110)
def _(r):   # мягкая кисть с округлыми краями
    return stroke([(50, 58), (190, 48), (340, 62), (470, 50), (556, 56)], 62, r, nib=0, ratio=.95, start=.05, end=.12, tip=.55, s0=.7, dry=.0, tremor=.9, rough=.03, press=.10)

# ───────────────────────── обводки 600×240 (+ круг 300×300) ─────────────────────────
@shape("ring1", 600, 240)
def _(r):   # овал одним росчерком, конец заходит за начало
    return stroke(ellipse_pts(300, 122, 268, 88, 128, 128 + 392, 46, grow=-.06, rot=math.radians(-2), rng=r, wob=.012), 14, r, nib=30, ratio=.55, start=.06, end=.22, tip=.1, per=10)
@shape("ring2", 600, 240)
def _(r):   # два неровных витка
    a = ellipse_pts(300, 120, 270, 92, 100, 100 + 372, 46, grow=-.02, rot=math.radians(2), rng=r, wob=.02)
    b = ellipse_pts(302, 122, 252, 80, 250, 250 + 350, 40, grow=.05, rot=math.radians(-3), rng=r, wob=.02)
    return unary_union([stroke(a, 11, r, nib=30, ratio=.55, start=.05, end=.25, per=10), stroke(b, 10, r, nib=30, ratio=.55, start=.05, end=.30, per=10)])
@shape("ring3", 600, 240)
def _(r):   # яйцо с хвостиком-«флажком»
    pts = ellipse_pts(292, 124, 262, 86, 200, 200 + 350, 40, grow=.02, rot=math.radians(-4), rng=r, wob=.015)
    pts = pts + [(pts[-1][0] + 40, pts[-1][1] - 26), (pts[-1][0] + 86, pts[-1][1] - 48)]
    return stroke(pts, 15, r, nib=35, ratio=.55, start=.06, end=.16, tip=.08, per=10)
@shape("ring4", 300, 300)
def _(r):   # круг-обводка под цифру/значок
    return stroke(ellipse_pts(150, 152, 126, 128, 100, 100 + 395, 46, grow=-.07, rng=r, wob=.012), 15, r, nib=30, ratio=.55, start=.06, end=.22, tip=.1, per=10)

# ───────────────────────── зачёркивания 600×120 ─────────────────────────
@shape("strike1", 600, 120)
def _(r):   # один решительный росчерк снизу-слева вверх-вправо
    return stroke([(14, 90), (160, 76), (320, 62), (470, 46), (588, 30)], 21, r, nib=18, ratio=.6, start=.03, end=.30, tip=.1, s0=.7)
@shape("strike2", 600, 120)
def _(r):   # два штриха
    a = stroke([(10, 74), (200, 63), (400, 52), (590, 44)], 16, r, nib=20, ratio=.6, start=.03, end=.25, tip=.1, s0=.7)
    b = stroke([(40, 50), (240, 61), (430, 70), (570, 84)], 15, r, nib=20, ratio=.6, start=.03, end=.28, tip=.1, s0=.7)
    return unary_union([a, b])
@shape("strike3", 600, 120)
def _(r):   # «замазали» — зигзаг-штриховка
    pts = [(24 + i * 68, 36 if i % 2 == 0 else 86) for i in range(9)]
    return stroke(pts, 13, r, nib=25, ratio=.65, start=.03, end=.12, tip=.2, s0=.7, per=9, tremor=.8)

# ───────────────────────── стрелки ─────────────────────────
@shape("arrow1", 300, 220)
def _(r):   # дуга сверху-слева вниз-вправо
    return barbed_arrow([(18, 34), (74, 20), (150, 38), (208, 98), (250, 160)], 17, r, head=70, spread=30, nib=30, ratio=.6, start=.05, end=.05, tip=1.0, s0=.6)
@shape("arrow2", 400, 140)
def _(r):   # почти прямая, вправо
    return barbed_arrow([(10, 82), (120, 74), (250, 66), (372, 60)], 17, r, head=72, spread=28, nib=25, ratio=.6, start=.05, end=.05, tip=1.0, s0=.6)
@shape("arrow3", 200, 300)
def _(r):   # вниз (к кнопке)
    return barbed_arrow([(62, 12), (34, 84), (76, 168), (108, 258)], 18, r, head=72, spread=28, nib=35, ratio=.6, start=.05, end=.05, tip=1.0, s0=.6)
@shape("arrow4", 360, 260)
def _(r):   # с петлёй
    return barbed_arrow([(14, 212), (100, 204), (156, 138), (112, 88), (78, 130), (132, 182), (222, 140), (330, 60)], 17, r, head=70, spread=28, nib=30, ratio=.6, start=.04, end=.04, tip=1.0, s0=.6, per=16)

# ───────────────────────── сердечки 300×280 ─────────────────────────
def heart_pts(cx, cy, s, t0, t1, n=70, rot=0.0, rng=None, wob=0.0):
    out = []
    ph = rng.random() * 6.28 if rng else 0
    for i in range(n):
        t = t0 + (t1 - t0) * i / (n - 1)
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        k = 1 + wob * math.sin(t * 3 + ph)
        x, y = x * k, y * k
        xr = x * math.cos(rot) - (-y) * math.sin(rot); yr = x * math.sin(rot) + (-y) * math.cos(rot)
        out.append((cx + xr * s, cy + yr * s))
    return out
@shape("heart1", 300, 280)
def _(r):   # контур одним движением: от нижнего кончика, со скрещением у кончика
    return stroke(heart_pts(150, 132, 8.6, math.pi - .25, math.pi + 2 * math.pi + .55, 80, math.radians(-4), r, .012), 15, r, nib=35, ratio=.58, start=.05, end=.2, tip=.1, per=8)
@shape("heart2", 300, 280)
def _(r):   # закрашенное сердце (кисть, неровный край)
    outer = Polygon(heart_pts(150, 130, 7.9, 0, 2 * math.pi, 140, math.radians(6), r, .02))
    edge = stroke(heart_pts(150, 130, 7.6, math.pi, math.pi + 2 * math.pi + .1, 80, math.radians(6), r, .02), 26, r, nib=35, ratio=.7, start=.03, end=.05, tip=.9, s0=.9, per=8)
    return unary_union([outer.buffer(0), edge])
@shape("heart3", 300, 280)
def _(r):   # двойной контур (второй виток чуть смещён)
    a = stroke(heart_pts(150, 136, 8.5, math.pi + .1, math.pi + 2 * math.pi + .5, 80, math.radians(-8), r, .012), 12, r, nib=35, ratio=.58, start=.05, end=.2, tip=.1, per=8)
    b = stroke(heart_pts(153, 130, 6.9, math.pi - .3, math.pi + 2 * math.pi + .1, 80, math.radians(5), r, .016), 10, r, nib=35, ratio=.58, start=.05, end=.25, tip=.1, per=8)
    return unary_union([a, b])

# ───────────────────────── искры 240×240 ─────────────────────────
def twinkle(cx, cy, R_, rot, rng, sx=1.0, sy=1.0, pinch=3.0, rough=.02):
    pts = []
    for i in range(72):
        t = 2 * math.pi * i / 72
        k = 1 + rough * math.sin(t * 7 + rng.random() * 0.05)
        x = R_ * abs(math.cos(t)) ** pinch * (1 if math.cos(t) >= 0 else -1) * k
        y = R_ * abs(math.sin(t)) ** pinch * (1 if math.sin(t) >= 0 else -1) * k
        x *= sx; y *= sy
        xr = x * math.cos(rot) - y * math.sin(rot); yr = x * math.sin(rot) + y * math.cos(rot)
        pts.append((cx + xr, cy + yr))
    return Polygon(pts).buffer(0)
@shape("spark1", 240, 240)
def _(r):
    return twinkle(120, 120, 108, math.radians(-6), r, sx=.8, sy=1.0, pinch=2.6)
@shape("spark2", 240, 240)
def _(r):   # лучи-«сияние»
    parts = []
    for k in range(9):
        a = math.radians(k * 40 + (r.random() - .5) * 14 - 90)
        r0 = 50 + r.random() * 8; r1 = 100 + r.random() * 16
        p0 = (120 + r0 * math.cos(a), 120 + r0 * math.sin(a)); p1 = (120 + r1 * math.cos(a + .04), 120 + r1 * math.sin(a + .04))
        parts.append(stroke([p0, ((p0[0] + p1[0]) / 2 + (r.random() - .5) * 4, (p0[1] + p1[1]) / 2 + (r.random() - .5) * 4), p1], 16, r, nib=30, ratio=.75, start=.001, end=.98, tip=.14, s0=1.0, tremor=.3, per=6))
    return unary_union(parts)
@shape("spark3", 240, 240)
def _(r):   # россыпь: большая, две малые и точка
    return unary_union([twinkle(96, 132, 84, math.radians(4), r, .82, 1.0, 2.6), twinkle(188, 62, 40, math.radians(-8), r, .85, 1.0, 2.6), twinkle(196, 178, 26, math.radians(10), r, .85, 1.0, 2.5),
                        Point(42, 44).buffer(9.5), ])
@shape("star1", 240, 240)
def _(r):   # пятиконечная звезда одним росчерком (контур)
    pts = []
    for k in range(5 * 2 + 3):
        ang = math.radians(-90 + k * 36 + 2)
        rr = 104 if k % 2 == 0 else 46
        pts.append((120 + rr * math.cos(ang) * (1 + (r.random() - .5) * .04), 128 + rr * math.sin(ang) * (1 + (r.random() - .5) * .04)))
    return stroke(pts, 13, r, nib=35, ratio=.6, start=.04, end=.08, tip=.4, s0=.7, per=4)

# ───────────────────────── скобки ─────────────────────────
@shape("bracket-l", 120, 420)
def _(r):
    return stroke([(100, 12), (50, 70), (24, 160), (22, 262), (50, 350), (100, 408)], 15, r, nib=10, ratio=.6, start=.06, end=.30, tip=.1, s0=.5)
@shape("bracket-r", 120, 420)
def _(r):
    return stroke([(20, 12), (70, 70), (96, 160), (98, 262), (70, 350), (20, 408)], 15, r, nib=-10, ratio=.6, start=.06, end=.30, tip=.1, s0=.5)
@shape("brace-h", 600, 130)
def _(r):   # фигурная скобка под фразой (остриё вниз)
    a = stroke([(12, 22), (24, 56), (110, 60), (230, 62), (280, 80), (300, 118)], 13, r, nib=20, ratio=.6, start=.05, end=.05, tip=.9, s0=.5)
    b = stroke([(588, 22), (576, 56), (490, 60), (370, 62), (320, 80), (300, 118)], 13, r, nib=20, ratio=.6, start=.05, end=.05, tip=.9, s0=.5)
    return unary_union([a, b])

# ───────────────────────── галочки 200×180 ─────────────────────────
@shape("tick1", 200, 180)
def _(r):
    return stroke([(14, 96), (44, 128), (72, 156), (110, 96), (190, 20)], 24, r, nib=30, ratio=.55, start=.04, end=.22, tip=.12, s0=.7, per=14)
@shape("tick2", 200, 180)
def _(r):   # галочка с росчерком
    return stroke([(16, 100), (66, 152), (108, 92), (150, 42), (186, 24), (196, 12)], 22, r, nib=30, ratio=.55, start=.04, end=.30, tip=.06, s0=.7, per=14)

# ───────────────────────── завитки-росчерки 600×120 (мотив қошқар мүйіз: завиток на концах) ─────────────────────────
def curl(cx, cy, r0, a0, turns, r1, n=40, sgn=1):
    out = []
    for i in range(n):
        u = i / (n - 1)
        a = math.radians(a0 + sgn * 360 * turns * u); rr = r0 + (r1 - r0) * u
        out.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return out
@shape("swash1", 600, 120)
def _(r):
    # средний росчерк + по завитку на концах
    mid = stroke([(120, 72), (210, 62), (300, 58), (390, 62), (480, 72)], 17, r, nib=15, ratio=.62, start=.10, end=.10, tip=.7, s0=.8)
    L_ = stroke([(150, 70)] + [(x, y) for x, y in curl(74, 50, 34, 100, 1.15, 6, 34, sgn=-1)][6:], 17, r, nib=15, ratio=.6, start=.03, end=.25, tip=.15, s0=.9, per=8)
    R_ = stroke([(450, 70)] + [(x, y) for x, y in curl(526, 50, 34, 80, 1.15, 6, 34, sgn=1)][6:], 17, r, nib=15, ratio=.6, start=.03, end=.25, tip=.15, s0=.9, per=8)
    return unary_union([mid, L_, R_])
@shape("swash2", 600, 120)
def _(r):   # длинный росчерк с одним большим завитком справа
    long_ = stroke([(10, 88), (140, 80), (300, 74), (430, 66), (500, 60)], 18, r, nib=15, ratio=.62, start=.05, end=.05, tip=.8, s0=.6)
    c_ = stroke([(470, 64)] + curl(530, 46, 42, 100, 1.3, 7, 40, sgn=1)[4:], 18, r, nib=15, ratio=.6, start=.03, end=.28, tip=.12, s0=.9, per=8)
    return unary_union([long_, c_])

# ───────────────────────── предпросмотр ─────────────────────────
def preview(names):
    cells = []
    for n in names:
        W, H, _ = SH[n]
        cells.append(f'<div class="c"><div class="t">{n} {W}×{H}</div><div class="p" style="width:{W}px;height:{H}px"><i style="-webkit-mask:url({n}.svg) 0 0/100% 100% no-repeat;mask:url({n}.svg) 0 0/100% 100% no-repeat"></i></div></div>')
    html = """<!doctype html><meta charset=utf-8><title>lettering preview</title><style>
body{margin:0;padding:20px;background:#FAF6EA;font:12px monospace;color:#10263A;width:1500px;display:flex;flex-wrap:wrap;gap:18px}
.c{background:#fff8;padding:8px;border:1px dashed #0003}.t{opacity:.6;margin-bottom:4px}.p{position:relative}.p i{position:absolute;inset:0;background:#0A87A5}
.dark{background:#0B2A4A}</style>""" + "".join(cells)
    open(os.path.join(OUT, "_preview.html"), "w").write(html)

if __name__ == "__main__":
    only = None
    if "--only" in sys.argv: only = sys.argv[sys.argv.index("--only") + 1].split(",")
    os.makedirs(OUT, exist_ok=True)
    names = [n for n in SH if not only or n in only]
    tot = 0
    for n in names:
        W, H, fn = SH[n]
        g = fn(RN(n))
        b, size = write_svg(n, W, H, g)
        oob = b[0] < -0.5 or b[1] < -0.5 or b[2] > W + 0.5 or b[3] > H + 0.5
        print(f"{n:9s} {size/1024:5.1f} КБ  bounds x {b[0]:.0f}..{b[2]:.0f} y {b[1]:.0f}..{b[3]:.0f} / {W}×{H}" + ("   ⚠ ВЫХОДИТ ЗА viewBox" if oob else ""))
        tot += size
    print(f"итого {tot/1024:.0f} КБ, файлов {len(names)}")
    preview(names)
