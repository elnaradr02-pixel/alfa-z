#!/usr/bin/env python3
"""Пост-обработка звука для v2-professiya-zagruzka: тёмная музыка в первой половине → светлая («hopeful») к финалу.

audio/synth.py умеет одно настроение на весь ролик, поэтому здесь:
  1) берём cues.json, который уже записал render-video.mjs (.cache/<name>/cues.json);
  2) синтезируем два саундтрека тем же synth.py (mood=dark и mood=hopeful, метки эффектов одинаковые);
  3) плавно перетекаем dark → hopeful в точке music.plan[0].until (по умолчанию 12.4 с, начало сцены «доверие»);
  4) подменяем звуковую дорожку в out/video/<name>.mp4 (видео копируется без перекодирования).

Запуск (после `node render-video.mjs v2-professiya-zagruzka`):
    cd marketing/instagram-ads && python3 src/video/v2-professiya-zagruzka/mix-audio.py
"""
import json, os, shutil, subprocess, sys
from pathlib import Path
import imageio_ffmpeg

NAME = "v2-professiya-zagruzka"
ROOT = Path(__file__).resolve().parents[3]
CACHE = ROOT / ".cache" / NAME
MP4 = ROOT / "out" / "video" / f"{NAME}.mp4"
FF = imageio_ffmpeg.get_ffmpeg_exe()
XFADE = 1.2  # длительность перетекания, с


def synth(cfg: dict, mood: str, out: Path) -> None:
    c = json.loads(json.dumps(cfg))
    c["music"] = dict(c.get("music", {}), mood=mood)
    p = CACHE / f"cues-{mood}.json"
    p.write_text(json.dumps(c, ensure_ascii=False))
    subprocess.run([sys.executable, str(ROOT / "audio" / "synth.py"), str(p), str(out)], check=True)


def main() -> None:
    cfg = json.loads((CACHE / "cues.json").read_text())
    plan = cfg.get("music", {}).get("plan") or [{"mood": "dark", "until": 12.4}, {"mood": "hopeful"}]
    t_sw = float(plan[0]["until"])
    dark, hope = CACHE / "audio-dark.wav", CACHE / "audio-hopeful.wav"
    synth(cfg, "dark", dark)
    synth(cfg, "hopeful", hope)
    t0, t1 = t_sw - XFADE / 2, t_sw + XFADE / 2
    fc = (f"[0:a]volume='clip(({t1}-t)/{XFADE},0,1)':eval=frame[a];"
          f"[1:a]volume='clip((t-{t0})/{XFADE},0,1)':eval=frame[b];"
          f"[a][b]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[m]")
    mixed = CACHE / "audio-mixed.wav"
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", str(dark), "-i", str(hope), "-filter_complex", fc, "-map", "[m]", str(mixed)], check=True)
    backup = CACHE / f"{NAME}.single-mood.mp4"
    if not backup.exists():
        shutil.copy2(MP4, backup)
    tmp = MP4.with_suffix(".tmp.mp4")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", str(backup), "-i", str(mixed), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(tmp)], check=True)
    os.replace(tmp, MP4)
    print(f"✓ звук: dark → hopeful в {t_sw:.1f} с; {MP4} ({MP4.stat().st_size/1e6:.1f} МБ)")


if __name__ == "__main__":
    main()
