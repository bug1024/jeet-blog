# 75捞鱼互动作品

博客地址：`/works/75-fishing/`，入口自动出现在作品目录中。

## 维护位置

- `content/works/75-fishing.md`：作品信息与目录缩略图。
- `layouts/works/fishing.html`：保留博客页眉的作品模板。
- `static/works/75-fishing/app/`：Three.js 场景、样式、界面和依赖。
- `static/works/75-fishing/cover.png`：来自75表情包项目的现有横幅。

场景在同源 iframe 内运行，隔离 Three.js 页面样式与 Meme 主题样式。博客页眉与导航继续使用全站品牌，场景页面设为 noindex，作品主地址由 Hugo 提供 canonical 与 sitemap。所有资源随 Hugo 构建发布，不依赖独立站点或运行时 CDN。

Three.js 固定为 0.180.0，本地依赖及许可证在 `app/vendor/`。这是一个纯静态作品，不需要增加 npm 构建步骤。此目录现在是博客中这一版场景的维护来源。

## 交互

拖动旋转、滚轮或双指缩放；点击75或“捞一下”挥网；点击水面惊鱼。水流、日光、暂停、重置视角及保存PNG按钮均可用。聚焦场景后，方向键旋转，空格暂停，Enter捞鱼，R重置。计数仅保留于当前页面，小鱼展示后放回溪流。系统开启减少动态效果时默认暂停。

## 验证与预览

```bash
node --check static/works/75-fishing/app/main.js
hugo --noBuildLock --gc --minify
python3 verify_urls.py
git diff --check
hugo server --bind 127.0.0.1 --port 1313
```

打开 `http://127.0.0.1:1313/works/75-fishing/`。

源码是程序化风格模型，水面、鱼群与捕捞使用视觉近似，没有流体模拟或真实网布物理。
