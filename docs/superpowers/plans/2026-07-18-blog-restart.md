# Bug1024 博客重启实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Jekyll 博客迁移到 Hugo + PaperMod，58 篇旧文 URL 不变，GitHub Actions 自动部署，品牌刷新，发布重启宣言。

**Architecture:** 沿用 jeet-blog 仓库，master 直接替换为 Hugo 站点（旧 Jekyll 代码打 tag 存档）。文章通过一次性 Python 脚本迁移 front matter；静态资源原样平移保持 URL；push 到 master 触发 GitHub Actions 构建部署。

**Tech Stack:** Hugo (extended, brew 安装) + PaperMod 主题 (git submodule) + GitHub Actions + giscus 评论。

**设计文档:** `docs/superpowers/specs/2026-07-18-blog-restart-design.md`

## Global Constraints

- 所有旧文 URL 必须保持 `/YYYY/MM/DD/slug/` 格式不变（如 `/2017/06/13/git/`）
- 图片 URL 保持 `/img/...` 不变（旧文中有 `http://bug1024.com/img/...` 绝对引用）
- 不引入任何 Ruby/Jekyll 依赖；不加任何 analytics（百度/Google 都不要）
- baseURL 为 `https://bug1024.com/`，CNAME 为 `bug1024.com`
- 评论用 giscus（GitHub Discussions），不用 Disqus/多说
- 每个 Task 完成后单独 commit

---

### Task 1: 存档旧站 + 安装 Hugo + 添加主题

**Files:**
- Modify: git tag（无文件变更）
- Create: `themes/PaperMod`（git submodule）、`.gitmodules`

**Interfaces:**
- Produces: `hugo` 命令可用（记录版本号，Task 6 工作流要用）；`themes/PaperMod` 存在

- [ ] **Step 1: 给旧 Jekyll 站点打存档 tag**

```bash
cd /Users/bug1024/Github/jeet-blog
git tag -a jekyll-legacy -m "Jekyll 时代存档（2016-2020）"
```

- [ ] **Step 2: 安装 Hugo**

```bash
brew install hugo
```

- [ ] **Step 3: 验证安装并记录版本**

Run: `hugo version`
Expected: 输出类似 `hugo v0.148.2+extended+withdeploy darwin/arm64 ...`。**记下版本号数字（如 0.148.2），Task 6 Step 1 要填入工作流。** 如果输出不含 `+extended`，执行 `brew reinstall hugo` 并确认。

- [ ] **Step 4: 添加 PaperMod 主题子模块**

```bash
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

验证：`ls themes/PaperMod/theme.toml` 存在。

- [ ] **Step 5: Commit**

```bash
git add .gitmodules themes/PaperMod
git commit -m "chore: 添加 PaperMod 主题子模块"
```

---

### Task 2: Hugo 站点骨架与配置

**Files:**
- Create: `hugo.toml`
- Create: `archetypes/default.md`
- Modify: `.gitignore`
- Create: `content/`、`static/`、`layouts/partials/` 目录

**Interfaces:**
- Consumes: Task 1 的 `themes/PaperMod`
- Produces: `hugo.toml`（后续所有 Task 依赖）；`hugo new` 生成的文章自动带正确 `slug`

- [ ] **Step 1: 创建 hugo.toml**

```toml
baseURL = "https://bug1024.com/"
title = "Bug1024"
theme = "PaperMod"
languageCode = "zh-cn"
defaultContentLanguage = "zh"
hasCJKLanguage = true
paginate = 10
enableRobotsTXT = true
summaryLength = 90
copyright = "Bug1024"

[outputs]
home = ["HTML", "RSS", "JSON"]

[permalinks.page]
posts = "/:year/:month/:day/:slug/"

[taxonomies]
tag = "tags"

[params]
env = "production"
author = "Bug1024"
description = "十年后端，现在 All in AI。写 AI 工程实践、平台架构与工程师成长。"
defaultTheme = "auto"
ShowReadingTime = true
ShowPostNavLinks = true
ShowBreadCrumbs = true
ShowCodeCopyButtons = true
ShowToc = true
TocOpen = false
ShowShareButtons = false
comments = true

[params.homeInfoParams]
Title = "Bug1024"
Content = "十年后端，现在 All in AI。这里记录我的 AI 工程实践、平台架构思考与工程师成长。每月一篇，宁缺毋滥。"

[[params.socialIcons]]
name = "github"
url = "https://github.com/bug1024"

[[params.socialIcons]]
name = "rss"
url = "https://bug1024.com/index.xml"

[[menu.main]]
name = "文章"
url = "/posts/"
weight = 1

[[menu.main]]
name = "标签"
url = "/tags/"
weight = 2

[[menu.main]]
name = "搜索"
url = "/search/"
weight = 3

[[menu.main]]
name = "关于"
url = "/about/"
weight = 4
```

- [ ] **Step 2: 创建文章原型（保证新文章自动带正确 slug）**

Create `archetypes/default.md`:

```markdown
---
title: ""
description: ""
date: {{ .Date }}
author: "Bug1024"
slug: '{{ replaceRE `^\d{4}-\d{2}-\d{2}-` "" .Name }}'
draft: true
tags: []
---
```

- [ ] **Step 3: 更新 .gitignore**

完整替换为：

```
.DS_Store
*.swap
public/
resources/
.hugo_build.lock
```

- [ ] **Step 4: 创建目录结构**

```bash
mkdir -p content static layouts/partials
```

- [ ] **Step 5: 冒烟测试——站点能启动**

Run: `hugo server --noHTTPCache`（启动后 Ctrl+C 停掉）
Expected: 输出 `Web Server is available at http://localhost:1313/` 且无 ERROR。浏览器打开 http://localhost:1313/ 能看到 PaperMod 风格首页（含"Bug1024"简介框，暂无文章）。

- [ ] **Step 6: 验证原型生成的 slug 正确**

```bash
hugo new content/posts/2099-01-01-slug-test.md
grep 'slug:' content/posts/2099-01-01-slug-test.md
```

Expected: 输出 `slug: 'slug-test'`（日期前缀被剥掉）。然后删除测试文件：

```bash
rm content/posts/2099-01-01-slug-test.md
```

- [ ] **Step 7: Commit**

```bash
git add hugo.toml archetypes/default.md .gitignore
git commit -m "feat: Hugo 站点配置与文章原型"
```

---

### Task 3: 文章迁移脚本 + 58 篇旧文迁移 + 静态资源平移

**Files:**
- Create: `migrate.py`
- Create: `verify_urls.py`
- Create: `content/posts/*.md`（58 个迁移产物）
- Rename: `img/` → `static/img/`
- Rename: `CNAME` → `static/CNAME`
- Create: `static/favicon.ico`

**Interfaces:**
- Consumes: Task 2 的 `hugo.toml`（permalink 规则）、`content/`、`static/` 目录
- Produces: 58 篇 Hugo 格式文章，每篇 front matter 含显式 `slug`；`/img/...` 与 `/CNAME` 在构建产物中可用

- [ ] **Step 1: 编写迁移脚本 migrate.py**

```python
#!/usr/bin/env python3
"""一次性迁移脚本：Jekyll _posts/*.md -> Hugo content/posts/*.md

front matter 转换规则：
  layout、header-img -> 删除
  subtitle           -> description（若已有 description 则删除 subtitle）
  + slug             -> 文件名去掉 YYYY-MM-DD- 前缀和 .md 后缀
其余字段（title、date、tags、author、keyword）原样保留，正文不动。
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
```

- [ ] **Step 2: 运行迁移脚本**

Run: `python3 migrate.py`
Expected: 输出 `migrated 58 posts -> content/posts/`

- [ ] **Step 3: 抽查迁移结果**

Run: `head -15 content/posts/2017-06-13-git.md`
Expected: front matter 中无 `layout:`、无 `header-img:`；`subtitle:` 已变为 `description:`；存在 `slug: "git"`；`title:`、`date:`、`tags:` 保留。

Run: `grep -L 'slug:' content/posts/*.md | wc -l`
Expected: `0`（每篇都有 slug）

Run: `grep -l 'header-img\|^layout:' content/posts/*.md | wc -l`
Expected: `0`（Jekyll 字段已清除）

- [ ] **Step 4: 平移静态资源**

```bash
git mv img static/img
git mv CNAME static/CNAME
cp static/img/favicon.ico static/favicon.ico
```

- [ ] **Step 5: 编写 URL 验证脚本 verify_urls.py**

```python
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
```

- [ ] **Step 6: 构建并验证 URL 一致性**

Run: `hugo --gc --minify`
Expected: 退出码 0，输出 `Total in ... ms`，无 ERROR。

Run: `python3 verify_urls.py`
Expected: `OK: 全部 58 篇文章 URL 与旧站一致`

- [ ] **Step 7: 抽查构建产物内容**

Run: `grep -o '<title>[^<]*</title>' public/2017/06/13/git/index.html`
Expected: 含 `Git入门`。

Run: `ls public/img/avatar.jpg public/CNAME public/favicon.ico public/index.xml`
Expected: 四个文件都存在（图片、域名、图标、RSS）。

- [ ] **Step 8: Commit**

```bash
git add migrate.py verify_urls.py content/posts static
git commit -m "feat: 迁移 58 篇旧文与静态资源到 Hugo"
```

---

### Task 4: About 页重写 + 搜索页

**Files:**
- Create: `content/about.md`
- Create: `content/search.md`

**Interfaces:**
- Consumes: Task 2 的菜单配置（`/about/`、`/search/`）
- Produces: 品牌页与搜索页可访问

- [ ] **Step 1: 创建 content/about.md**

```markdown
---
title: "关于"
---

## 我是谁

Bug1024，一名写了十来年代码的程序员。

90 后，福建人，北漂。职业生涯从 PHP 后端起步，后来写 Java，折腾过 MySQL、Redis、消息队列、分布式架构——这个博客 2017 年前后的五十多篇文章就是那个时期的记录。

现在我的工作围绕 AI 展开：做 AI 平台与基础设施，重度使用 AI 工具重构自己的研发工作流，也带团队把 AI 真正落到研发流程里。

## 这个博客写什么

- **AI 工程实践**：我用 AI 工具解决真实问题的工作流与踩坑记录
- **AI 平台与架构**：平台建设的一手经验与思考
- **工程师成长**：技术人的职业选择与长期主义

更新不快，每月一篇，但每篇都尽量值得你的时间。

## 联系我

- GitHub: [@bug1024](https://github.com/bug1024)
- Email: bug1024.com@gmail.com

---

*彩蛋：本站曾用名"杀猪书生的博客"。爱生活，爱运动，有点暴力，有点黄。*
```

- [ ] **Step 2: 创建 content/search.md**

```markdown
---
title: "搜索"
layout: "search"
summary: "search"
placeholder: "输入关键词搜索文章..."
---
```

- [ ] **Step 3: 本地验证**

Run: `hugo server --noHTTPCache`，浏览器依次检查：
- http://localhost:1313/about/ — 显示新 About 页，无双语切换 JS、无多说/Disqus 残留
- http://localhost:1313/search/ — 显示搜索框
- http://localhost:1313/ — 首页显示简介框 + 文章列表
- http://localhost:1313/2017/06/13/git/ — 旧文正常渲染，代码高亮正常

Expected: 四个页面均正常。Ctrl+C 停掉服务。

- [ ] **Step 4: Commit**

```bash
git add content/about.md content/search.md
git commit -m "feat: 重写 About 页，新增搜索页"
```

---

### Task 5: giscus 评论

**Files:**
- Create: `layouts/partials/comments.html`

**Interfaces:**
- Consumes: Task 2 中 `params.comments = true`（PaperMod 会自动加载此 partial）
- Produces: 每篇文章底部出现评论区

- [ ] **Step 1: 【手动】开启 GitHub Discussions**

浏览器打开 https://github.com/bug1024/jeet-blog/settings → Features 区 → 勾选 **Discussions**。

- [ ] **Step 2: 【手动】安装 giscus App**

浏览器打开 https://github.com/apps/giscus → Install → 选择 **Only select repositories** → 选 `jeet-blog` → Install。

- [ ] **Step 3: 【手动】获取 giscus 配置参数**

浏览器打开 https://giscus.app/zh-CN → "仓库"输入框填 `bug1024/jeet-blog` → 页面校验通过后，在生成的 `<script>` 代码中找到 `data-repo-id` 和 `data-category-id` 的值（页面分类保持默认 Announcements，映射保持 pathname）。

- [ ] **Step 4: 创建 layouts/partials/comments.html**

把 Step 3 拿到的两个值填入对应位置（其余保持不变）：

```html
<script src="https://giscus.app/client.js"
        data-repo="bug1024/jeet-blog"
        data-repo-id="【填入 data-repo-id】"
        data-category="Announcements"
        data-category-id="【填入 data-category-id】"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
```

- [ ] **Step 5: 本地验证**

Run: `hugo server --noHTTPCache`，打开任意文章页（如 http://localhost:1313/2017/06/13/git/ ）。
Expected: 页面底部出现 giscus 评论区（本地打开时评论区可能提示连接 GitHub，属正常；确认 `<script src="https://giscus.app/client.js"` 出现在页面源码中即可：`curl -s http://localhost:1313/2017/06/13/git/ | grep giscus`）。

- [ ] **Step 6: Commit**

```bash
git add layouts/partials/comments.html
git commit -m "feat: 接入 giscus 评论"
```

---

### Task 6: GitHub Actions 部署 + 清理 Jekyll 文件 + 上线

**Files:**
- Create: `.github/workflows/hugo.yml`
- Delete: `_config.yml`、`_posts/`、`_layouts/`、`_includes/`、`css/`、`js/`、`fonts/`、`index.html`、`about.html`、`tags.html`、`404.html`、`feed.xml`、`Gemfile`、`.ruby-version`
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 1 Step 3 记录的 Hugo 版本号；前面所有 Task 的产物
- Produces: push 后自动部署到 bug1024.com

- [ ] **Step 1: 创建 .github/workflows/hugo.yml**

把 `HUGO_VERSION` 设为 Task 1 Step 3 记录的版本号：

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.148.2
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
            && sudo dpkg -i ${{ runner.temp }}/hugo.deb
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production
        run: |
          hugo --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 删除 Jekyll 时代文件**

```bash
git rm -r -q _posts _layouts _includes css js fonts
git rm -q _config.yml index.html about.html tags.html 404.html feed.xml Gemfile .ruby-version
```

验证：`ls _posts _config.yml 2>&1` 报 No such file or directory。

- [ ] **Step 3: 重写 README.md**

完整替换为：

````markdown
# Bug1024 的博客

Hugo + PaperMod，GitHub Actions 自动部署到 GitHub Pages。
访问地址：https://bug1024.com

## 写作

```bash
hugo new content/posts/YYYY-MM-DD-my-topic.md   # 新建文章（自动生成 slug，写完把 draft 改为 false）
hugo server                                     # 本地预览 http://localhost:1313
git add . && git commit -m "new post" && git push   # push 后自动部署上线
```

## 历史

2026-07 从 Jekyll 迁移到 Hugo，旧站存档见 tag `jekyll-legacy`。
````

- [ ] **Step 4: 最终本地构建验证**

Run: `hugo --gc --minify && python3 verify_urls.py`
Expected: 构建无 ERROR；`OK: 全部 58 篇文章 URL 与旧站一致`。

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/hugo.yml README.md
git commit -m "feat: GitHub Actions 部署工作流，移除 Jekyll 文件"
```

- [ ] **Step 6: 【手动】切换 Pages 部署源**

浏览器打开 https://github.com/bug1024/jeet-blog/settings/pages → **Build and deployment → Source** → 选择 **GitHub Actions**。
同时确认：Custom domain 仍为 `bug1024.com`，勾选 **Enforce HTTPS**。

注意：切换后旧 Jekyll 产物会继续服役，直到第一次 Actions 部署成功，中间无停机。

- [ ] **Step 7: 推送全部提交**

```bash
git push origin master
git push origin jekyll-legacy
```

- [ ] **Step 8: 验证部署**

打开 https://github.com/bug1024/jeet-blog/actions ，等 `Deploy Hugo site to Pages` 工作流变绿（约 1-2 分钟）。然后依次访问验证：
- https://bug1024.com/ — 新首页（PaperMod 风格 + 简介框）
- https://bug1024.com/2017/06/13/git/ — 旧文 URL 不变，正常打开
- https://bug1024.com/2020/06/06/okhttp/ — 最新一篇旧文正常
- https://bug1024.com/tags/ — 标签页
- https://bug1024.com/about/ — 新 About 页
- https://bug1024.com/index.xml — RSS

Expected: 全部 200 且内容正确。若 Actions 失败，先看日志：常见原因是 `HUGO_VERSION` 不存在（换成 Task 1 记录的确切版本）或子模块未拉取（确认 checkout 步骤有 `submodules: recursive`）。

---

### Task 7: 发布重启宣言（第一篇新文）

**Files:**
- Create: `content/posts/2026-07-18-why-i-restart.md`

**Interfaces:**
- Consumes: Task 6 的完整部署链路
- Produces: 新站第一篇新文章上线

- [ ] **Step 1: 创建文章草稿**

创建 `content/posts/2026-07-18-why-i-restart.md`（以下为完整初稿，用户可自由修改——这是你的声音，改到像你说的话为止）：

```markdown
---
title: "我为什么重新开始写博客"
description: "停更六年之后，AI 时代，我决定重新开始写作。"
date: 2026-07-18
author: "Bug1024"
slug: "why-i-restart"
draft: false
tags:
    - 有感而发
---

上一篇博客停在 2020 年 6 月。再往前，这个博客最活跃的年份是 2017 年——那年我写了五十多篇，从 MySQL InnoDB 到 Java 线程池，像搬砖一样垒自己的技术体系。

然后就没有然后了。忙是借口，真实原因是：我觉得该学的都写在书里了，该说的别人都说过了，写作对我不再有非做不可的理由。

## 为什么现在回来

AI 改变了一切。

这不是一句空话。过去两年，我的工作内容、工作方式、甚至对"程序员"这个职业的理解，都被 AI 重塑了一遍：

- 我日常重度使用 AI 工具，研发工作流被彻底重构，很多经验是文档里没有的；
- 我在工作中做 AI 平台与基础设施，踩过的坑大多找不到现成答案；
- 我带团队落地 AI，看到了工具之外、组织层面的真实阻力与解法。

这些一手经验，恰恰是 AI 时代最稀缺的内容。模型可以生成"正确的废话"，但生成不了"我试过，这样行，那样不行"。

## 这个博客会写什么

三条主线：

1. **AI 工程实践**——我用 AI 工具解决真实问题的工作流与踩坑记录；
2. **AI 平台与架构**——平台建设的一手经验与思考；
3. **工程师成长**——技术人的职业选择与长期主义。

## 一个承诺

每月一篇，宁缺毋滥。

六年前我停更过，所以这次我不承诺频率，只承诺质量：每篇都来自真实实践，不写正确的废话。

如果你也在思考 AI 时代的工程师之路，欢迎常来看看。
```

- [ ] **Step 2: 本地预览并修改**

Run: `hugo server --noHTTPCache`，打开 http://localhost:1313/2026/07/18/why-i-restart/ 检查排版。用户按需修改正文。

- [ ] **Step 3: 发布**

```bash
git add content/posts/2026-07-18-why-i-restart.md
git commit -m "post: 我为什么重新开始写博客"
git push origin master
```

- [ ] **Step 4: 线上验证**

等 Actions 变绿后访问 https://bug1024.com/2026/07/18/why-i-restart/ 与 https://bug1024.com/ 首页。
Expected: 新文可访问，且出现在首页文章列表第一位。

---

## Self-Review 记录

- **Spec 覆盖**：技术架构(Task 1/2/6)、内容迁移(Task 3)、品牌刷新(Task 2 配置 + Task 4 About)、giscus(Task 5)、第一篇新文(Task 7)、YAGNI 项（无 analytics/Newsletter/定制设计——计划中均未引入）。✓
- **占位符扫描**：Task 5 Step 4 的 giscus ID 与 Task 6 Step 1 的 HUGO_VERSION 为运行时获取值，已给出确切获取步骤，非无指引占位。✓
- **一致性**：`slug` 生成逻辑在 migrate.py（`filename[11:-3]`）、verify_urls.py（`base[11:]`）、archetypes（正则去日期前缀）三处一致；permalink `/:year/:month/:day/:slug/` 与 verify 脚本路径拼接一致。✓
