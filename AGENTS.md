# Bug1024 博客协作说明

## 写作任务

创建、改写或发布任何博客文章之前，必须完整阅读：

- `docs/content/article-authoring.md`

该文档是文章定位、文案语气、front matter、摄影题图、图注和无图回退方式的唯一详细规范。

## 设计任务

修改网站视觉、标志或品牌色之前，必须完整阅读：

- `docs/brand/bug1024-identity.md`

钢蓝 `#365B6D` 是结构色，不是用于活跃画面的通用装饰色。同一画面只保留一个主要视觉异常。

## 内容与路径约束

- 正文位于 `content/posts/`。
- 文件名使用 `YYYY-MM-DD-topic.md`，`slug` 使用稳定、无日期的英文短语。
- 文章 URL 统一为 `/posts/:slug/`，发布后不要随意修改 `slug`。
- 新文章默认 `draft: true`，用户明确要求发布时才改为 `false`。
- 不为文章强行寻找无关配图；没有合适摄影作品时使用默认钢蓝文章坐标板。

## 交付前验证

```bash
hugo --noBuildLock --gc --minify
python3 verify_urls.py
git diff --check
```

保留 Hugo/Meme 自身的弃用警告，不要为了消除警告修改主题子模块。
