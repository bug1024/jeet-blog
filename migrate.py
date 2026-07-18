#!/usr/bin/env python3
"""一次性迁移脚本：Jekyll _posts/*.md -> Hugo content/posts/*.md

front matter 转换规则：
  layout、header-img -> 删除
  subtitle           -> description（若已有 description 则删除 subtitle）
  date               -> 文件名日期（保证 URL 与旧站一致）
  + slug             -> 文件名去掉 YYYY-MM-DD- 前缀和 .md 后缀
其余字段（title、tags、author、keyword）原样保留，正文不动。
"""
import glob
import os
import re
import sys

SRC_DIR = "_posts"
DST_DIR = "content/posts"

DROP_KEYS = ("layout:", "header-img:")


def migrate_file(src_path):
    filename = os.path.basename(src_path)
    date_str = filename[:10]  # YYYY-MM-DD
    slug = filename[11:-3]  # 去掉 "YYYY-MM-DD-" 和 ".md"
    with open(src_path, encoding="utf-8") as f:
        text = f.read()

    if not text.startswith("---"):
        raise ValueError(f"{filename}: 缺少 front matter")
    _, fm, body = text.split("---", 2)

    has_description = re.search(r"^description:", fm, re.M) is not None
    out_lines = []
    for line in fm.strip().splitlines():
        stripped = line.strip()
        if stripped.startswith(DROP_KEYS):
            continue
        if stripped.startswith("subtitle:"):
            if has_description:
                continue
            line = line.replace("subtitle:", "description:", 1)
        if stripped.startswith("date:"):
            line = f"date:       {date_str}"
        out_lines.append(line)
    out_lines.append(f'slug: "{slug}"')

    new_text = "---\n" + "\n".join(out_lines) + "\n---" + body
    dst_path = os.path.join(DST_DIR, filename)
    with open(dst_path, "w", encoding="utf-8") as f:
        f.write(new_text)


def main():
    os.makedirs(DST_DIR, exist_ok=True)
    files = sorted(glob.glob(os.path.join(SRC_DIR, "*.md")))
    if len(files) != 58:
        sys.exit(f"预期 58 篇文章，实际找到 {len(files)} 篇")
    for src in files:
        migrate_file(src)
    print(f"migrated {len(files)} posts -> {DST_DIR}/")


if __name__ == "__main__":
    main()