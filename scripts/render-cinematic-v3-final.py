from __future__ import annotations

import importlib.util
from functools import lru_cache
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "scripts" / "render-cinematic-v3.py"
spec = importlib.util.spec_from_file_location("cinematic_v3_base", BASE_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError("Unable to load the cinematic V3 base renderer")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)


@lru_cache(maxsize=3)
def clipped_blob_asset(kind: str) -> Image.Image:
    filename = "blob-cyan.svg" if kind == "contact" else f"blob-{kind}.svg"
    return base.svg_image(base.PUBLIC / "cinematic" / "hub" / filename, 340, 187)


# Every rendered hub and intro frame uses the same clipped vector assets as the live UI.
base.blob_asset = clipped_blob_asset


def project_art_only(full_frame: Image.Image) -> Image.Image:
    """Keep only the project artwork and its soft shadow; remove all changing UI copy."""
    background = base.atmospheric_background().convert("RGBA")
    mask = Image.new("L", (base.W, base.H), 0)
    draw = ImageDraw.Draw(mask)
    x, y = 240, 145
    polygon = [
        (x + 58, y + 76),
        (x + 290, y + 8),
        (x + 1160, y + 8),
        (x + 1397, y + 116),
        (x + 1440, y + 615),
        (x + 1310, y + 750),
        (x + 215, y + 735),
        (x + 0, y + 605),
    ]
    draw.polygon(polygon, fill=255)
    shadow = mask.filter(ImageFilter.GaussianBlur(40)).point(lambda value: int(value * 0.62))
    combined = ImageChops.lighter(mask, shadow)
    return Image.composite(full_frame.convert("RGBA"), background, combined)


def clean_transition_frames(
    start_full: Image.Image,
    start_art: Image.Image,
    end_full: Image.Image,
    end_art: Image.Image,
    effect: str,
    seed: int,
) -> Iterable[Image.Image]:
    total = base.TRANSITION_SECONDS * base.FPS
    for frame_index in range(total):
        t = frame_index / max(1, total - 1)
        if t < 0.035:
            yield start_full.copy()
            continue
        if t > 0.93:
            yield end_full.copy()
            continue

        # The outgoing labels disappear before the visual transformation starts.
        start_cleanup = base.smooth(0.035, 0.13, t)
        clean_start = Image.blend(start_full.convert("RGB"), start_art.convert("RGB"), start_cleanup).convert("RGBA")

        reveal = base.smooth(0.25, 0.84, t)
        mask = base.effect_mask(effect, reveal, seed)
        frame = base.reveal_end(clean_start, end_art, mask)
        base.transition_overlay(effect, frame, t, seed + frame_index // 3)

        pulse = __import__("math").sin(__import__("math").pi * base.smooth(0.08, 0.82, t)) * (1 - base.smooth(0.78, 0.92, t))
        if pulse > 0:
            frame.alpha_composite(Image.new("RGBA", (base.W, base.H), (255, 255, 255, int(15 * pulse))))

        # Only one exact title system returns, as a clean final-frame lock.
        final_lock = base.smooth(0.82, 0.93, t)
        if final_lock > 0:
            frame = Image.blend(frame.convert("RGB"), end_full.convert("RGB"), final_lock).convert("RGBA")
        yield frame


def main() -> None:
    base.OUT.mkdir(parents=True, exist_ok=True)
    base.TRANSITIONS.mkdir(parents=True, exist_ok=True)

    hub_full = base.hub_frame()
    hub_art = hub_full.copy()
    project_full = [base.project_frame(project, index) for index, project in enumerate(base.PROJECTS)]
    project_art = [project_art_only(frame) for frame in project_full]

    base.encode_video(base.OUT / "intro-master.mp4", base.intro_frames(), base.INTRO_SECONDS * base.FPS)

    previous_full = hub_full
    previous_art = hub_art
    previous_id = "home"
    for index, (project, end_full, end_art) in enumerate(zip(base.PROJECTS, project_full, project_art)):
        project_id = project[0]
        effect = project[4]
        filename = f"{previous_id}-to-{project_id}.mp4"
        frames = clean_transition_frames(
            previous_full,
            previous_art,
            end_full,
            end_art,
            effect,
            project_id * 137 + index,
        )
        base.encode_video(base.TRANSITIONS / filename, frames, base.TRANSITION_SECONDS * base.FPS)
        previous_full = end_full
        previous_art = end_art
        previous_id = str(project_id)


if __name__ == "__main__":
    main()
