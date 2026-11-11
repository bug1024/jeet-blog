#!/bin/sh
# Cuts Source Han Serif CN down to the characters used by the 我们的小小世界 MV (lyrics plus any text in the scenes).
# Run again whenever lyrics.lrc or the scene code gains new Chinese text.
# Usage: sh scripts/subset-our-little-world-mv-font.sh <dir with SourceHanSerifCN-Light/Regular/SemiBold.otf>
# Needs fonttools with brotli: pip install fonttools brotli
set -eu
cd "$(dirname "$0")/.."
src="$1"
app=static/works/our-little-world-mv/app
text=$(python3 -c "
import glob
s=open('$app/lyrics.lrc',encoding='utf-8').read()+''.join(open(f,encoding='utf-8').read() for f in glob.glob('$app/src/*.js'))
print(''.join(sorted({c for c in s if ord(c)>127})) + ''.join(chr(c) for c in range(32,127)))")
for pair in Light:light Regular:regular SemiBold:semibold; do
    w=${pair%%:*}; out=${pair##*:}
    pyftsubset "$src/SourceHanSerifCN-$w.otf" --text="$text" --flavor=woff2 --layout-features='*' --output-file="$app/fonts/serif-$out.woff2"
    printf '%6s KB  %s\n' "$(( $(wc -c < "$app/fonts/serif-$out.woff2") / 1024 ))" "$app/fonts/serif-$out.woff2"
done
