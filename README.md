# Bug1024 的博客

Hugo + Meme，GitHub Actions 自动部署到 GitHub Pages。
访问地址：https://bug1024.com

## 写作

Codex 创建或修改文章前应先读取 [`docs/content/article-authoring.md`](docs/content/article-authoring.md)。

```bash
hugo new content/posts/YYYY-MM-DD-my-topic.md   # 新建文章（自动生成 slug，写完把 draft 改为 false）
hugo server                                     # 本地预览 http://localhost:1313
git add . && git commit -m "new post" && git push   # push 后自动部署上线
```

## 历史

2026-07 从 Jekyll 迁移到 Hugo，旧站存档见 tag `jekyll-legacy`。
