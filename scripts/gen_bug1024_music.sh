#!/usr/bin/env bash
# Cut the author's 8-bit track into the W-007 soundtrack.
#
# The track's quiet-to-loud downbeat (13.764 s) lands on the frame where the steel module lands (8.192 s),
# so the cut starts at 5.572 s. A strong hit at 15.822 s falls on the final frame (10.25 s in the piece).
# The music stops after that hit; only the hit rings out, with echoes on the track's own beat (343 ms).
#
# Usage: bash scripts/gen_bug1024_music.sh path/to/8bit1.wav
set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <8bit1.wav>" >&2
    exit 1
fi

START=5.572
LAST_HIT=15.822
HIT_END=16.120
OUT="$(cd "$(dirname "$0")/.." && pwd)/static/works/bug1024/music.m4a"

ffmpeg -hide_banner -loglevel error -y -i "$1" -filter_complex "
[0]atrim=start=${START}:end=${LAST_HIT},asetpts=PTS-STARTPTS[run];
[0]atrim=start=${LAST_HIT}:end=${HIT_END},asetpts=PTS-STARTPTS,afade=t=out:st=0.25:d=0.048,apad=pad_dur=2.6,
  aecho=0.9:0.9:343|686|1029|1372|1715:0.55|0.36|0.23|0.14|0.08,afade=t=out:st=1.5:d=0.65,atrim=end=2.2[ring];
[run][ring]concat=n=2:v=0:a=1,volume=6dB,afade=t=in:st=0:d=0.03[out]" \
    -map "[out]" -c:a aac -b:a 128k -movflags +faststart "$OUT"

echo "wrote $OUT"
