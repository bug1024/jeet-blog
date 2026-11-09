#!/bin/sh
# Cuts LXGW WenKai down to the characters used by the 慢一点长大 MV (lyrics, title, closing words).
# Run again whenever mv.js gains new Chinese text.
# Usage: sh scripts/subset-grow-up-slowly-font.sh <dir with LXGWWenKai-Regular.ttf and LXGWWenKai-Medium.ttf>
# Needs fonttools with brotli: pip install fonttools brotli
set -eu
cd "$(dirname "$0")/.."
src="$1"
app=static/works/grow-up-slowly/app
text=$(python3 -c "import sys; s=open('$app/mv.js',encoding='utf-8').read(); print(''.join(sorted({c for c in s if ord(c)>127})) + '0123456789 ')")
for w in Regular Medium; do
    lower=$(echo "$w" | tr 'A-Z' 'a-z')
    pyftsubset "$src/LXGWWenKai-$w.ttf" --text="$text" --flavor=woff2 --layout-features='*' --output-file="$app/fonts/wenkai-$lower.woff2"
    printf '%6s KB  %s\n' "$(( $(wc -c < "$app/fonts/wenkai-$lower.woff2") / 1024 ))" "$app/fonts/wenkai-$lower.woff2"
done
