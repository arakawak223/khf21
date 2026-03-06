#!/usr/bin/env python3
"""
PWA icon generator for 夢旅 ライトフライヤー２１
Usage: python3 scripts/generate-icons.py
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import math, os, random

ICON_SIZES     = [72, 96, 128, 144, 152, 192, 384, 512]
MASKABLE_SIZES = [192, 512]
OUT_DIR        = os.path.join(os.path.dirname(__file__), '../public/icons')


# ─── Background ─────────────────────────────────────────────────────────────

def make_bg(size: int) -> Image.Image:
    """Radial gradient: center #1a56db → edge #08091e"""
    x = np.linspace(-1.0, 1.0, size, dtype=np.float32)
    xx, yy = np.meshgrid(x, x)
    dist = (np.sqrt(xx**2 + yy**2) / math.sqrt(2)).clip(0, 1)

    c_center = np.array([26,  86, 219], dtype=np.float32)  # bright blue
    c_edge   = np.array([ 8,   9,  30], dtype=np.float32)  # near black

    t   = dist[:, :, np.newaxis]
    rgb = (c_center * (1 - t) + c_edge * t).astype(np.uint8)
    a   = np.full((size, size, 1), 255, dtype=np.uint8)
    return Image.fromarray(np.concatenate([rgb, a], axis=2), 'RGBA')


# ─── Rounded rect mask ──────────────────────────────────────────────────────

def rounded_mask(size: int, ratio: float = 0.22) -> Image.Image:
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=int(size * ratio),
        fill=255,
    )
    return m


# ─── Stars ──────────────────────────────────────────────────────────────────

def draw_stars(draw: ImageDraw.ImageDraw, size: int) -> None:
    rng = random.Random(7)  # fixed seed → same layout every run
    for _ in range(16):
        x = rng.uniform(0.04, 0.96) * size
        y = rng.uniform(0.03, 0.58) * size
        r = rng.uniform(0.003, 0.007) * size
        a = rng.randint(90, 200)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 250, 200, a))


# ─── Globe ──────────────────────────────────────────────────────────────────

def draw_globe(draw: ImageDraw.ImageDraw, size: int) -> None:
    cx, cy = size * 0.50, size * 0.56
    r      = size * 0.295
    lw     = max(1, size // 140)
    color  = (130, 210, 255, 65)

    # Outer circle
    draw.ellipse([cx - r,       cy - r,       cx + r,       cy + r      ], outline=color, width=lw)
    # Equator ellipse
    draw.ellipse([cx - r,       cy - r * 0.4, cx + r,       cy + r * 0.4], outline=color, width=lw)
    # Prime meridian ellipse
    draw.ellipse([cx - r * 0.4, cy - r,       cx + r * 0.4, cy + r      ], outline=color, width=lw)


# ─── Airplane ───────────────────────────────────────────────────────────────

def make_plane_layer(size: int) -> Image.Image:
    """
    Top-down view of an airplane, tilted 30° toward upper-right.
    Drawn on a transparent layer so we can add glow separately.
    """
    layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d     = ImageDraw.Draw(layer)

    cx  = size * 0.505
    cy  = size * 0.462
    sc  = size * 0.355
    ang = math.radians(-30)  # negative = rotate toward upper-right

    def pt(x: float, y: float):
        """Rotate & scale a normalized point to pixel coordinates."""
        xr = x * math.cos(ang) - y * math.sin(ang)
        yr = x * math.sin(ang) + y * math.cos(ang)
        return (cx + xr * sc, cy + yr * sc)

    w = (255, 255, 255, 255)

    # Fuselage (elongated hexagon)
    d.polygon([
        pt( 0.50,  0.000),
        pt( 0.38, -0.065),
        pt(-0.36, -0.055),
        pt(-0.50,  0.000),
        pt(-0.36,  0.055),
        pt( 0.38,  0.065),
    ], fill=w)

    # Main wings (swept back)
    d.polygon([pt( 0.08, -0.055), pt(-0.03, -0.470), pt(-0.21, -0.455), pt(-0.16, -0.055)], fill=w)
    d.polygon([pt( 0.08,  0.055), pt(-0.03,  0.470), pt(-0.21,  0.455), pt(-0.16,  0.055)], fill=w)

    # Horizontal tail fins
    d.polygon([pt(-0.28, -0.055), pt(-0.37, -0.230), pt(-0.46, -0.220), pt(-0.43, -0.055)], fill=w)
    d.polygon([pt(-0.28,  0.055), pt(-0.37,  0.230), pt(-0.46,  0.220), pt(-0.43,  0.055)], fill=w)

    return layer


# ─── Compose ────────────────────────────────────────────────────────────────

def create_icon(size: int, maskable: bool = False) -> Image.Image:
    img  = make_bg(size)
    draw = ImageDraw.Draw(img, 'RGBA')

    draw_stars(draw, size)
    draw_globe(draw, size)

    # Build plane + blue-tinted glow
    plane    = make_plane_layer(size)
    blur_r   = max(1, int(size * 0.028))
    glow_arr = np.array(plane.filter(ImageFilter.GaussianBlur(radius=blur_r))).astype(np.float32)
    glow_arr[:, :, 0] *= 0.40   # suppress red  → blue glow
    glow_arr[:, :, 1] *= 0.65   # suppress green
    glow_img = Image.fromarray(glow_arr.astype(np.uint8), 'RGBA')

    img = Image.alpha_composite(img, glow_img)
    img = Image.alpha_composite(img, plane)

    # Apply rounded corners last (maskable icons keep full square)
    if not maskable:
        img.putalpha(rounded_mask(size))

    return img


# ─── Run ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)

    for sz in ICON_SIZES:
        path = os.path.join(OUT_DIR, f'icon-{sz}x{sz}.png')
        create_icon(sz, maskable=False).save(path)
        print(f'  ✓  icon-{sz}x{sz}.png')

    for sz in MASKABLE_SIZES:
        path = os.path.join(OUT_DIR, f'icon-maskable-{sz}x{sz}.png')
        create_icon(sz, maskable=True).save(path)
        print(f'  ✓  icon-maskable-{sz}x{sz}.png')

    print('\nAll icons generated →', os.path.abspath(OUT_DIR))
