#!/usr/bin/env python3
"""Синтезатор саундтрека и звуковых эффектов для видео-креативов (numpy/scipy, без внешних сэмплов —
музыка оригинальная, лицензионных ограничений нет).

usage: synth.py cues.json out.wav
cues.json = {
  "duration": 24.0,
  "cues":  [{"t": 1.2, "type": "whoosh", "gain": 1.0}, ...],
  "music": {"bpm": 104, "mood": "bright" | "dark", "intro": 1.6, "gain": 0.55, "drums": true}
}
Типы эффектов: whoosh, swipe, pop, tick, ding, success, notif, impact, riser, glitch, scratch
"""
import json, sys
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve

SR = 44100
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, fc, order=2):
    b, a = butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low")
    return lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "high")
    return lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = butter(order, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], "band")
    return lfilter(b, a, x)


def tarr(d):
    return np.arange(int(d * SR)) / SR


def exp_env(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def add(buf, x, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf) or i + len(x) <= 0:
        return
    if i < 0:
        x = x[-i:]
        i = 0
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n] * gain


def pan(mono, p=0.0):
    """p ∈ [-1, 1] → стерео (N,2)"""
    l = np.sqrt((1 - p) / 2)
    r = np.sqrt((1 + p) / 2)
    return np.stack([mono * l, mono * r], axis=1)


# ───────────── эффекты ─────────────
def fx_whoosh(d=0.55, up=True):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    # прогрессивный фильтр: несколько полос со сдвигом центра
    for i in range(24):
        a, b = i * n // 24, (i + 1) * n // 24
        prog = i / 23 if up else 1 - i / 23
        fc = 300 * (14 ** prog)
        seg = bp(x[a:b + 400][:b - a + 400], fc * 0.7, fc * 1.4)[:b - a]
        out[a:b] = seg
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return out * env * 2.2


def fx_swipe():
    return fx_whoosh(0.28, up=False) * 0.8


def fx_pop():
    t = tarr(0.16)
    f = 900 * np.exp(-t * 14) + 260
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
    x += hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 200) * 0.25
    return x * 0.9


def fx_tick():
    t = tarr(0.05)
    x = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 130)
    x += np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 90) * 0.4
    return x * 0.55


def fx_ding(base=1318.5):
    t = tarr(1.1)
    x = np.zeros(len(t))
    for k, (m, a, dec) in enumerate([(1, 1.0, 4.5), (2.76, 0.45, 6), (5.4, 0.2, 9), (0.5, 0.35, 3)]):
        x += a * np.sin(2 * np.pi * base * m * t) * np.exp(-t * dec)
    return x * 0.5


def fx_success():
    out = np.zeros(int(1.4 * SR))
    for i, n in enumerate([72, 76, 79, 84]):
        t = tarr(0.9)
        f = midi(n)
        x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 5)
        add(out, x * 0.6, i * 0.085)
    return out


def fx_notif():
    out = np.zeros(int(0.8 * SR))
    for i, n in enumerate([88, 95]):
        t = tarr(0.5)
        f = midi(n)
        x = np.sin(2 * np.pi * f * t) * np.exp(-t * 9) + 0.3 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 20)
        add(out, x * 0.55, i * 0.11)
    return out


def fx_impact():
    t = tarr(1.0)
    f = 110 * np.exp(-t * 6) + 38
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    n = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 9) * 0.5
    return (x + n) * 1.1


def fx_riser(d=1.6):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for i in range(32):
        a, b = i * n // 32, (i + 1) * n // 32
        fc = 400 * (12 ** (i / 31))
        out[a:b] = bp(x[a:b + 300][:b - a + 300], fc * 0.8, fc * 1.3)[:b - a]
    env = np.linspace(0, 1, n) ** 2.2
    return out * env * 2.0


def fx_glitch():
    t = tarr(0.22)
    x = rng.standard_normal(len(t))
    x = np.repeat(x[::60], 60)[:len(t)]
    x *= (np.sin(2 * np.pi * 34 * t) > 0)
    return lp(x, 6000) * np.exp(-t * 8) * 0.6


def fx_scratch():
    t = tarr(0.35)
    f = 200 + 1400 * np.abs(np.sin(2 * np.pi * 3.5 * t))
    x = (2 * ((np.cumsum(f) / SR) % 1) - 1) * np.exp(-t * 6)
    return lp(x, 3500) * 0.35


FX = {
    "whoosh": fx_whoosh, "swipe": fx_swipe, "pop": fx_pop, "tick": fx_tick, "ding": fx_ding, "success": fx_success,
    "notif": fx_notif, "impact": fx_impact, "riser": fx_riser, "glitch": fx_glitch, "scratch": fx_scratch,
}


# ───────────── музыка ─────────────
CHORDS = {
    # (корень бас, аккорд-ноты)
    "C": (36, [60, 64, 67]), "G": (43, [59, 62, 67]), "Am": (45, [57, 60, 64]), "F": (41, [57, 60, 65]),
    "Em": (40, [59, 64, 67]), "Dm": (38, [57, 62, 65]),
}
PROGS = {
    "bright": ["C", "G", "Am", "F"],
    "dark": ["Am", "F", "C", "G"],
    "hopeful": ["F", "C", "G", "Am"],
}


def kick(d=0.4):
    t = tarr(d)
    f = 48 + 130 * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    x += hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 260) * 0.3
    return x * 1.0


def clap(d=0.22):
    t = tarr(d)
    n = bp(rng.standard_normal(len(t)), 900, 3800)
    env = np.exp(-t * 22) + 0.6 * np.exp(-((t - 0.012) ** 2) / 4e-5) + 0.4 * np.exp(-((t - 0.024) ** 2) / 4e-5)
    return n * env * 1.3


def hat(d=0.06, open_=False):
    d = 0.22 if open_ else d
    t = tarr(d)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (18 if open_ else 90)) * 0.4


def pluck(f, d=0.5, cutoff=3200):
    t = tarr(d)
    x = 0.55 * (2 * ((f * t) % 1) - 1) + 0.45 * (2 * ((f * 1.004 * t) % 1) - 1)
    x = lp(x, cutoff, 2) * np.exp(-t * 7.5)
    return x * 0.6


def pad_note(f, d):
    t = tarr(d)
    x = np.zeros(len(t))
    for det in (-0.006, 0.0, 0.006):
        x += 2 * (((f * (1 + det)) * t) % 1) - 1
    x = lp(x, 1400, 2) / 3
    a = np.minimum(1, t / 0.35)
    r = np.minimum(1, (d - t) / 0.4)
    return x * a * r


def bass_note(f, d):
    t = tarr(d)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6)
    x = np.tanh(x * 1.6) * 0.8
    r = np.minimum(1, (d - t) / 0.03) * np.minimum(1, t / 0.005)
    return x * r


def reverb(x, secs=1.5, wet=0.3):
    n = int(secs * SR)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.arange(n) / (0.32 * SR))[:, None]
    ir = lp(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True)) * 3.2
    out = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], axis=1)
    return x * (1 - wet * 0.5) + out * wet


def make_music(duration, m):
    bpm = float(m.get("bpm", 104))
    mood = m.get("mood", "bright")
    intro = float(m.get("intro", 1.6))
    drums_on = bool(m.get("drums", True))
    beat = 60.0 / bpm
    N = int((duration + 2) * SR)
    drums = np.zeros(N); bass = np.zeros(N); pad = np.zeros((N, 2)); arp = np.zeros((N, 2))
    kicks = []
    prog = PROGS.get(mood, PROGS["bright"])
    bars = int((duration - intro) / (beat * 4)) + 3
    # такт-сетка начинается с intro
    for bar in range(-int(np.ceil(intro / (beat * 4))), bars):
        t_bar = intro + bar * beat * 4
        chord = prog[bar % len(prog)]
        root, notes = CHORDS[chord]
        # пэд — на весь такт (включая интро)
        if t_bar + beat * 4 > 0:
            for nn in notes:
                x = pad_note(midi(nn - 12 + 12), beat * 4 + 0.5)
                add_st = pan(x, 0)
                i = int(max(t_bar, 0) * SR)
                off = int((max(t_bar, 0) - t_bar) * SR)
                seg = add_st[off:]
                n = min(len(seg), N - i)
                if n > 0:
                    pad[i:i + n] += seg[:n] * 0.16
        if t_bar < 0 or t_bar >= duration + 1:
            continue
        # арпеджио 8-ми
        arp_notes = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[1] + 12 + 12, notes[2] + 12, notes[1] + 12, notes[0] + 12 + 12, notes[1] + 12]
        for k in range(8):
            tt = t_bar + k * beat / 2
            if tt >= 0 and (t_bar >= intro * 0.5):
                x = pluck(midi(arp_notes[k]), 0.45)
                st = pan(x, -0.5 if k % 2 == 0 else 0.5)
                i = int(tt * SR); n = min(len(st), N - i)
                if i < N:
                    arp[i:i + n] += st[:n] * (0.55 if k % 2 == 0 else 0.4)
        if t_bar < intro - 1e-6 or not drums_on:
            continue
        # ударные / бас
        for b in range(4):
            tb = t_bar + b * beat
            if b in (0, 2) or (b == 3 and bar % 2 == 1):
                add(drums, kick(), tb, 0.95); kicks.append(tb)
            if b in (1, 3):
                add(drums, clap(), tb, 0.55)
            add(drums, hat(), tb, 0.55); add(drums, hat(open_=(b % 2 == 1)), tb + beat / 2, 0.7 if b % 2 == 1 else 0.5)
            # бас: восьмые
            add(bass, bass_note(midi(root + (12 if b == 3 else 0)), beat * 0.48), tb, 0.55)
            add(bass, bass_note(midi(root), beat * 0.4), tb + beat / 2, 0.42)
    # sidechain
    tt = np.arange(N) / SR
    duck = np.ones(N)
    for k in kicks:
        i = int(k * SR); L = int(0.28 * SR)
        if i < N:
            seg = 1 - 0.55 * np.exp(-np.arange(min(L, N - i)) / (0.09 * SR))
            duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], seg)
    mus = pan(drums, 0) * 0.9 + pan(bass * duck, 0) * 1.0
    mus += reverb(pad * duck[:, None] * 1.0, 1.8, 0.35) + reverb(arp * duck[:, None] * 0.7, 1.2, 0.3)
    mus = mus[: int(duration * SR)]
    # вход/выход
    n = len(mus)
    fade_in = np.minimum(1, np.arange(n) / (0.25 * SR))
    fade_out = np.minimum(1, (n - np.arange(n)) / (1.2 * SR))
    return mus * (fade_in * fade_out)[:, None]


def main():
    cfg = json.load(open(sys.argv[1]))
    duration = float(cfg["duration"])
    m = cfg.get("music", {})
    mg = float(m.get("gain", 0.55))
    music = make_music(duration, m) * mg if m.get("enabled", True) else np.zeros((int(duration * SR), 2))
    sfx = np.zeros((int(duration * SR) + SR, 2))
    for c in cfg.get("cues", []):
        fn = FX.get(c["type"])
        if not fn:
            print("unknown cue", c["type"]); continue
        x = fn()
        st = pan(x, float(c.get("pan", 0)))
        add(sfx, st, float(c["t"]), float(c.get("gain", 1.0)) * 0.9)
    sfx = sfx[: len(music)]
    mix = music + sfx
    # громкость ≈ −16 dBFS RMS, мягкий лимитер
    rms = np.sqrt(np.mean(mix ** 2)) + 1e-9
    mix *= (10 ** (-17 / 20)) / rms
    mix = np.tanh(mix * 1.1) * 0.95
    pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
    import wave
    with wave.open(sys.argv[2], "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"audio → {sys.argv[2]}  {duration:.1f}s  peak {np.abs(mix).max():.2f}")


if __name__ == "__main__":
    main()
