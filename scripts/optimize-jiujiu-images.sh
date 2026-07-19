#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 4 ]]; then
    echo "Usage: $0 <chapter-source-dir> <cover.png> <ending.png> <output-dir>" >&2
    exit 1
fi

chapter_source=$1
cover_source=$2
ending_source=$3
output_dir=$4
image_dir="$output_dir/images"
book_frame_dir=$(dirname "$cover_source")
dedication_source="$book_frame_dir/小白啾啾森林成长记-献词页.png"
contents_source="$book_frame_dir/小白啾啾森林成长记-目录.png"

command -v cwebp >/dev/null 2>&1 || { echo "cwebp is required" >&2; exit 1; }
mkdir -p "$image_dir"

while IFS= read -r -d '' source; do
    filename=$(basename "$source" .png)
    chapter=${filename%%-*}
    printf -v chapter_padded "%02d" "$chapter"
    suffix=""
    [[ $filename == *-上 ]] && suffix="-a"
    [[ $filename == *-下 ]] && suffix="-b"
    cwebp -quiet -q 82 -m 6 -sharp_yuv -metadata none "$source" -o "$image_dir/chapter-${chapter_padded}${suffix}.webp"
done < <(find "$chapter_source" -type f -name '*.png' -print0)

cwebp -quiet -q 82 -m 6 -metadata none "$cover_source" -o "$output_dir/cover.webp"
cwebp -quiet -q 82 -m 6 -metadata none "$dedication_source" -o "$output_dir/dedication.webp"
cwebp -quiet -q 82 -m 6 -metadata none "$contents_source" -o "$output_dir/contents.webp"
cwebp -quiet -q 82 -m 6 -metadata none "$ending_source" -o "$output_dir/ending.webp"

echo "Optimized $(find "$image_dir" -type f -name '*.webp' | wc -l | tr -d ' ') chapter images and 4 book-frame images into $output_dir"
