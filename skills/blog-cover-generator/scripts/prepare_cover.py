#!/usr/bin/env python3
"""Prepare a raster image for the canonical BUG1024 4:3 article cover."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageColor, ImageOps
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Pillow is required: python3 -m pip install Pillow") from exc


def percentage(value: str) -> float:
    number = float(value)
    if not 0 <= number <= 100:
        raise argparse.ArgumentTypeError("must be between 0 and 100")
    return number


def positive(value: str) -> int:
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("must be greater than zero")
    return number


def cover_crop(image: Image.Image, width: int, height: int, focus_x: float, focus_y: float) -> Image.Image:
    source_ratio = image.width / image.height
    target_ratio = width / height

    if source_ratio > target_ratio:
        crop_height = image.height
        crop_width = round(crop_height * target_ratio)
    else:
        crop_width = image.width
        crop_height = round(crop_width / target_ratio)

    max_left = image.width - crop_width
    max_top = image.height - crop_height
    center_x = image.width * focus_x / 100
    center_y = image.height * focus_y / 100
    left = min(max(round(center_x - crop_width / 2), 0), max_left)
    top = min(max(round(center_y - crop_height / 2), 0), max_top)
    return image.crop((left, top, left + crop_width, top + crop_height)).resize(
        (width, height), Image.Resampling.LANCZOS
    )


def contain(image: Image.Image, width: int, height: int, background: str) -> Image.Image:
    fitted = ImageOps.contain(image, (width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (width, height), ImageColor.getrgb(background))
    x = (width - fitted.width) // 2
    y = (height - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--width", type=positive, default=2400)
    parser.add_argument("--height", type=positive, default=1800)
    parser.add_argument("--fit", choices=("cover", "contain"), default="cover")
    parser.add_argument("--focus-x", type=percentage, default=50.0)
    parser.add_argument("--focus-y", type=percentage, default=50.0)
    parser.add_argument("--background", default="#F8FAF9")
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if not args.input.is_file():
        parser.error(f"input does not exist: {args.input}")
    if args.output.exists() and not args.force:
        parser.error(f"output exists; pass --force to replace it: {args.output}")
    if not 1 <= args.quality <= 100:
        parser.error("--quality must be between 1 and 100")

    with Image.open(args.input) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        if args.fit == "cover":
            result = cover_crop(image, args.width, args.height, args.focus_x, args.focus_y)
        else:
            try:
                result = contain(image, args.width, args.height, args.background)
            except ValueError as exc:
                parser.error(f"invalid --background color: {exc}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    suffix = args.output.suffix.lower()
    save_options: dict[str, object] = {}
    if suffix == ".webp":
        save_options = {"format": "WEBP", "quality": args.quality, "method": 6}
    elif suffix in {".jpg", ".jpeg"}:
        save_options = {"format": "JPEG", "quality": args.quality, "optimize": True, "progressive": True}
    elif suffix == ".png":
        save_options = {"format": "PNG", "optimize": True}
    else:
        parser.error("output extension must be .webp, .jpg, .jpeg, or .png")

    result.save(args.output, **save_options)
    size_kib = args.output.stat().st_size / 1024
    print(f"Prepared {args.output} ({result.width}x{result.height}, {size_kib:.1f} KiB, fit={args.fit})")
    if suffix == ".webp" and size_kib > 500:
        print("Warning: cover exceeds 500 KiB; consider a lower --quality value", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
