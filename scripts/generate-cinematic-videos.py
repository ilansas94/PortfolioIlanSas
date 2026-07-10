#!/usr/bin/env python3
"""Generate deterministic browser-matched cinematic MP4s for the scroll story.

The final 24 frames of every project film are a stable, deterministic recreation of
its live browser composition. This avoids model-generated logo/text distortion and
makes currentTime scrubbing reversible and frame-accurate.
"""

from __future__ import annotations

import math
import random
import subprocess
from pathlib import Path
from typing import Iterable

import cairosvg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "cinematic"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720
FPS = 24
SECONDS = 5
FRAMES = FPS * SECONDS

PROJECTS = [
    (2, "Company Redesign", "Branding", "BIGFUN.jpg", "print"),
    (3, "HAKAMERI Brochure", "Print Design", "BROCHURE HAKAMERI.jpg", "print"),
    (5, "Digital Painting", "Digital Art", "DIGITAL PAINTING.jpg", "ink"),
    (6, "Gesture Poster", "Poster Design", "GESTURE POSTER.jpg", "print"),
    (8, "Keren Nails Logo", "Logo Design", "KEREN NAILS LOGO.jpg", "print"),
    (9, "Landing Page Prototype", "UI/UX Design", "LANDING PAGE PROTOTYPE.png", "ui"),
    (10, "PASSPORTOGO", "Logo Design", "PASSPORTOGO.png", "print"),
    (11, "Sketchbook", "Illustration", "SKETCHBOOK.jpg", "ink"),
    (13, "SPACE Logo", "Logo Design", "SPACE LOGO.jpg", "ui"),
    (14, "THE GRIND Logo", "Logo Design", "THE GRIND LOGO.jpg", "print"),
    (15, "Twitchy Rabbit Logo", "Logo Design", "TWITCHY RABBIT LOGO.jpg", "ink"),
]

CMYK = {
    "magenta": (225, 12, 101),
    "cyan": (0, 176, 210),
    "yellow": (255, 221, 24),
    "orange": (255, 139, 24),
    "black": (3, 5, 8),
}


def smoothstep(a: float, b: float, value: float) -> float:
    if a == b:
        return float(value >= b)
    x = max(0.0, min(1.0, (value - a) / (b - a)))
    return x * x * (3.0 - 2.0 * x)


def ease_out(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return 1.0 - (1.0 - value) ** 3


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


FONT_8 = font(8)
FONT_10 = font(10)
FONT_12 = font(12)
FONT_18 = font(18)
FONT_42 = font(42)
FONT_54 = font(54)


def radial_background(seed: int, pulse: float = 0.0) -> Image.Image:
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W]
    base = np.zeros((H, W, 3), dtype=np.float32)
    base[:] = np.array([3.0, 5.0, 8.0])

    glows = [
        (-90, H * 0.50, W * 0.72, np.array(CMYK["cyan"], dtype=np.float32), 0.055 + pulse * 0.018),
        (W + 90, H * 0.47, W * 0.72, np.array(CMYK["magenta"], dtype=np.float32), 0.062 + pulse * 0.018),
        (W * 0.55, H + 130, W * 0.56, np.array(CMYK["yellow"], dtype=np.float32), 0.038 + pulse * 0.014),
        (W * 0.50, H * 0.47, W * 0.48, np.array([33.0, 40.0, 51.0]), 0.55),
    ]
    for cx, cy, radius, color, amount in glows:
        distance = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / radius
        weight = np.clip(1.0 - distance, 0.0, 1.0) ** 2
        base += weight[..., None] * color * amount

    vignette = np.sqrt(((x - W / 2) / (W * 0.73)) ** 2 + ((y - H / 2) / (H * 0.72)) ** 2)
    base *= np.clip(1.12 - vignette * 0.52, 0.45, 1.0)[..., None]
    noise = rng.normal(0.0, 1.45, (H, W, 1))
    base += noise
    return Image.fromarray(np.uint8(np.clip(base, 0, 255)), "RGB")


def cover_image(path: Path, width: int, height: int) -> Image.Image:
    if not path.exists():
        return radial_background(abs(hash(path.name)) % 10000).resize((width, height))
    image = Image.open(path).convert("RGB")
    scale = max(width / image.width, height / image.height)
    resized = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - width) // 2)
    top = max(0, (resized.height - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def polygon_mask(size: tuple[int, int]) -> Image.Image:
    width, height = size
    points = [
        (0.038 * width, 0.12 * height),
        (0.205 * width, 0.012 * height),
        (0.84 * width, 0.0),
        (0.965 * width, 0.16 * height),
        (width, 0.82 * height),
        (0.905 * width, 0.988 * height),
        (0.145 * width, 0.96 * height),
        (0.0, 0.78 * height),
    ]
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask


def letterspaced(draw: ImageDraw.ImageDraw, xy: tuple[float, float], text: str, face: ImageFont.ImageFont, fill: tuple[int, ...], spacing: int = 3) -> None:
    x, y = xy
    for character in text:
        draw.text((x, y), character, font=face, fill=fill)
        bounds = draw.textbbox((x, y), character, font=face)
        x += bounds[2] - bounds[0] + spacing


def final_project_frame(project: tuple[int, str, str, str, str]) -> Image.Image:
    project_id, title, category, image_name, family = project
    index = next(i for i, item in enumerate(PROJECTS) if item[0] == project_id) + 1
    frame = radial_background(project_id * 97)

    aperture_w, aperture_h = 960, 500
    aperture_x, aperture_y = (W - aperture_w) // 2, 96
    source = cover_image(ROOT / "public" / "Essets" / image_name, aperture_w, aperture_h)
    source = source.resize((aperture_w, aperture_h), Image.Resampling.LANCZOS)
    source = Image.fromarray(np.uint8(np.clip(np.asarray(source, dtype=np.float32) * np.array([0.98, 0.98, 1.0]), 0, 255)))
    mask = polygon_mask((aperture_w, aperture_h))

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_mask = Image.new("L", (W, H), 0)
    shadow_mask.paste(mask, (aperture_x, aperture_y + 20))
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(28))
    shadow.paste((0, 0, 0, 185), (0, 0, W, H), shadow_mask)
    frame = Image.alpha_composite(frame.convert("RGBA"), shadow)

    card = Image.new("RGBA", (aperture_w, aperture_h), (0, 0, 0, 0))
    card.paste(source.convert("RGBA"), (0, 0), mask)
    sheen = Image.new("RGBA", (aperture_w, aperture_h), (0, 0, 0, 0))
    sheen_arr = np.zeros((aperture_h, aperture_w, 4), dtype=np.uint8)
    yy, xx = np.mgrid[0:aperture_h, 0:aperture_w]
    highlight = np.exp(-(((xx - aperture_w * 0.27) / (aperture_w * 0.34)) ** 2 + ((yy - aperture_h * 0.02) / (aperture_h * 0.24)) ** 2))
    sheen_arr[..., :3] = 255
    sheen_arr[..., 3] = np.uint8(highlight * 52)
    sheen = Image.fromarray(sheen_arr, "RGBA")
    sheen.putalpha(Image.composite(sheen.getchannel("A"), Image.new("L", sheen.size, 0), mask))
    card = Image.alpha_composite(card, sheen)

    tint = Image.new("RGBA", card.size, (*CMYK["magenta"], 0))
    if family == "ui":
        tint = Image.new("RGBA", card.size, (*CMYK["cyan"], 20))
    elif family == "ink":
        tint = Image.new("RGBA", card.size, (*CMYK["magenta"], 17))
    else:
        tint = Image.new("RGBA", card.size, (*CMYK["yellow"], 10))
    tint.putalpha(Image.composite(tint.getchannel("A"), Image.new("L", card.size, 0), mask))
    card = Image.alpha_composite(card, tint)
    frame.alpha_composite(card, (aperture_x, aperture_y))

    draw = ImageDraw.Draw(frame)
    letterspaced(draw, (52, 103), f"{index:02d}", FONT_10, (255, 255, 255, 115), 4)
    letterspaced(draw, (98, 618), category.upper(), FONT_10, (255, 255, 255, 150), 4)
    draw.text((98, 645), title, font=FONT_42, fill=(248, 249, 251, 255))
    letterspaced(draw, (1055, 663), "ENTER PROJECT", FONT_8, (255, 255, 255, 178), 3)
    draw.ellipse((1172, 100, 1224, 152), fill=(5, 8, 12, 90), outline=(255, 255, 255, 58), width=1)
    draw.text((1186, 107), "↗", font=FONT_18, fill=(255, 255, 255, 225))
    return frame.convert("RGB")


def irregular_blob(size: tuple[int, int], colors: tuple[tuple[int, int, int], tuple[int, int, int]], seed: int, gloss: float = 1.0) -> Image.Image:
    width, height = size
    rng = random.Random(seed)
    mask = Image.new("L", size, 0)
    points: list[tuple[float, float]] = []
    count = 48
    for i in range(count):
        angle = math.tau * i / count
        radius = 0.88 + 0.07 * math.sin(angle * 3 + seed * 0.17) + 0.035 * math.sin(angle * 5 - seed)
        radius += rng.uniform(-0.018, 0.018)
        x = width / 2 + math.cos(angle) * width * 0.49 * radius
        y = height / 2 + math.sin(angle) * height * 0.46 * radius
        points.append((x, y))
    ImageDraw.Draw(mask).polygon(points, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.4))

    x = np.linspace(0, 1, width)[None, :, None]
    first = np.array(colors[0], dtype=np.float32)[None, None, :]
    second = np.array(colors[1], dtype=np.float32)[None, None, :]
    gradient = first * (1 - x) + second * x
    gradient = np.repeat(gradient, height, axis=0)
    yy, xx = np.mgrid[0:height, 0:width]
    shine = np.exp(-(((xx - width * 0.31) / (width * 0.28)) ** 2 + ((yy - height * 0.10) / (height * 0.18)) ** 2))
    gradient += shine[..., None] * 150 * gloss
    lower = np.exp(-(((xx - width * 0.52) / (width * 0.55)) ** 2 + ((yy - height * 0.94) / (height * 0.24)) ** 2))
    gradient += lower[..., None] * 35
    rgba = np.zeros((height, width, 4), dtype=np.uint8)
    rgba[..., :3] = np.uint8(np.clip(gradient, 0, 255))
    rgba[..., 3] = np.asarray(mask)
    result = Image.fromarray(rgba, "RGBA")
    inner = Image.new("RGBA", size, (0, 0, 0, 0))
    inner_mask = mask.filter(ImageFilter.GaussianBlur(14))
    inner.paste((0, 0, 0, 45), (0, height // 2, width, height), inner_mask.crop((0, height // 2, width, height)))
    return Image.alpha_composite(result, inner)


def hub_frame(progress: float) -> Image.Image:
    frame = radial_background(777, pulse=progress)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    # Move the three forms and let WORK expand toward camera.
    work_pull = ease_out(smoothstep(0.08, 0.74, progress))
    fade_other = 1.0 - smoothstep(0.12, 0.58, progress)

    blobs = [
        ((330, 405), (232, 126), (CMYK["magenta"], CMYK["cyan"]), "WORK", "SELECTED WORLDS", 11),
        ((880, 210), (230, 124), (CMYK["orange"], CMYK["magenta"]), "ABOUT", "PROFILE", 23),
        ((880, 440), (230, 124), (CMYK["cyan"], CMYK["yellow"]), "CONTACT", "BEGIN A PROJECT", 37),
    ]
    for idx, (position, size, colors, label, note, seed) in enumerate(blobs):
        if idx == 0:
            scale = 1.0 + work_pull * 5.3
            cx = position[0] * (1 - work_pull) + W * 0.5 * work_pull
            cy = position[1] * (1 - work_pull) + H * 0.5 * work_pull
            alpha = 1.0 - smoothstep(0.72, 0.93, progress)
        else:
            scale = 1.0 - work_pull * 0.44
            cx, cy = position
            alpha = fade_other
        bw, bh = max(2, int(size[0] * scale)), max(2, int(size[1] * scale))
        blob = irregular_blob((bw, bh), colors, seed)
        if alpha < 1:
            blob.putalpha(blob.getchannel("A").point(lambda value: int(value * alpha)))
        layer.alpha_composite(blob, (int(cx - bw / 2), int(cy - bh / 2)))
        if idx == 0 and progress < 0.28 or idx > 0 and fade_other > 0.45:
            local = ImageDraw.Draw(layer)
            bbox = local.textbbox((0, 0), label, font=FONT_12)
            label_alpha = int(255 * alpha)
            local.text((cx - (bbox[2] - bbox[0]) / 2, cy - 7), label, font=FONT_12, fill=(255, 255, 255, label_alpha))
            note_box = local.textbbox((0, 0), note, font=FONT_8)
            local.text((cx - (note_box[2] - note_box[0]) / 2, cy + 13), note, font=FONT_8, fill=(255, 255, 255, int(150 * alpha)))

    # Central symbol stays stable until the expanding WORK form covers it.
    symbol_path = OUT / "symbol-render.png"
    if not symbol_path.exists():
        cairosvg.svg2png(url=str(OUT / "symbol.svg"), write_to=str(symbol_path), output_width=180, output_height=180)
    symbol = Image.open(symbol_path).convert("RGBA")
    symbol_alpha = 1.0 - smoothstep(0.22, 0.58, progress)
    symbol.putalpha(symbol.getchannel("A").point(lambda value: int(value * symbol_alpha)))
    layer.alpha_composite(symbol, (W // 2 - 90, H // 2 - 105))

    frame = Image.alpha_composite(frame.convert("RGBA"), layer)
    first_final = final_project_frame(PROJECTS[0]).convert("RGBA")
    reveal = smoothstep(0.70, 0.94, progress)
    if reveal > 0:
        first_final.putalpha(int(255 * reveal))
        frame = Image.alpha_composite(frame, first_final)
    return frame.convert("RGB")


def print_layer(progress: float, seed: int) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    colors = [(16, 22, 34), CMYK["magenta"], CMYK["yellow"], CMYK["cyan"]]
    shifts = [-300, -105, 105, 300]
    for index, (color, shift) in enumerate(zip(colors, shifts)):
        p = ease_out(progress)
        width = int(245 + p * 520)
        height = int(420 + p * 300)
        plate = Image.new("RGBA", (width, height), (*color, int(225 * (1 - smoothstep(0.7, 1.0, progress)))))
        d = ImageDraw.Draw(plate)
        d.rounded_rectangle((2, 2, width - 3, height - 3), radius=18, outline=(255, 255, 255, 45), width=2)
        d.ellipse((width * 0.18, height * 0.08, width * 0.48, height * 0.22), fill=(255, 255, 255, 24))
        angle = (-17 + index * 10) * (1 - p) + (index - 1.5) * 2
        plate = plate.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
        x = W // 2 + int(shift * (1 - p)) - plate.width // 2
        y = H // 2 - plate.height // 2 + int(math.sin(seed + index) * 22 * (1 - p))
        layer.alpha_composite(plate, (x, y))
    return layer


def ui_layer(progress: float, seed: int) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    p = ease_out(progress)
    width = int(380 + p * 850)
    height = int(155 + p * 500)
    sheet = irregular_blob((width, height), (CMYK["cyan"], CMYK["magenta"]), seed, gloss=0.7)
    sheet = sheet.filter(ImageFilter.GaussianBlur(max(0.0, (1 - p) * 4.0)))
    layer.alpha_composite(sheet, (W // 2 - width // 2, H // 2 - height // 2))
    draw = ImageDraw.Draw(layer)
    line_alpha = int(120 * smoothstep(0.25, 0.72, progress) * (1 - smoothstep(0.72, 1.0, progress)))
    for offset, fraction in enumerate((0.39, 0.50, 0.61)):
        draw.line((W * 0.26, H * fraction, W * (0.76 - offset * 0.04), H * fraction), fill=(255, 255, 255, line_alpha), width=2)
    return layer


def ink_layer(progress: float, seed: int) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rng = random.Random(seed)
    colors = [CMYK["magenta"], CMYK["cyan"], CMYK["yellow"]]
    centers = [(W * 0.36, H * 0.51), (W * 0.63, H * 0.43), (W * 0.51, H * 0.67)]
    for index, (color, center) in enumerate(zip(colors, centers)):
        shifted = max(0.0, min(1.0, progress * 1.22 - index * 0.06))
        radius = int(28 + ease_out(shifted) * (310 + rng.randint(-30, 45)))
        blob = irregular_blob((radius * 2, radius * 2), (color, tuple(int(c * 0.45) for c in color)), seed + index * 19, gloss=0.45)
        blob = blob.filter(ImageFilter.GaussianBlur(6 + shifted * 14))
        alpha = 1.0 - smoothstep(0.76, 1.0, progress)
        blob.putalpha(blob.getchannel("A").point(lambda value: int(value * alpha * 0.92)))
        layer.alpha_composite(blob, (int(center[0] - radius), int(center[1] - radius)))
    return layer


def project_transition_frame(project: tuple[int, str, str, str, str], progress: float) -> Image.Image:
    project_id, _, _, _, family = project
    frame = radial_background(project_id * 131 + 17, pulse=math.sin(progress * math.pi))
    material_progress = smoothstep(0.0, 0.72, progress)
    if family == "print":
        material = print_layer(material_progress, project_id)
    elif family == "ui":
        material = ui_layer(material_progress, project_id)
    else:
        material = ink_layer(material_progress, project_id)
    frame = Image.alpha_composite(frame.convert("RGBA"), material)

    final = final_project_frame(project).convert("RGBA")
    # Start resolving early enough that the browser's live layer can crossfade at 76%.
    reveal = smoothstep(0.54, 0.84, progress)
    if reveal > 0:
        zoom = 1.08 - reveal * 0.08
        if zoom != 1:
            resized = final.resize((round(W * zoom), round(H * zoom)), Image.Resampling.LANCZOS)
            cropped = resized.crop(((resized.width - W) // 2, (resized.height - H) // 2, (resized.width + W) // 2, (resized.height + H) // 2))
        else:
            cropped = final
        cropped.putalpha(int(255 * reveal))
        frame = Image.alpha_composite(frame, cropped)
    # Force a stable exact final composition for the last full second.
    if progress >= 0.80:
        frame = final
    return frame.convert("RGB")


def encode_video(destination: Path, frames: Iterable[Image.Image]) -> None:
    process = subprocess.Popen(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
            "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "25", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", str(destination),
        ],
        stdin=subprocess.PIPE,
    )
    assert process.stdin is not None
    try:
        for frame in frames:
            process.stdin.write(frame.convert("RGB").tobytes())
    finally:
        process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError(f"ffmpeg failed for {destination}")


def render() -> None:
    print("Rendering home-to-work.mp4")
    encode_video(OUT / "home-to-work.mp4", (hub_frame(index / (FRAMES - 1)) for index in range(FRAMES)))
    for project in PROJECTS:
        destination = OUT / f"project-{project[0]}.mp4"
        print(f"Rendering {destination.name}")
        encode_video(destination, (project_transition_frame(project, index / (FRAMES - 1)) for index in range(FRAMES)))
    (OUT / "symbol-render.png").unlink(missing_ok=True)


if __name__ == "__main__":
    render()
