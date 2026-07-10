from __future__ import annotations

import io
import math
import os
import random
import subprocess
from functools import lru_cache
from pathlib import Path
from typing import Callable, Iterable

import cairosvg
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "cinematic"
TRANSITIONS = OUT / "transitions"
W, H = 1920, 1080
FPS = 24
INTRO_SECONDS = 7
TRANSITION_SECONDS = 4

PROJECTS = [
    (2, "Company Redesign", "BRANDING", "/Essets/BIGFUN.jpg", "cmyk_panels"),
    (3, "HAKAMERI Brochure", "PRINT DESIGN", "/Essets/BROCHURE HAKAMERI.jpg", "page_tunnel"),
    (5, "Digital Painting", "DIGITAL ART", "/Essets/DIGITAL PAINTING.jpg", "pigment_bloom"),
    (6, "Gesture Poster", "POSTER DESIGN", "/Essets/GESTURE POSTER.jpg", "gesture_lines"),
    (8, "Keren Nails Logo", "LOGO DESIGN", "/Essets/KEREN NAILS LOGO.jpg", "polish_ribbons"),
    (9, "Landing Page Prototype", "UI/UX DESIGN", "/Essets/LANDING PAGE PROTOTYPE.png", "ui_grid"),
    (10, "PASSPORTOGO", "LOGO DESIGN", "/Essets/PASSPORTOGO.png", "passport_stamps"),
    (11, "Sketchbook", "ILLUSTRATION", "/Essets/SKETCHBOOK.jpg", "sketch_pages"),
    (13, "SPACE Logo", "LOGO DESIGN", "/Essets/SPACE LOGO.jpg", "orbits"),
    (14, "THE GRIND Logo", "LOGO DESIGN", "/Essets/THE GRIND LOGO.jpg", "coffee_vortex"),
    (15, "Twitchy Rabbit Logo", "LOGO DESIGN", "/Essets/TWITCHY RABBIT LOGO.jpg", "speed_shards"),
]

FONT_REGULAR = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
FONT_LIGHT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf")
FONT_BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidate = FONT_BOLD if bold else (FONT_LIGHT if FONT_LIGHT.exists() else FONT_REGULAR)
    return ImageFont.truetype(str(candidate), size=size)


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def smooth(a: float, b: float, x: float) -> float:
    if a == b:
        return float(x >= b)
    t = clamp((x - a) / (b - a))
    return t * t * (3.0 - 2.0 * t)


def ease_out_back(t: float, amount: float = 1.4) -> float:
    t = clamp(t) - 1.0
    return 1.0 + (amount + 1.0) * t**3 + amount * t**2


def ease_in_out(t: float) -> float:
    t = clamp(t)
    return 0.5 - 0.5 * math.cos(math.pi * t)


@lru_cache(maxsize=1)
def atmospheric_background() -> Image.Image:
    yy, xx = np.mgrid[0:H, 0:W]
    arr = np.zeros((H, W, 3), dtype=np.float32)
    arr[:] = np.array([3.0, 5.0, 8.0], dtype=np.float32)

    def glow(cx: float, cy: float, rx: float, ry: float, color: tuple[int, int, int], strength: float) -> None:
        distance = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
        weight = np.exp(-distance * 2.15) * strength
        for channel, value in enumerate(color):
            arr[:, :, channel] += weight * value

    glow(90, 530, 760, 700, (0, 169, 200), 0.055)
    glow(1840, 500, 760, 690, (209, 10, 100), 0.065)
    glow(1030, 1160, 690, 520, (255, 220, 0), 0.045)
    glow(960, 540, 500, 430, (20, 27, 36), 0.42)
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def rgba(image: Image.Image) -> Image.Image:
    return image.convert("RGBA")


def svg_image(path: Path, width: int, height: int) -> Image.Image:
    png = cairosvg.svg2png(url=str(path), output_width=width, output_height=height)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def cover_image(path: Path, width: int, height: int) -> Image.Image:
    source = Image.open(path).convert("RGB")
    ratio = max(width / source.width, height / source.height)
    resized = source.resize((max(1, round(source.width * ratio)), max(1, round(source.height * ratio))), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height)).convert("RGBA")


def contain_image(path: Path, width: int, height: int) -> Image.Image:
    source = Image.open(path).convert("RGBA")
    source.thumbnail((width, height), Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    layer.alpha_composite(source, ((width - source.width) // 2, (height - source.height) // 2))
    return layer


def alpha_composite_at(base: Image.Image, layer: Image.Image, x: int, y: int, opacity: float = 1.0) -> None:
    if opacity <= 0:
        return
    item = layer
    if opacity < 0.999:
        item = layer.copy()
        item.putalpha(item.getchannel("A").point(lambda p: int(p * opacity)))
    base.alpha_composite(item, (int(x), int(y)))


def transformed(layer: Image.Image, scale: float = 1.0, angle: float = 0.0, opacity: float = 1.0) -> Image.Image:
    width = max(1, round(layer.width * scale))
    height = max(1, round(layer.height * scale))
    result = layer.resize((width, height), Image.Resampling.LANCZOS)
    if abs(angle) > 0.01:
        result = result.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    if opacity < 0.999:
        result.putalpha(result.getchannel("A").point(lambda p: int(p * opacity)))
    return result


def center_layer(base: Image.Image, layer: Image.Image, center: tuple[float, float], scale: float = 1.0, angle: float = 0.0, opacity: float = 1.0) -> None:
    item = transformed(layer, scale, angle, opacity)
    alpha_composite_at(base, item, round(center[0] - item.width / 2), round(center[1] - item.height / 2))


def text_center(draw: ImageDraw.ImageDraw, xy: tuple[float, float], text: str, face: ImageFont.FreeTypeFont, fill: tuple[int, int, int, int], spacing: int = 0) -> None:
    if spacing <= 0:
        box = draw.textbbox((0, 0), text, font=face)
        draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), text, font=face, fill=fill)
        return
    widths = [draw.textlength(character, font=face) for character in text]
    total = sum(widths) + max(0, len(text) - 1) * spacing
    x = xy[0] - total / 2
    for character, width in zip(text, widths):
        draw.text((x, xy[1] - face.size * 0.5), character, font=face, fill=fill)
        x += width + spacing


@lru_cache(maxsize=1)
def logo_asset() -> Image.Image:
    return svg_image(PUBLIC / "cinematic" / "symbol.svg", 220, 214)


@lru_cache(maxsize=3)
def blob_asset(kind: str) -> Image.Image:
    return svg_image(PUBLIC / "cinematic" / "hub" / f"blob-{kind}.svg", 340, 187)


def draw_button_label(frame: Image.Image, center: tuple[int, int], title: str, note: str, opacity: float = 1.0) -> None:
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    text_center(draw, (center[0], center[1] - 3), title, font(19), (255, 255, 255, int(255 * opacity)), 7)
    text_center(draw, (center[0], center[1] + 27), note, font(7, True), (255, 255, 255, int(175 * opacity)), 3)
    frame.alpha_composite(overlay)


def hub_frame() -> Image.Image:
    frame = atmospheric_background().convert("RGBA")
    draw = ImageDraw.Draw(frame)
    center = (960, 525)
    points = [((500, 660), (33, 183, 215, 43)), ((1490, 365), (217, 20, 102, 40)), ((1490, 745), (255, 220, 0, 33))]
    for target, color in points:
        draw.line((center[0], center[1], target[0], target[1]), fill=color, width=1)
    shadow = logo_asset().filter(ImageFilter.GaussianBlur(22))
    center_layer(frame, shadow, center, 1.1, opacity=0.45)
    center_layer(frame, logo_asset(), center)
    specs = [
        ("work", (500, 660), -2.0, "WORK", "SELECTED WORLDS"),
        ("about", (1490, 365), 2.0, "ABOUT", "PROFILE"),
        ("contact", (1490, 745), -1.0, "CONTACT", "BEGIN A PROJECT"),
    ]
    for kind, position, angle, title, note in specs:
        asset = transformed(blob_asset(kind), angle=angle)
        center_layer(frame, asset, position)
        draw_button_label(frame, position, title, note)
    return frame


def project_frame(project: tuple[int, str, str, str, str], index: int) -> Image.Image:
    project_id, title, category, relative_path, _effect = project
    frame = atmospheric_background().convert("RGBA")
    x, y, width, height = 240, 145, 1440, 760
    media = cover_image(PUBLIC / relative_path.lstrip("/"), width, height)
    mask = Image.new("L", (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    polygon = [(58, 76), (290, 8), (1160, 8), (1397, 116), (1440, 615), (1310, 750), (215, 735), (0, 605)]
    mask_draw.polygon(polygon, fill=255)
    shadow_mask = mask.filter(ImageFilter.GaussianBlur(34))
    shadow = Image.new("RGBA", (width, height), (0, 0, 0, 175))
    shadow.putalpha(shadow_mask.point(lambda p: int(p * 0.72)))
    alpha_composite_at(frame, shadow, x, y + 26)
    media.putalpha(mask)
    alpha_composite_at(frame, media, x, y)

    glass = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glass)
    gd.polygon(polygon, fill=(255, 255, 255, 0), outline=(255, 255, 255, 22), width=1)
    highlight = Image.new("L", (width, height), 0)
    hd = ImageDraw.Draw(highlight)
    hd.ellipse((-150, -190, 760, 510), fill=75)
    highlight = highlight.filter(ImageFilter.GaussianBlur(95))
    sheen = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    sheen.putalpha(highlight)
    sheen.putalpha(ImageChops.multiply(sheen.getchannel("A"), mask))
    glass.alpha_composite(sheen)
    glass.putalpha(ImageChops.multiply(glass.getchannel("A"), mask))
    alpha_composite_at(frame, glass, x, y)

    draw = ImageDraw.Draw(frame)
    draw.text((82, 170), f"{index + 1:02d}", font=font(13, True), fill=(255, 255, 255, 118))
    draw.text((150, 906), category, font=font(13, True), fill=(255, 255, 255, 155))
    title_font = font(72)
    draw.text((150, 925), title, font=title_font, fill=(255, 255, 255, 255))
    draw.text((1630, 978), "ENTER PROJECT", font=font(12, True), fill=(255, 255, 255, 180))
    draw.ellipse((1756, 148, 1824, 216), fill=(5, 8, 12, 115), outline=(255, 255, 255, 58), width=1)
    text_center(draw, (1790, 180), "↗", font(27), (255, 255, 255, 230))
    return frame


def noise_particles(frame: Image.Image, count: int, seed: int, color_choices: list[tuple[int, int, int]], alpha: int, radius: tuple[int, int], region: tuple[int, int, int, int] = (0, 0, W, H)) -> None:
    rng = random.Random(seed)
    draw = ImageDraw.Draw(frame)
    for _ in range(count):
        x = rng.randint(region[0], region[2])
        y = rng.randint(region[1], region[3])
        r = rng.randint(radius[0], radius[1])
        color = rng.choice(color_choices)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(*color, alpha))


def intro_frames() -> Iterable[Image.Image]:
    final = hub_frame()
    logo = logo_asset()
    buttons = {
        "work": (blob_asset("work"), (500, 660), -2.0, "WORK", "SELECTED WORLDS"),
        "about": (blob_asset("about"), (1490, 365), 2.0, "ABOUT", "PROFILE"),
        "contact": (blob_asset("contact"), (1490, 745), -1.0, "CONTACT", "BEGIN A PROJECT"),
    }
    total = INTRO_SECONDS * FPS
    for frame_index in range(total):
        t = frame_index / max(1, total - 1)
        if t > 0.91:
            yield final.copy()
            continue
        frame = atmospheric_background().convert("RGBA")
        draw = ImageDraw.Draw(frame)

        # Fine energy threads orbit into the mark.
        energy = smooth(0.04, 0.48, t) * (1.0 - smooth(0.64, 0.82, t))
        for strand in range(17):
            phase = strand * 0.73
            radius = 500 * (1.0 - smooth(0.03, 0.48, t)) + 44 + strand * 4
            angle = phase + t * (8.0 + strand * 0.08)
            x = 960 + math.cos(angle) * radius * (1.0 + 0.12 * math.sin(phase))
            y = 525 + math.sin(angle) * radius * 0.56
            color = [(209, 10, 100), (0, 169, 200), (255, 220, 0)][strand % 3]
            r = 2 + strand % 4
            draw.ellipse((x-r, y-r, x+r, y+r), fill=(*color, int(215 * energy)))
            if strand % 3 == 0:
                draw.line((960, 525, x, y), fill=(*color, int(35 * energy)), width=1)

        logo_progress = ease_out_back(smooth(0.12, 0.48, t), 1.0)
        if logo_progress > 0:
            mask = Image.new("L", logo.size, 0)
            md = ImageDraw.Draw(mask)
            reveal_y = int(logo.height * logo_progress)
            md.rectangle((0, logo.height - reveal_y, logo.width, logo.height), fill=255)
            for band in range(7):
                by = int((band / 6) * logo.height)
                if by > logo.height - reveal_y - 36 and by < logo.height - reveal_y + 36:
                    md.rectangle((0, by, logo.width, by + 4), fill=110)
            visible_logo = logo.copy()
            visible_logo.putalpha(ImageChops.multiply(logo.getchannel("A"), mask))
            shimmer = visible_logo.filter(ImageFilter.GaussianBlur(max(1, int(18 * (1-logo_progress)))))
            center_layer(frame, shimmer, (960, 525), scale=0.65 + 0.35 * logo_progress, opacity=0.7)
            center_layer(frame, visible_logo, (960, 525), scale=0.65 + 0.35 * logo_progress)

        # Threads draw only after the logo is established.
        line_progress = smooth(0.38, 0.64, t)
        destinations = [(500, 660), (1490, 365), (1490, 745)]
        colors = [(33, 183, 215, 44), (217, 20, 102, 42), (255, 220, 0, 35)]
        for destination, color in zip(destinations, colors):
            x = 960 + (destination[0] - 960) * line_progress
            y = 525 + (destination[1] - 525) * line_progress
            draw.line((960, 525, x, y), fill=color, width=1)

        # Each glossy navigation form shoots out from the logo on its own beat.
        starts = {"work": 0.42, "about": 0.49, "contact": 0.56}
        for order, (kind, (asset, destination, angle, title, note)) in enumerate(buttons.items()):
            progress = ease_out_back(smooth(starts[kind], starts[kind] + 0.24, t), 1.55)
            if progress <= 0:
                continue
            start = (960, 525)
            bend = (-120 if kind == "work" else 90, -95 if kind == "about" else 115)
            x = start[0] + (destination[0] - start[0]) * progress + math.sin(progress * math.pi) * bend[0]
            y = start[1] + (destination[1] - start[1]) * progress + math.sin(progress * math.pi) * bend[1]
            scale = 0.04 + 0.96 * progress
            opacity = smooth(0.02, 0.2, progress)
            for trail in range(4, 0, -1):
                lag = clamp(progress - trail * 0.045)
                tx = start[0] + (destination[0] - start[0]) * lag + math.sin(lag * math.pi) * bend[0]
                ty = start[1] + (destination[1] - start[1]) * lag + math.sin(lag * math.pi) * bend[1]
                center_layer(frame, asset.filter(ImageFilter.GaussianBlur(7 + trail * 4)), (tx, ty), scale=max(0.05, 0.04 + 0.96 * lag), angle=angle * lag, opacity=0.10 * opacity)
            center_layer(frame, asset, (x, y), scale=scale, angle=angle * progress, opacity=opacity)
            if progress > 0.83:
                draw_button_label(frame, (int(x), int(y)), title, note, smooth(0.83, 1.0, progress))

        settle = smooth(0.78, 0.91, t)
        if settle > 0:
            frame = Image.blend(frame.convert("RGB"), final.convert("RGB"), settle).convert("RGBA")
        yield frame


def reveal_end(start: Image.Image, end: Image.Image, mask: Image.Image) -> Image.Image:
    return Image.composite(end.convert("RGBA"), start.convert("RGBA"), mask)


def mask_radial(progress: float, center: tuple[int, int] = (960, 540), softness: int = 40) -> Image.Image:
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    radius = int(math.hypot(W, H) * progress)
    draw.ellipse((center[0]-radius, center[1]-radius, center[0]+radius, center[1]+radius), fill=255)
    return mask.filter(ImageFilter.GaussianBlur(softness))


def transition_overlay(effect: str, frame: Image.Image, t: float, seed: int) -> None:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    rng = random.Random(seed)
    intensity = 1.0 - smooth(0.76, 0.94, t)

    if effect == "cmyk_panels":
        colors = [(11, 18, 29, 255), (209, 10, 100, 255), (255, 220, 0, 255), (0, 169, 200, 255)]
        for i, color in enumerate(colors):
            p = ease_out_back(smooth(0.05 + i*0.035, 0.48 + i*0.035, t), 1.2)
            cx = 960 + (i - 1.5) * 245
            cy = 540 + math.sin(i * 1.8) * 40
            width, height = 480, 830
            layer = Image.new("RGBA", (width, height), color)
            ld = ImageDraw.Draw(layer)
            ld.rounded_rectangle((2,2,width-3,height-3), radius=28, outline=(255,255,255,32), width=2)
            center_layer(overlay, layer, (cx, cy), scale=0.2 + p*0.9, angle=(-24 + i*14) * (1-p) + (-10+i*6), opacity=intensity)
    elif effect == "page_tunnel":
        for i in range(9):
            p = (t * 2.0 + i / 9) % 1.0
            scale = 0.15 + p * 1.55
            alpha = int(220 * (1 - p) * intensity)
            box_w, box_h = 860, 560
            page = Image.new("RGBA", (box_w, box_h), (245, 244, 238, alpha))
            pd = ImageDraw.Draw(page)
            pd.rectangle((25, 25, box_w-25, box_h-25), outline=(10,12,18,alpha//3), width=3)
            for line in range(7):
                y = 95 + line * 55
                pd.line((90, y, box_w-110-rng.randint(0,140), y), fill=(55,60,70,alpha//3), width=3)
            center_layer(overlay, page, (960,540), scale=scale, angle=(i-4)*2.5 + math.sin(t*math.pi)*8, opacity=1)
    elif effect == "pigment_bloom":
        colors = [(209,10,100), (0,169,200), (255,220,0), (237,110,45), (89,42,116)]
        for i in range(70):
            angle = i * 2.399 + seed
            radius = (80 + (i % 13) * 38) * smooth(0.02, 0.72, t)
            x = 960 + math.cos(angle) * radius
            y = 540 + math.sin(angle) * radius * .68
            r = 18 + (i % 7) * 13
            color = colors[i % len(colors)]
            draw.ellipse((x-r,y-r,x+r,y+r), fill=(*color,int(175*intensity)))
        overlay = overlay.filter(ImageFilter.GaussianBlur(12))
    elif effect == "gesture_lines":
        colors = [(255,255,255,210),(209,10,100,220),(0,169,200,210),(20,22,28,255)]
        for i in range(24):
            y0 = -100 + i * 55
            offset = int((smooth(0, .75, t) * (W + 500)) - 350 - i*29)
            points = [(offset-420, y0), (offset-40, y0+rng.randint(-90,90)), (offset+480, y0+rng.randint(-120,120)), (offset+900, y0+rng.randint(-80,80))]
            draw.line(points, fill=colors[i%4], width=5+(i%5)*5, joint="curve")
    elif effect == "polish_ribbons":
        colors = [(255,95,174,210),(242,190,217,210),(255,255,255,180),(117,22,83,210)]
        for i in range(14):
            phase = i * .62
            points=[]
            for step in range(28):
                x = -180 + step * 82 + smooth(0,.8,t)*300
                y = 540 + math.sin(step*.42 + phase + t*5) * (170+i*5) + (i-7)*18
                points.append((x,y))
            draw.line(points, fill=colors[i%4], width=14+(i%4)*7, joint="curve")
        overlay = overlay.filter(ImageFilter.GaussianBlur(2))
    elif effect == "ui_grid":
        grid = int(58 - 20*smooth(0,.7,t))
        for x in range(-grid, W+grid, grid):
            draw.line((x,0,x,H), fill=(34,202,226,int(75*intensity)), width=1)
        for y in range(-grid, H+grid, grid):
            draw.line((0,y,W,y), fill=(255,255,255,int(38*intensity)), width=1)
        for i in range(12):
            p = smooth(0.05+i*.025,.62+i*.018,t)
            x = int((-500 if i%2==0 else W+500) + (420+(i%4)*350 - (-500 if i%2==0 else W+500))*p)
            y = 120+(i//4)*280
            draw.rounded_rectangle((x,y,x+310,y+190), radius=24, fill=(10,18,27,int(210*intensity)), outline=(0,169,200,int(150*intensity)), width=2)
    elif effect == "passport_stamps":
        colors=[(0,169,200,180),(209,10,100,180),(255,220,0,170),(255,255,255,150)]
        for i in range(22):
            p=smooth(0.03+(i%6)*.02,.68,t)
            cx=int(rng.randint(-200,W+200)+(960-rng.randint(-200,W+200))*p*.18)
            cy=int(rng.randint(-150,H+150))
            r=45+(i%5)*22
            draw.ellipse((cx-r,cy-r,cx+r,cy+r),outline=colors[i%4],width=5)
            if i%3==0:
                draw.line((cx-r,cy,cx+r,cy),fill=colors[i%4],width=3)
        for i in range(5):
            x=-350+smooth(.05+i*.04,.72,t)*(W+700)
            draw.rounded_rectangle((x,170+i*130,x+330,360+i*130),radius=18,outline=(255,255,255,int(120*intensity)),width=4)
    elif effect == "sketch_pages":
        page_p=smooth(.02,.58,t)
        for i in range(6):
            x=960+(i-2.5)*190
            page=Image.new("RGBA",(560,760),(244,239,220,int(235*intensity)))
            pd=ImageDraw.Draw(page)
            for j in range(28):
                x1=rng.randint(35,520); y1=rng.randint(40,720)
                x2=x1+rng.randint(-90,90); y2=y1+rng.randint(-90,90)
                pd.line((x1,y1,x2,y2),fill=(35,37,40,int(70*intensity)),width=1+(j%3))
            center_layer(overlay,page,(x,540),scale=.22+page_p*.9,angle=(i-2.5)*7*(1-page_p)+(i-2.5)*2,opacity=1)
    elif effect == "orbits":
        for i in range(9):
            rx=180+i*75; ry=90+i*38
            box=(960-rx,540-ry,960+rx,540+ry)
            draw.ellipse(box,outline=(0,169,200,int((95-i*6)*intensity)),width=2)
            angle=t*8+i*.8
            x=960+math.cos(angle)*rx
            y=540+math.sin(angle)*ry
            r=5+i%3*3
            draw.ellipse((x-r,y-r,x+r,y+r),fill=(255,220,0,int(220*intensity)))
        noise_particles(overlay,180,seed,[(255,255,255),(0,169,200),(209,10,100)],int(160*intensity),(1,3))
    elif effect == "coffee_vortex":
        colors=[(61,34,23),(104,58,34),(174,106,56),(229,179,115)]
        for i in range(220):
            angle=i*.51+t*10
            radius=(i%32)*17*(1-.35*smooth(.4,.9,t))
            x=960+math.cos(angle)*radius
            y=540+math.sin(angle)*radius*.62
            r=2+i%5
            draw.ellipse((x-r,y-r,x+r,y+r),fill=(*colors[i%4],int(225*intensity)))
        draw.ellipse((740,320,1180,760),outline=(232,192,136,int(120*intensity)),width=18)
    elif effect == "speed_shards":
        colors=[(255,255,255,210),(0,169,200,220),(209,10,100,230),(255,220,0,210)]
        for i in range(48):
            angle=rng.uniform(-math.pi,math.pi)
            length=180+rng.randint(0,640)*smooth(.05,.72,t)
            inner=80+rng.randint(0,120)
            x1=960+math.cos(angle)*inner
            y1=540+math.sin(angle)*inner*.65
            x2=960+math.cos(angle)*(inner+length)
            y2=540+math.sin(angle)*(inner+length)*.65
            draw.line((x1,y1,x2,y2),fill=colors[i%4],width=3+i%9)
            if i%4==0:
                side=28+i%5*8
                draw.polygon([(x2,y2),(x2-side,y2+side/2),(x2-side/2,y2-side)],fill=colors[i%4])
    frame.alpha_composite(overlay)


def effect_mask(effect: str, progress: float, seed: int) -> Image.Image:
    p = clamp(progress)
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    rng = random.Random(seed)
    if effect == "cmyk_panels":
        panel_width = W / 4
        for i in range(4):
            q = smooth(i*.07, .78+i*.035, p)
            x0 = int(i*panel_width)
            draw.rectangle((x0, int(H*(1-q)), int((i+1)*panel_width+2), H), fill=255)
    elif effect == "page_tunnel":
        q=smooth(.18,.86,p)
        margin_x=int((1-q)*W*.48); margin_y=int((1-q)*H*.48)
        draw.rounded_rectangle((margin_x,margin_y,W-margin_x,H-margin_y),radius=max(5,int(70*(1-q))),fill=255)
    elif effect == "pigment_bloom":
        q=smooth(.15,.86,p)
        for i in range(65):
            angle=i*2.399
            radius=(i%12)*48*q
            cx=960+math.cos(angle)*radius
            cy=540+math.sin(angle)*radius*.72
            r=45+q*180+(i%5)*16
            draw.ellipse((cx-r,cy-r,cx+r,cy+r),fill=255)
        mask=mask.filter(ImageFilter.GaussianBlur(26))
    elif effect == "gesture_lines":
        q=smooth(.12,.88,p)
        for i in range(28):
            x=int(-W*.2+q*W*1.4-i*18)
            draw.line((x,-100,x+680,H+100),fill=255,width=40+i%5*14)
    elif effect == "polish_ribbons":
        q=smooth(.16,.88,p)
        for i in range(18):
            points=[]
            for step in range(28):
                x=-120+step*82
                y=540+math.sin(step*.42+i*.58)*210+(i-9)*20
                points.append((x,y))
            draw.line(points[:max(2,int(len(points)*q))],fill=255,width=55, joint="curve")
        mask=mask.filter(ImageFilter.GaussianBlur(18))
    elif effect == "ui_grid":
        q=smooth(.1,.88,p)
        cols,rows=6,4
        for row in range(rows):
            for col in range(cols):
                order=(row*cols+col)/(rows*cols)
                if q>order*.7:
                    x0=int(col*W/cols); y0=int(row*H/rows)
                    draw.rectangle((x0,y0,x0+math.ceil(W/cols)+2,y0+math.ceil(H/rows)+2),fill=255)
    elif effect == "passport_stamps":
        q=smooth(.12,.9,p)
        for i in range(34):
            threshold=(i%9)/12
            if q>threshold:
                cx=rng.randint(0,W); cy=rng.randint(0,H); r=int(55+q*220+(i%5)*18)
                draw.ellipse((cx-r,cy-r,cx+r,cy+r),fill=255)
        mask=mask.filter(ImageFilter.GaussianBlur(12))
    elif effect == "sketch_pages":
        q=smooth(.12,.88,p)
        x=int(W*q)
        draw.polygon([(0,0),(x+180,0),(x-70,H),(0,H)],fill=255)
    elif effect == "orbits":
        q=smooth(.12,.88,p)
        mask=mask_radial(q,(960,540),28)
    elif effect == "coffee_vortex":
        q=smooth(.1,.9,p)
        for i in range(240):
            angle=i*.51
            radius=(i%35)*18
            cx=960+math.cos(angle)*radius
            cy=540+math.sin(angle)*radius*.65
            r=int(8+q*95+(i%4)*5)
            if q>((i%17)/24):
                draw.ellipse((cx-r,cy-r,cx+r,cy+r),fill=255)
        mask=mask.filter(ImageFilter.GaussianBlur(10))
    else:  # speed_shards
        q=smooth(.08,.9,p)
        radius=int(math.hypot(W,H)*q)
        points=[]
        for i in range(32):
            angle=2*math.pi*i/32
            jitter=1+0.18*math.sin(i*3.1+q*9)
            points.append((960+math.cos(angle)*radius*jitter,540+math.sin(angle)*radius*jitter*.75))
        draw.polygon(points,fill=255)
        mask=mask.filter(ImageFilter.GaussianBlur(14))
    return mask


def transition_frames(start: Image.Image, end: Image.Image, effect: str, seed: int) -> Iterable[Image.Image]:
    total=TRANSITION_SECONDS*FPS
    for frame_index in range(total):
        t=frame_index/max(1,total-1)
        if t<.035:
            yield start.copy()
            continue
        if t>.93:
            yield end.copy()
            continue
        reveal=smooth(.26,.86,t)
        mask=effect_mask(effect,reveal,seed)
        frame=reveal_end(start,end,mask)
        transition_overlay(effect,frame,t,seed+frame_index//3)
        # Controlled exposure pulse, gone before the exact end frame.
        pulse=math.sin(math.pi*smooth(.08,.82,t))*(1-smooth(.78,.92,t))
        if pulse>0:
            flash=Image.new("RGBA",(W,H),(255,255,255,int(18*pulse)))
            frame.alpha_composite(flash)
        yield frame


def encode_video(path: Path, frames: Iterable[Image.Image], frame_count: int) -> None:
    path.parent.mkdir(parents=True,exist_ok=True)
    command=[
        "ffmpeg","-y","-loglevel","error",
        "-f","rawvideo","-vcodec","rawvideo","-pix_fmt","rgb24",
        "-s",f"{W}x{H}","-r",str(FPS),"-i","-",
        "-an","-c:v","libx264","-preset","veryfast","-crf","17","-tune","animation",
        "-g","2","-keyint_min","2","-sc_threshold","0","-pix_fmt","yuv420p",
        "-movflags","+faststart",str(path),
    ]
    process=subprocess.Popen(command,stdin=subprocess.PIPE)
    assert process.stdin is not None
    written=0
    try:
        for frame in frames:
            process.stdin.write(frame.convert("RGB").tobytes())
            written+=1
    finally:
        process.stdin.close()
    result=process.wait()
    if result!=0:
        raise RuntimeError(f"ffmpeg failed for {path} with status {result}")
    if written!=frame_count:
        raise RuntimeError(f"Expected {frame_count} frames for {path}, wrote {written}")
    print(f"Rendered {path.relative_to(ROOT)} ({written} frames, {path.stat().st_size} bytes)")


def main() -> None:
    OUT.mkdir(parents=True,exist_ok=True)
    TRANSITIONS.mkdir(parents=True,exist_ok=True)
    hub=hub_frame()
    project_frames=[project_frame(project,index) for index,project in enumerate(PROJECTS)]

    encode_video(OUT/"intro-master.mp4",intro_frames(),INTRO_SECONDS*FPS)

    previous=hub
    previous_id="home"
    for index,(project,end) in enumerate(zip(PROJECTS,project_frames)):
        project_id=project[0]
        effect=project[4]
        filename=f"{previous_id}-to-{project_id}.mp4"
        encode_video(TRANSITIONS/filename,transition_frames(previous,end,effect,project_id*137+index),TRANSITION_SECONDS*FPS)
        previous=end
        previous_id=str(project_id)


if __name__=="__main__":
    main()
