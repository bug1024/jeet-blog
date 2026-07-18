#!/usr/bin/env python3
"""验证 Hugo 构建产物中的文章统一使用 /posts/:slug/。"""
import glob
import os
import re
import sys

missing = []
seen = {}
duplicates = []
posts = sorted(
    path for path in glob.glob("content/posts/*.md")
    if os.path.basename(path) != "_index.md"
)
for f in posts:
    with open(f, encoding="utf-8") as post:
        frontmatter = post.read().split("---", 2)[1]
    match = re.search(r'^slug:\s*["\']?([^"\'\n]+)', frontmatter, re.MULTILINE)
    if not match:
        print(f"MISSING SLUG: {f}")
        sys.exit(1)
    slug = match.group(1).strip()
    if slug in seen:
        duplicates.append((slug, seen[slug], f))
    seen[slug] = f
    path = os.path.join("public", "posts", slug, "index.html")
    if not os.path.exists(path):
        missing.append(path)

if duplicates:
    print("DUPLICATE SLUGS:")
    for slug, first, second in duplicates:
        print(f"  {slug}: {first}, {second}")
    sys.exit(1)

if missing:
    print("MISSING:")
    for p in missing:
        print(" ", p)
    sys.exit(1)
print(f"OK: 全部 {len(posts)} 篇文章使用 /posts/:slug/，且 slug 唯一")
