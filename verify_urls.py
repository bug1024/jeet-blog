#!/usr/bin/env python3
"""验证 hugo 构建产物中，每篇文章的 URL 路径与 Jekyll 时代一致。"""
import glob
import os
import sys

missing = []
posts = sorted(glob.glob("content/posts/*.md"))
for f in posts:
    base = os.path.basename(f)[:-3]  # 去掉 .md
    date, slug = base[:10], base[11:]
    y, m, d = date.split("-")
    path = os.path.join("public", y, m, d, slug, "index.html")
    if not os.path.exists(path):
        missing.append(path)

if missing:
    print("MISSING:")
    for p in missing:
        print(" ", p)
    sys.exit(1)
print(f"OK: 全部 {len(posts)} 篇文章 URL 与旧站一致")