# 首页文章整行链接

Written against: 15b1ff8c99692effea145c27fea3f1140d81bfb5

## Evidence chain

- Surface: 首页 `/`，最近写作、阅读索引与精选文章。
- Problem: 最近写作和精选文章的整个 article 悬停会给标题加下划线，但只有标题链接可点击；阅读索引的整项都是链接。
- Design evidence: 用户已选择统一整行文章的点击范围，保留细下划线，不使用位移、缩放或背景色。
- Owner: `layouts/partials/pages/home-posts.html` 和 `assets/scss/custom/_custom.scss` 的 `.home-directory`。
- Scope and affected surfaces: 仅首页最近写作与精选文章，阅读索引作为现有参照。
- Uncertainty: 改变 DOM 后须验证旧样式不会使摘要、元信息继承错误的颜色或装饰。

## Design decision

最近写作和精选文章采用原生单个整行链接，包含标题、摘要及日期或标签。每篇保持一个键盘焦点，标题不再嵌套链接。仅标题在悬停和键盘焦点时显示现有细下划线。

## Reuse

- 复用原有 URL、标题、摘要、日期、标签和所有字体、颜色 token。
- Exemplar: `.home-topic-list a` 和 `.home-directory a:focus-visible`。
- 不新增组件、依赖或点击事件脚本。

## Changes

1. `layouts/partials/pages/home-posts.html`
   - Change: 在最近写作和精选文章的 article 内将原有内容包进一个 `.home-article-link` 原生链接，去掉 h3 内的链接。标签元信息可改为 div 以保持链接内合法内容。
   - Preserve: 内容过滤、排序、精选 slug、日期与链接。
   - Verify: 标题、摘要、日期、标签和行内空白均可点击，文章之间的间隔不触发错误链接。
2. `assets/scss/custom/_custom.scss`
   - Change: 将原有 article 的内部双栏布局迁移至 `.home-article-link`，同步移动端单栏选择器及标题悬停/焦点下划线选择器。显式保证链接自身无整体下划线、摘要与日期保留各自颜色。
   - Preserve: 原有标题字体字号颜色、摘要密度、日期顺序、单栏断点、静态反馈。
   - Verify: 标题以外无下划线，无位移、背景色或缩放。

## Scope

- Inherit: 首页两个文章模块。
- Verify: 375px、390px、720px、900px、1440px，深浅色主题。
- Exclude: 文章内容、其他页面、丫丫动画、品牌标志和发布状态。

## Validation

- Product: 点击和键盘 Enter 可到正确文章，无嵌套链接。
- Interface: 标题统一细下划线，移动端无横向溢出或文字重叠。
- System: 不引入 JS 模拟导航。
- Repository: `hugo --noBuildLock --gc --minify`、`python3 verify_urls.py`、`git diff --check` 全部通过，保留 Hugo 弃用警告。

## 验收记录

- 2026-10-13：已实施，Hugo 构建、89 篇 URL 校验和 diff 检查通过。
- 浏览器中点击最近写作的摘要、精选文章的标签区域，均进入对应文章；键盘 Enter 可打开 Soul-TTY。
- Tab 焦点下标题有细下划线、摘要无下划线，整行链接无嵌套链接。
- 375px 与 390px 为单栏，无横向溢出；恢复浏览器默认尺寸后保持桌面双栏。深浅主题的标题与辅助文字颜色保留。
- 本地预览进程已重启，首页正常加载。未提交、未推送。

## Stop conditions

- 若必须改变其他页面的共享布局或字体，停止扩大范围。

## Design documentation

- None。仅本地预览，不提交、不推送。
