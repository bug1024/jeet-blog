#!/bin/sh
# Writes a small WebP next to every raster work cover for the works list, which shows covers at 180 × 135 CSS pixels.
# 480 × 360 stays sharp on 2× and 3× screens. layouts/works/list.html picks up "<cover>-thumb.webp" when it exists.
# Usage: sh scripts/make-work-thumbs.sh   (needs cwebp: brew install webp)
set -eu
cd "$(dirname "$0")/.."
grep -h '^cover:' content/works/*.md | sed 's/^cover: *//; s/"//g' | while read -r cover; do
    source="static$cover"
    case "$source" in *.svg) continue ;; esac
    [ -f "$source" ] || { echo "missing $source" >&2; continue; }
    thumb="${source%.*}-thumb.webp"
    cwebp -quiet -q 84 -m 6 -sharp_yuv -resize 480 0 "$source" -o "$thumb"
    printf '%6s KB  %s\n' "$(( $(wc -c < "$thumb") / 1024 ))" "$thumb"
done
