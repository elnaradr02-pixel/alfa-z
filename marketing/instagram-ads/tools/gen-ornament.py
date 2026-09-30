#!/usr/bin/env python3
"""Генератор SVG-орнамента кампании 2 (казахский орнамент, современный линейно-заливочный язык).

  python3 tools/gen-ornament.py                    → пишет src/ornament/*.svg (все)
  python3 tools/gen-ornament.py --only band,horns  → только выбранные

Зависимости: numpy, shapely  (pip install numpy shapely). Итоговые SVG от них не зависят.
Все файлы одноцветные: один <path fill="#000"> (без градиентов, обводок и трансформаций) — цвет задаётся в CSS
через mask-image (см. src/ornament.css). Геометрия строится математически: «волюта» қошқар мүйіз — клотоида
(спираль с растущей кривизной), кольца, ромбы, треугольники-тұмарша; булевы операции (вырезы, объединения) — shapely.
"""
import math, os, sys
import numpy as np
from shapely import affinity, set_precision, hausdorff_distance
from shapely.geometry import Polygon, MultiPolygon, LineString, Point, box
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "ornament")
FLAT_TOL = 0.02        # допуск при разбиении кривых на отрезки (единицы viewBox)
SIMPLIFY = 0.012       # допуск упрощения итогового контура
GRID = 0.01            # сетка координат в файле (2 знака)
USE_FIT = os.environ.get("ORN_POLY") != "1"     # ORN_POLY=1 — писать чистые полилинии (без подгонки Безье)

# ───────────────────────── аффинные преобразования ─────────────────────────
def M(a=1, b=0, c=0, d=1, e=0, f=0):
    return np.array([[a, c, e], [b, d, f], [0, 0, 1]], float)
def T(x, y): return M(e=x, f=y)
def Rot(deg, cx=0, cy=0):
    r = math.radians(deg); c, s = math.cos(r), math.sin(r)
    return T(cx, cy) @ M(c, s, -s, c) @ T(-cx, -cy)
def Sc(sx, sy=None, cx=0, cy=0):
    sy = sx if sy is None else sy
    return T(cx, cy) @ M(sx, 0, 0, sy) @ T(-cx, -cy)
def MirX(x0): return T(x0, 0) @ M(-1, 0, 0, 1) @ T(-x0, 0)      # зеркало относительно вертикали x=x0
def MirY(y0): return T(0, y0) @ M(1, 0, 0, -1) @ T(0, -y0)      # зеркало относительно горизонтали y=y0
def MirDiag(): return M(0, 1, 1, 0)                              # зеркало относительно диагонали y=x

# ───────────────────────── подгонка кубических Безье под полилинию (Schneider) ─────────────────────────
# Булевы операции дают плотные полилинии; для компактных и «гладких» файлов контур обратно переводится в кубики.
FIT_TOL = 0.035        # допуск подгонки (единицы viewBox)
CORNER_DEG = 38.0      # поворот в вершине больше этого угла считается углом (острый угол сохраняется)

def _unit(v):
    n = np.linalg.norm(v); return v / n if n > 1e-12 else v
def _bez_pts(b, t):
    t = np.asarray(t)[:, None]; u = 1 - t
    return u**3 * b[0] + 3 * u * u * t * b[1] + 3 * u * t * t * b[2] + t**3 * b[3]
def _bez_d1(b, t):
    t = np.asarray(t)[:, None]; u = 1 - t
    return 3 * u * u * (b[1] - b[0]) + 6 * u * t * (b[2] - b[1]) + 3 * t * t * (b[3] - b[2])
def _bez_d2(b, t):
    t = np.asarray(t)[:, None]; u = 1 - t
    return 6 * u * (b[2] - 2 * b[1] + b[0]) + 6 * t * (b[3] - 2 * b[2] + b[1])
def _chord(P):
    d = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]); return d / d[-1]
def _gen_bez(P, u, t1, t2):
    p0, p3 = P[0], P[-1]
    b0 = (1 - u)**3; b1 = 3 * u * (1 - u)**2; b2 = 3 * u * u * (1 - u); b3 = u**3
    A1 = t1[None, :] * b1[:, None]; A2 = t2[None, :] * b2[:, None]
    c00 = np.sum(A1 * A1); c01 = np.sum(A1 * A2); c11 = np.sum(A2 * A2)
    tmp = P - (p0[None, :] * (b0 + b1)[:, None] + p3[None, :] * (b2 + b3)[:, None])
    x0 = np.sum(A1 * tmp); x1 = np.sum(A2 * tmp)
    det = c00 * c11 - c01 * c01
    seg = np.linalg.norm(p3 - p0)
    if abs(det) > 1e-12:
        al = (x0 * c11 - x1 * c01) / det; ar = (c00 * x1 - c01 * x0) / det
    else: al = ar = 0
    if al < 1e-6 * seg or ar < 1e-6 * seg: al = ar = seg / 3
    return np.array([p0, p0 + t1 * al, p3 + t2 * ar, p3])
def _reparam(P, u, b):
    d = _bez_pts(b, u) - P; d1 = _bez_d1(b, u); d2 = _bez_d2(b, u)
    num = np.sum(d * d1, axis=1); den = np.sum(d1 * d1, axis=1) + np.sum(d * d2, axis=1)
    den = np.where(np.abs(den) < 1e-12, 1e-12, den)
    return np.clip(u - num / den, 0, 1)
def _fit_cubic(P, t1, t2, tol):
    if len(P) == 2:
        d = np.linalg.norm(P[1] - P[0]) / 3; return [np.array([P[0], P[0] + t1 * d, P[1] + t2 * d, P[1]])]
    u = _chord(P); b = _gen_bez(P, u, t1, t2)
    def err(b, u):
        e = np.linalg.norm(_bez_pts(b, u) - P, axis=1); e[0] = e[-1] = 0
        i = int(np.argmax(e)); return e[i], min(max(i, 1), len(P) - 2)
    e, sp = err(b, u)
    if e < tol: return [b]
    if e < tol * 12:
        for _ in range(10):
            u = _reparam(P, u, b); b = _gen_bez(P, u, t1, t2); e, sp = err(b, u)
            if e < tol: return [b]
    tc = _unit(P[sp - 1] - P[sp + 1])
    return _fit_cubic(P[:sp + 1], t1, tc, tol) + _fit_cubic(P[sp:], -tc, t2, tol)

def fit_ring(pts, tol=FIT_TOL):
    """Замкнутая полилиния (без повтора первой точки) → список сегментов [('L', p) | ('C', c1, c2, p)] и стартовая точка."""
    P = np.asarray(pts, float); n = len(P)
    if n < 4: return P[0], [("L", q) for q in P[1:]] + [("L", P[0])]
    prv = P - np.roll(P, 1, axis=0); nxt = np.roll(P, -1, axis=0) - P
    ang = np.degrees(np.arccos(np.clip(np.sum(prv * nxt, 1) / (np.linalg.norm(prv, axis=1) * np.linalg.norm(nxt, axis=1) + 1e-12), -1, 1)))
    corners = [i for i in range(n) if ang[i] > CORNER_DEG]
    segs = []
    def chain(Q):
        m = len(Q)
        if m == 2: return [("L", Q[1])]
        ch = Q[-1] - Q[0]; L = np.linalg.norm(ch)
        if L > 1e-9:
            dev = np.abs(ch[0] * (Q[:, 1] - Q[0, 1]) - ch[1] * (Q[:, 0] - Q[0, 0])) / L
            if dev.max() < 0.02: return [("L", Q[-1])]
        t1 = _unit(Q[1] - Q[0]); t2 = _unit(Q[-2] - Q[-1])
        if m > 4: t1 = _unit(Q[2] - Q[0]); t2 = _unit(Q[-3] - Q[-1])
        return [("C", b[1], b[2], b[3]) for b in _fit_cubic(Q, t1, t2, tol)]
    if not corners:
        Q = np.vstack([P, P[:1]])
        t1 = _unit(P[1] - P[-1]); t2 = -t1
        segs = [("C", b[1], b[2], b[3]) for b in _fit_cubic(Q, t1, t2, tol)]
        return P[0], segs
    k0 = corners[0]; P = np.roll(P, -k0, axis=0); corners = [(c - k0) % n for c in corners]
    corners = sorted(corners) + [n]
    for a, b in zip(corners[:-1], corners[1:]):
        Q = P[a:b + 1] if b < n else np.vstack([P[a:], P[:1]])
        segs += chain(Q)
    return P[0], segs

def _flat_segs(start, segs, n=24):
    pts = [np.asarray(start)]; cur = np.asarray(start)
    for sg in segs:
        if sg[0] == "L": pts.append(sg[1]); cur = sg[1]
        else:
            b = np.array([cur, sg[1], sg[2], sg[3]]); pts += list(_bez_pts(b, np.linspace(0, 1, n)[1:])); cur = sg[3]
    return np.array(pts)

# ───────────────────────── контуры из кубиков Безье ─────────────────────────
class Sub:
    """Замкнутый контур: старт + сегменты ('L', p) / ('C', c1, c2, p). solid=False — вырез."""
    def __init__(self, start, segs, solid=True):
        self.start = np.asarray(start, float); self.solid = solid
        self.segs = [(sg[0], *[np.asarray(q, float) for q in sg[1:]]) for sg in segs]
    def flat(self, tol=FLAT_TOL):
        pts = [self.start]; cur = self.start
        for sg in self.segs:
            if sg[0] == "L": pts.append(sg[1]); cur = sg[1]
            else:
                c1, c2, p = sg[1], sg[2], sg[3]
                dd = max(np.linalg.norm(cur - 2 * c1 + c2), np.linalg.norm(c1 - 2 * c2 + p))
                n = max(2, int(math.ceil(math.sqrt(0.75 * dd / tol))))
                for i in range(1, n + 1):
                    t = i / n; u = 1 - t
                    pts.append(u**3 * cur + 3 * u * u * t * c1 + 3 * u * t * t * c2 + t**3 * p)
                cur = p
        return np.array(pts)

def _poly(sub):
    pg = Polygon(sub.flat())
    return pg if pg.is_valid else pg.buffer(0)

def _polys(g):
    if g.is_empty: return []
    return [g] if isinstance(g, Polygon) else [x for x in getattr(g, "geoms", []) if isinstance(x, Polygon)]

class Shape:
    """Фигура = shapely-геометрия (объединение заливок минус вырезы). Все операции работают с геометрией целиком,
    поэтому вырез одной фигуры никогда не «пробивает» чужие."""
    def __init__(self, subs=None, g=None):
        if g is not None: self.g = g; return
        subs = list(subs or [])
        solids = [_poly(s) for s in subs if s.solid]; holes = [_poly(s) for s in subs if not s.solid]
        g = unary_union(solids) if solids else Polygon()
        if holes: g = g.difference(unary_union(holes))
        self.g = g
    @staticmethod
    def _g(x):
        if isinstance(x, Shape): return x.g
        if isinstance(x, Sub): return _poly(x)
        return x                                                      # shapely-геометрия
    def add(self, *o):
        """Объединить (меняет и возвращает self)."""
        self.g = unary_union([self.g] + [self._g(x) for x in o]); return self
    def plus(self, *o): return Shape(g=self.g).add(*o)                # то же, но возвращает новую
    def cut(self, *o):
        return Shape(g=self.g.difference(unary_union([self._g(x) for x in o])))
    def clip(self, geom): return Shape(g=self.g.intersection(self._g(geom)))
    def tf(self, m):
        return Shape(g=affinity.affine_transform(self.g, [m[0, 0], m[0, 1], m[1, 0], m[1, 1], m[0, 2], m[1, 2]]))
    def bounds(self): return self.g.bounds
    def d(self):
        g = set_precision(self.g, GRID)
        if SIMPLIFY: g = g.simplify(SIMPLIFY, preserve_topology=True)
        f = lambda v: ("%.2f" % v).rstrip("0").rstrip(".") if abs(round(v, 2)) > 0 else "0"
        fp = lambda p: f(p[0]) + " " + f(p[1])
        out = []
        for pg in _polys(g):
            pg = orient(pg, 1.0)
            for ring in [pg.exterior] + list(pg.interiors):
                c = np.array(ring.coords)[:-1]
                if len(c) < 3: continue
                if not USE_FIT:
                    out.append("M" + " ".join(fp(q) for q in c) + "Z"); continue
                start, segs = fit_ring(c)
                fl = _flat_segs(start, segs)
                if hausdorff_distance(LineString(fl), LineString(np.vstack([c, c[:1]])), densify=0.25) > 0.09:
                    out.append("M" + " ".join(fp(q) for q in c) + "Z"); continue     # запасной вариант — полилиния
                d = "M" + fp(start)
                for sg in segs:
                    d += ("L" + fp(sg[1])) if sg[0] == "L" else ("C" + " ".join(fp(q) for q in sg[1:]))
                out.append(d + "Z")
        return "".join(out)

# ───────────────────────── примитивы ─────────────────────────
KAPPA = 0.5522847498307936
def circle(cx, cy, r, solid=True):
    k = KAPPA * r
    return Sub((cx + r, cy), [
        ("C", (cx + r, cy + k), (cx + k, cy + r), (cx, cy + r)),
        ("C", (cx - k, cy + r), (cx - r, cy + k), (cx - r, cy)),
        ("C", (cx - r, cy - k), (cx - k, cy - r), (cx, cy - r)),
        ("C", (cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))], solid)
def ring(cx, cy, ro, ri): return Shape([circle(cx, cy, ro), circle(cx, cy, ri, False)])
def poly(pts, solid=True):
    pts = [np.asarray(p, float) for p in pts]
    return Sub(pts[0], [("L", p) for p in pts[1:]] + [("L", pts[0])], solid)
def rect(x, y, w, h, solid=True): return poly([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], solid)

def rpoly(pts, r, solid=True):
    """Многоугольник со скруглёнными углами (r — радиус скругления)."""
    P = [np.asarray(q, float) for q in pts]; n = len(P)
    segs = []; start = None
    for i in range(n):
        v, a, b = P[i], P[i - 1], P[(i + 1) % n]
        da, db = a - v, b - v
        la, lb = np.linalg.norm(da), np.linalg.norm(db)
        ang = math.acos(np.clip(np.dot(da, db) / (la * lb), -1, 1))
        t = min(r / math.tan(ang / 2), la / 2.2, lb / 2.2)
        p0 = v + da / la * t; p1 = v + db / lb * t
        k = 0.5523
        c0 = p0 + (v - p0) * k; c1 = p1 + (v - p1) * k
        if start is None: start = p0
        else: segs.append(("L", p0))
        segs.append(("C", c0, c1, p1))
    segs.append(("L", start))
    return Sub(start, segs, solid)

def smooth_closed(pts, solid=True):
    """Замкнутая гладкая кривая через точки (хордовая параметризация, кубические Эрмиты → Безье)."""
    P = np.asarray(pts, float); n = len(P)
    d = np.linalg.norm(np.roll(P, -1, axis=0) - P, axis=1)
    tang = np.zeros_like(P)
    for i in range(n):
        a, b = P[(i - 1) % n], P[(i + 1) % n]
        tang[i] = (b - a) / (d[(i - 1) % n] + d[i] + 1e-12)
    segs = []
    for i in range(n):
        j = (i + 1) % n
        segs.append(("C", P[i] + tang[i] * d[i] / 3, P[j] - tang[j] * d[i] / 3, P[j]))
    return Sub(P[0], segs, solid)

def geom_shape(g): return Shape(g=g)
def buf(coords, w, cap="round", join=1):
    """Ломаная толщиной w (cap: round|flat; join: 1 круглый, 2 острый, 3 срезанный)."""
    return Shape(g=LineString(coords).buffer(w / 2, cap_style=1 if cap == "round" else 2, join_style=join, quad_segs=16))
def disc(cx, cy, r): return Shape(g=Point(cx, cy).buffer(r, quad_segs=32))

# ───────────────────────── «волюта» — мүйіз ─────────────────────────
def clothoid(L, turn_deg, rend, ka=0.0, ds=4.0, dth=0.14):
    """Спираль с растущей кривизной k(u)=ka+(kb-ka)·u^p, u=s/L∈[0,1]; kb=1/rend — кривизна на конце.
    Старт (0,0) вдоль +x; поворот «по часовой» (в SVG: в сторону +y). p подбирается так, чтобы суммарный поворот = turn_deg.
    Возвращает точки Nx2, единичные касательные Nx2, долю длины u."""
    turn = math.radians(turn_deg); kb = 1.0 / rend
    p = L * (kb - ka) / (turn - L * ka) - 1.0
    if p < 0.25: raise ValueError("clothoid: p=%.2f — увеличьте turn или L / уменьшите rend" % p)
    kfun = lambda u: ka + (kb - ka) * u ** p
    uu = np.linspace(0, 1, 4001)
    dens = np.maximum(np.abs(kfun(uu)) * L / dth, L / ds)
    cum = np.concatenate([[0], np.cumsum((dens[1:] + dens[:-1]) / 2 * np.diff(uu))])
    n = int(math.ceil(cum[-1])) + 1
    u = np.interp(np.linspace(0, cum[-1], n), cum, uu)
    fine = np.linspace(0, 1, 20001)
    kk = kfun(fine)
    th = np.concatenate([[0], np.cumsum((kk[1:] + kk[:-1]) / 2 * np.diff(fine) * L)])
    step = L / 20000
    X = np.concatenate([[0], np.cumsum(np.cos((th[1:] + th[:-1]) / 2) * step)])
    Y = np.concatenate([[0], np.cumsum(np.sin((th[1:] + th[:-1]) / 2) * step)])
    x = np.interp(u, fine, X); y = np.interp(u, fine, Y); t = np.interp(u, fine, th)
    return np.stack([x, y], 1), np.stack([np.cos(t), np.sin(t)], 1), u

def stroke_shape(C, D, width, cap0="round", cap1="round", solid=True):
    """Контур штриха переменной ширины вдоль кривой C (касательные D). cap: 'round' | 'flat'. Возвращает Sub."""
    w = np.asarray(width, float)
    N = np.stack([-D[:, 1], D[:, 0]], 1)
    pts = list(C + N * (w / 2)[:, None])
    if cap1 == "round":
        base = math.atan2(D[-1][1], D[-1][0])
        for i in range(1, 6):
            a = math.pi / 2 - math.pi * i / 6
            pts.append(C[-1] + (w[-1] / 2) * np.array([math.cos(base + a), math.sin(base + a)]))
    pts += list((C - N * (w / 2)[:, None])[::-1])
    if cap0 == "round":
        base = math.atan2(D[0][1], D[0][0])
        for i in range(1, 6):
            a = -math.pi / 2 - math.pi * i / 6
            pts.append(C[0] + (w[0] / 2) * np.array([math.cos(base + a), math.sin(base + a)]))
    return smooth_closed(pts, solid)

class Horn:
    """Мүйіз: клотоида-штрих с сужением w0→w1."""
    def __init__(self, L, turn, rend, w0, w1, ka=0.0, wq=1.0, cap0="round"):
        self.C, self.D, self.u = clothoid(L, turn, rend, ka)
        self.w = w0 + (w1 - w0) * self.u ** wq
        self.cap0 = cap0
    def shape(self): return Shape([stroke_shape(self.C, self.D, self.w, self.cap0, "round")])
    def groove(self, u0, u1, w, cap0="round"):
        m = (self.u >= u0) & (self.u <= u1)
        return Shape([stroke_shape(self.C[m], self.D[m], np.full(m.sum(), w), cap0, "round")])

class Chain:
    """Составная осевая линия: дуги, отрезки, клотоиды; ширина меняется по частям."""
    def __init__(self, x, y, heading_deg):
        self.h = math.radians(heading_deg); self.pos = np.array([x, y], float)
        self.C, self.Dd, self.Wd = [], [], []
    def _push(self, pts, dirs, ws):
        pts = list(pts); dirs = list(dirs); ws = list(ws)
        if self.C: pts, dirs, ws = pts[1:], dirs[1:], ws[1:]
        self.C += pts; self.Dd += dirs; self.Wd += ws
    def line(self, length, w0, w1=None, n=None):
        w1 = w0 if w1 is None else w1
        n = n or max(2, int(length / 6) + 1)
        d = np.array([math.cos(self.h), math.sin(self.h)])
        pts = [self.pos + d * length * i / (n - 1) for i in range(n)]
        self._push(pts, [d] * n, [w0 + (w1 - w0) * i / (n - 1) for i in range(n)])
        self.pos = pts[-1]; return self
    def arc(self, r, sweep_deg, w0, w1=None):
        """Дуга радиуса r; sweep>0 — поворот «по часовой» в SVG (в сторону +y от направления движения)."""
        w1 = w0 if w1 is None else w1
        sgn = 1 if sweep_deg > 0 else -1
        n = max(3, int(abs(sweep_deg) / 6) + 1)
        nn = np.array([-math.sin(self.h), math.cos(self.h)]) * sgn
        cen = self.pos + nn * r
        a0 = math.atan2(self.pos[1] - cen[1], self.pos[0] - cen[0])
        pts, dirs = [], []
        for i in range(n):
            a = a0 + sgn * math.radians(abs(sweep_deg)) * i / (n - 1)
            pts.append(cen + r * np.array([math.cos(a), math.sin(a)]))
            hd = self.h + math.radians(sweep_deg) * i / (n - 1)
            dirs.append(np.array([math.cos(hd), math.sin(hd)]))
        self._push(pts, dirs, [w0 + (w1 - w0) * i / (n - 1) for i in range(n)])
        self.pos = pts[-1]; self.h += math.radians(sweep_deg); return self
    def horn(self, L, turn, rend, w0, w1, ka=0.0, wq=1.0, mirror=False):
        C, D, u = clothoid(L, turn, rend, ka)
        if mirror: C = C * np.array([1, -1]); D = D * np.array([1, -1])
        c, s_ = math.cos(self.h), math.sin(self.h)
        R = np.array([[c, -s_], [s_, c]])
        pts = C @ R.T + self.pos; dirs = D @ R.T
        self._push(pts, dirs, w0 + (w1 - w0) * u ** wq)
        self.pos = pts[-1]; self.h = math.atan2(dirs[-1][1], dirs[-1][0]); return self
    def arrays(self): return np.array(self.C), np.array(self.Dd), np.array(self.Wd)
    def shape(self, cap0="round", cap1="round"):
        C, D, W = self.arrays(); return Shape([stroke_shape(C, D, W, cap0, cap1)])
    def groove(self, f0, f1, w, cap0="round"):
        C, D, W = self.arrays(); n = len(C); i0, i1 = int(n * f0), int(n * f1)
        return Shape([stroke_shape(C[i0:i1], D[i0:i1], np.full(i1 - i0, w), cap0, "round")])

# ───────────────────────── композиция ─────────────────────────
def place(shape, x, y, ang=0, sx=1, sy=1): return shape.tf(T(x, y) @ Rot(ang) @ Sc(sx, sy))
def mirrored_pair(shape, x0=128): return Shape().add(shape, shape.tf(MirX(x0)))
def quad(shape, cx, cy):
    """Размножить фигуру по D2-симметрии относительно точки (cx,cy)."""
    return Shape().add(shape, shape.tf(MirX(cx)), shape.tf(MirY(cy)), shape.tf(MirX(cx)).tf(MirY(cy)))
def radial(shape, cx, cy, n, a0=0.0):
    out = Shape()
    for i in range(n): out.add(shape.tf(Rot(a0 + 360.0 * i / n, cx, cy)))
    return out
def polar(c, r, a_deg):
    """Точка на расстоянии r от центра (c,c); угол от «12 часов» по часовой стрелке."""
    a = math.radians(a_deg); return (c + r * math.sin(a), c - r * math.cos(a))

def fit(shape, W, H, margin=0):
    """Вписать фигуру в W×H с полями margin (равномерный масштаб, центрирование). Возвращает (shape, k)."""
    x0, y0, x1, y1 = shape.bounds()
    k = min((W - 2 * margin) / (x1 - x0), (H - 2 * margin) / (y1 - y0))
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return shape.tf(T(W / 2, H / 2) @ Sc(k) @ T(-cx, -cy)), k
def sized(shape):
    x0, y0, x1, y1 = shape.bounds(); return x1 - x0, y1 - y0

# ───────────────────────── мотивы ─────────────────────────
LYRE_PRM = (340, 440, 22, 26, 11, -0.005, -86)     # L, turn°, r_конца, w0, w1, ka, угол старта

def lyre(k=1.0, groove=True, slit=True, prm=LYRE_PRM, min_line=2.4):
    """Пара мүйіз (лира): основание в (0,0), ось вверх (−y); при k=1 ≈ 225 × 148 (ширина × высота).
    groove — инлайн-желобок вдоль штриха, slit — осевая прорезь по «стволу». Толщины масштабируются вместе с k,
    но желобок не тоньше min_line (в итоговых единицах), чтобы мелкие лиры не «зарастали»."""
    L, turn, rend, w0, w1, ka, a0 = prm
    h = Horn(L, turn, rend, w0, w1, ka)
    one = place(h.shape(), 0, 0, a0)
    A = Shape().add(one, one.tf(MirX(0)), circle(0, 0, w0 / 2))
    cuts = []
    if groove:
        g = place(h.groove(0.03, 0.62, max(3.4, min_line / k)), 0, 0, a0)
        cuts += [g, g.tf(MirX(0))]
    if slit:
        seg = A.g.intersection(LineString([(0, 30), (0, -400)]))
        ys = [c[1] for c in (seg.geoms[0].coords if hasattr(seg, "geoms") else seg.coords)]
        cuts.append(buf([(0, -9), (0, min(ys) + 6)], max(1.7, 0.6 * min_line / k)))     # от «развилки» вниз
    if cuts: A = A.cut(*cuts)
    return A.tf(Sc(k))

def d2cross(k=1.0, jewel=True):
    """Четыре волюты (два зеркальных «S», пересекающихся в центре): ≈ 233 × 180 при k=1."""
    h = Horn(250, 430, 17, 22, 10, -0.003)
    q = quad(place(h.shape(), 0, 0, -62), 0, 0)
    if jewel: q = q.add(circle(0, 0, 18)).cut(circle(0, 0, 7))
    return q.tf(Sc(k))

def diamond_pts(cx, cy, w, h): return [(cx, cy - h / 2), (cx + w / 2, cy), (cx, cy + h / 2), (cx - w / 2, cy)]
def diamond(cx, cy, w, h, r=0.0):
    pts = diamond_pts(cx, cy, w, h)
    return Shape([rpoly(pts, r) if r else poly(pts)])
def tri(cx, cy, w, h, up=True, r=0.0):
    """Треугольник (тұмарша): основание w, высота h, вершина вверх/вниз."""
    y0, y1 = (cy + h / 2, cy - h / 2) if up else (cy - h / 2, cy + h / 2)
    pts = [(cx - w / 2, y0), (cx + w / 2, y0), (cx, y1)]
    return Shape([rpoly(pts, r) if r else poly(pts)])

def nested_diamond(cx, cy, w, t=None, inner=True, dot=True):
    """Ромб в ромбе: кольцо-ромб + малое кольцо-ромб + точка."""
    t = t or w * 0.11
    sh = diamond(cx, cy, w, w, w * 0.04).cut(diamond(cx, cy, w - 2 * t * 1.414, w - 2 * t * 1.414, w * 0.02))
    if inner:
        wi = w * 0.5
        sh.add(diamond(cx, cy, wi, wi, w * 0.03).cut(diamond(cx, cy, wi - 2 * t * 1.414, wi - 2 * t * 1.414, w * 0.015)))
    if dot: sh.add(circle(cx, cy, w * 0.07))
    return sh

def star8(c, R, t):
    """Восьмиконечная звезда (два квадрата) — контур толщиной t, R — радиус вершин."""
    side = R * math.sqrt(2)
    sq = Polygon([(-side / 2, -side / 2), (side / 2, -side / 2), (side / 2, side / 2), (-side / 2, side / 2)])
    st = affinity.translate(unary_union([sq, affinity.rotate(sq, 45, origin=(0, 0))]), c, c)
    return geom_shape(st.exterior.buffer(t / 2, join_style=2, mitre_limit=3.0))

# ───────────────────────── вывод ─────────────────────────
def svg(w, h, shapes):
    body = "".join('<path fill="#000" d="%s"/>' % s.d() for s in shapes)
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d">%s</svg>\n' % (w, h, w, h, body)

def write(name, w, h, shapes):
    os.makedirs(OUT, exist_ok=True)
    s = svg(w, h, shapes)
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f: f.write(s)
    print("  %-22s %6d B" % (name, len(s.encode())))

BUILDERS = {}
def builder(name):
    def deco(fn): BUILDERS[name] = fn; return fn
    return deco

# ───────────────────────── файлы ─────────────────────────
@builder("horns")
def build_horns():
    A, _ = fit(lyre(1.0), 256, 256, 12)
    write("horns.svg", 256, 256, [A])

@builder("band")
def build_band():
    W, H = 128, 64
    rails = Shape().add(rect(0, 0, W, 4), rect(0, H - 4, W, 4))
    d = d2cross(1.0); w, _ = sized(d)
    dd = d.tf(Sc(56 / w)).tf(T(32, 32))
    dia = nested_diamond(96, 32, 40, t=3.2)
    dots = Shape([circle(64, 32, 2.4), circle(0, 32, 2.4), circle(128, 32, 2.4)])
    write("band.svg", W, H, [Shape().add(rails, dd, dots, dia)])

@builder("corner")
def build_corner():
    S = 256
    R = 30; off = 52; cx = off + R
    start = (cx - R * math.cos(math.radians(45)), cx - R * math.sin(math.radians(45)))
    ch = Chain(start[0], start[1], -45)
    ch.arc(R, 45, 18).line(60, 18).horn(240, 450, 15, 18, 8, 0.0)
    half = ch.shape("flat", "round")
    g = ch.groove(0.0, 0.62, 3.6, cap0="flat")
    scroll = Shape().add(half, half.tf(MirDiag())).cut(g, g.tf(MirDiag()))
    rail = buf([(S - 4, 3), (3, 3), (3, S - 4)], 6)
    rail2 = buf([(204, 18), (18, 18), (18, 204)], 2.4, join=2)
    beads = Shape([circle(212, 18, 3.4), circle(18, 212, 3.4)])
    dia = nested_diamond(cx, cx, 34, t=3.0, inner=False)
    write("corner.svg", S, S, [Shape().add(rail, rail2, beads, scroll, dia)])

@builder("medallion")
def build_medallion():
    S = 512; c = 256
    outer = ring(c, c, 250, 244)
    pearls = Shape([circle(*polar(c, 233, i * 360 / 48 + 3.75), 4.0) for i in range(48)])
    thin = ring(c, c, 219, 216.6)
    tooth = Shape([rpoly([(c - 15, c - 214), (c + 15, c - 214), (c, c - 186)], 2.2)])
    teeth = radial(tooth, c, c, 32, 5.625)
    ly = lyre(0.47)
    lyres = Shape()
    for i in range(8): lyres.add(ly.tf(T(c, c - 98)).tf(Rot(i * 45, c, c)))
    star = star8(c, 68, 5)
    jewel = Shape([circle(c, c, 26), circle(c, c, 10, False)])
    studs = Shape()
    for i in range(8):
        x, y = polar(c, 168, 22.5 + 45 * i)
        studs.add(diamond(x, y, 26, 26, 1.8).cut(diamond(x, y, 11, 11, 0.8)).add(circle(x, y, 2.6)).tf(Rot(22.5 + 45 * i, x, y)) if False else
                  diamond(x, y, 26, 26, 1.8).cut(diamond(x, y, 11, 11, 0.8)).add(circle(x, y, 2.6)))
    write("medallion.svg", S, S, [Shape().add(outer, pearls, thin, teeth, lyres, star, jewel, studs)])

# ── арка (рамка под фото / карточку) ──
ARCH_W, ARCH_H = 512, 640
ARCH_TOP, ARCH_R, ARCH_BOTTOM = 120, 236, 624
def arch_contour(offset=0.0):
    """Контур арки (полукруг + прямоугольник, скруглённые нижние углы), сдвинутый внутрь на offset."""
    cx, rc = 256, 40
    base = unary_union([Point(cx, ARCH_TOP + ARCH_R).buffer(ARCH_R, quad_segs=64), box(cx - ARCH_R, ARCH_TOP + ARCH_R, cx + ARCH_R, ARCH_BOTTOM)])
    base = base.buffer(-rc, join_style=1).buffer(rc, join_style=1, quad_segs=32)      # скругление нижних углов
    return base.buffer(-offset, join_style=1, quad_segs=32) if offset else base

def along(ring, step, start=0.0):
    """Точки и углы касательной вдоль кольца с шагом ≈ step; start — доля длины начала."""
    L = ring.length; n = max(1, int(round(L / step)))
    out = []
    for i in range(n):
        s0 = (start + i / n) % 1.0 * L
        p = ring.interpolate(s0).coords[0]
        q = ring.interpolate((s0 + 0.5) % L).coords[0]; o = ring.interpolate((s0 - 0.5) % L).coords[0]
        out.append((p[0], p[1], math.degrees(math.atan2(q[1] - o[1], q[0] - o[0]))))
    return out

@builder("frame-arch")
def build_arch():
    C0 = arch_contour()
    outer = C0.difference(arch_contour(9))
    thin = arch_contour(42.5).difference(arch_contour(46))
    track = arch_contour(26).exterior
    cxa, cya = 256, ARCH_TOP + ARCH_R
    rt = ARCH_R - 26
    studs = [(256, ARCH_BOTTOM - 26), (46, cya), (466, cya),
             (cxa - rt * math.cos(math.radians(45)), cya - rt * math.sin(math.radians(45))),
             (cxa + rt * math.cos(math.radians(45)), cya - rt * math.sin(math.radians(45)))]
    near = lambda x, y, r: any(math.hypot(x - sx, y - sy) < r for sx, sy in studs)
    step = 46.0
    n = round(track.length / step)
    dia = Shape(); pearls = Shape()
    for x, y, a in along(track, step, start=0.0):
        if not near(x, y, 33): dia.add(diamond(x, y, 22, 22, 1.5))
    for x, y, a in along(track, step, start=0.5 / n):
        if not near(x, y, 27): pearls.add(circle(x, y, 3.0))
    st = Shape()
    for x, y in studs: st.add(diamond(x, y, 34, 34, 2.2).cut(diamond(x, y, 14, 14, 1.0)).add(circle(x, y, 3.4)))
    crown = lyre(0.74).tf(T(256, ARCH_TOP + 6)).cut(arch_contour(9))
    write("frame-arch.svg", ARCH_W, ARCH_H, [Shape().add(outer, thin, pearls, dia, st, crown)])

@builder("frame-arch-in")
def build_arch_in():
    write("frame-arch-in.svg", ARCH_W, ARCH_H, [Shape(g=arch_contour(44))])

@builder("pattern-tile")
def build_pattern():
    S = 160
    d = d2cross(1.0, jewel=False); w, _ = sized(d)
    k = 46 / w
    # тонкий штрих: перестроим с уменьшенными толщинами
    h = Horn(250, 430, 17, 22, 10, -0.003)
    q = quad(place(h.shape(), 0, 0, -62), 0, 0)
    q = q.tf(Sc(k))
    def cross(cx, cy): return q.tf(T(cx, cy))
    def dia(cx, cy): return nested_diamond(cx, cy, 32, t=2.6, inner=False, dot=True)
    parts = [cross(40, 40), cross(120, 120), dia(120, 40), dia(40, 120)]
    dots = [circle(80, 40, 2.4), circle(80, 120, 2.4), circle(40, 80, 2.4), circle(120, 80, 2.4)]
    write("pattern-tile.svg", S, S, [Shape().add(*parts, *dots)])

if __name__ == "__main__":
    only = None
    for i, a in enumerate(sys.argv):
        if a == "--only": only = sys.argv[i + 1].split(",")
    for k, fn in BUILDERS.items():
        if only and k not in only: continue
        fn()
