#!/bin/sh
# Cuts Source Han Serif CN down to the characters used by the 那道旧门槛 MV (lyrics plus any text in the scenes).
# Run again whenever lyrics.lrc or the scene code gains new Chinese text.
# Usage: sh scripts/subset-old-threshold-mv-font.sh <dir with SourceHanSerifCN-Regular/SemiBold.otf> <dir with LXGWWenKai-Regular/Medium.ttf>
#   serif-*: Source Han Serif CN (the title). hand-*: LXGW WenKai (lyrics, chalk). The phone uses the device's own sans-serif.
# Needs fonttools with brotli: pip install fonttools brotli (PYFTSUBSET=path/to/pyftsubset if it is not on PATH)
set -eu
cd "$(dirname "$0")/.."
src="$1"; hand="$2"
sub=${PYFTSUBSET:-pyftsubset}
app=static/works/old-threshold-mv/app
text=$(python3 -c "
import glob
s=open('$app/lyrics.lrc',encoding='utf-8').read()+''.join(open(f,encoding='utf-8').read() for f in glob.glob('$app/src/*.js'))
print(''.join(sorted({c for c in s if ord(c)>127})) + ''.join(chr(c) for c in range(32,127)))")
for pair in Regular:regular SemiBold:semibold; do
    w=${pair%%:*}; out=${pair##*:}
    "$sub" "$src/SourceHanSerifCN-$w.otf" --text="$text" --flavor=woff2 --layout-features='*' --output-file="$app/fonts/serif-$out.woff2"
    printf '%6s KB  %s\n' "$(( $(wc -c < "$app/fonts/serif-$out.woff2") / 1024 ))" "$app/fonts/serif-$out.woff2"
done
for pair in Regular:regular Medium:medium; do
    "$sub" "$hand/LXGWWenKai-${pair%%:*}.ttf" --text="$text" --flavor=woff2 --layout-features='*' --output-file="$app/fonts/hand-${pair##*:}.woff2"
    printf '%6s KB  %s\n' "$(( $(wc -c < "$app/fonts/hand-${pair##*:}.woff2") / 1024 ))" "$app/fonts/hand-${pair##*:}.woff2"
done
