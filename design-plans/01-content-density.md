# 让内容入口提前出现

Written against: `cb49e0e2d003b81128aac41440c86a821a44cdb4`

## Evidence chain

- Surface：首页、文章、专题、标签、作品列表、关于及文章详情。
- Problem：用户明确要求提高信息密度，当前首页专题卡 `min-height: 430px`、精选卡 `330px`，专题标题区 `330px`，作品列表每项 `440px`，空间由容器下限而非实际内容决定。
- Design evidence：`assets/scss/custom/_custom.scss` 中对应选择器；用户对过多留白的反馈；品牌规范要求内容区域把注意力留给文字。
- Owner：`layouts/partials/pages/home-posts.html`、`layouts/_default/list.html`、`layouts/topics/`、`layouts/works/list.html`、`layouts/_default/about.html`、`layouts/partials/pages/post.html` 与公共自定义 SCSS。
- Scope：公共内容页面，不包括作品独立体验。
- Uncertainty：本轮依据源码与用户反馈；尺寸和首屏目标需实施后渲染验证。

## Design decision

去掉内容卡和标题区的固定高度，以真实内容决定高度；首页把最近写作移到专题前。通过标题层级、对齐与原有色彩保留辨识度。

## Reuse

- 复用 `--brand-ink`、`--brand-steel`、`--brand-slate`、`--brand-line`、`--brand-paper`。
- 复用 `.home-recent-list` 的日期、标题、摘要结构。
- 复用 `.article-cover-media` 的 4:3 比例及图片焦点配置。
- Exemplar：`layouts/partials/pages/home-posts.html` 中最近写作，`layouts/_default/list.html` 中存档条目。
- 不新增平行组件库，不修改主题子模块。

## Changes

1. `layouts/partials/pages/home-posts.html`
   - 顺序改为介绍、最近写作、阅读专题、精选文章。最近文章仍取现有筛选后的前三篇。
   - 删除右侧 `.home-signal`，介绍改为单列，不为删除的元素保留网格列。
   - 首页主标题桌面目标 40–48px，移动 28–34px；取消第二行强制缩进，允许自然换行。
   - 介绍上下间距桌面 28–32px，移动 24px。模块之间 32–40px，移动 24–32px。
   - 专题仍保留三列，改为等宽；去掉 430px 下限、巨大篇数、`margin-top: auto` 和无内容作用的填充。篇数与名称同区，摘要最多两行，不放大数字。
   - 精选保留三篇，去掉 330px 下限和标题前 48px 间距；使用紧凑标题、摘要、链接结构。
   - Verify：首屏内容目标见总方案；不能为达到目标截断文章标题。
2. `layouts/_default/list.html` 与 `layouts/partials/pages/tag-cloud.html`
   - 页头取消最低高度，标题桌面 32–40px、移动 28–32px，上下间距约 24px。
   - 存档条目取消同时叠加的 20px 底部 padding 和 20px margin，单条采用 12–16px 上下间距；年份组 24–32px。
   - 标签保持两列，移动单列；不同时使用每项长装饰线与底边线，保留底边线。
3. `layouts/topics/list.html`、`layouts/topics/single.html`
   - 取消 `.career-head` 最低高度与 88px 上间距；删除大数字侧栏后改为单列页头。
   - 专题目录以名称、篇数和摘要为一组，取消 180px 下限，按内容与约 20–24px 上下间距排布。
   - 专题详情保留分组，分组上下间距从 78/86px 收至 28–36px；文章项约 14–18px 上下间距。
4. `layouts/works/list.html`
   - 从大横向单项改为桌面两列卡片、移动单列。图片使用 4:3 框，文本自然排列，取消 440px 下限与标题自动推底。
   - 同行图片对齐，文字可以有不同高度，标题与摘要不截断；不改变原图内容。
5. `layouts/_default/about.html`
   - 桌面保留侧栏与正文，侧栏目标 180–200px，列间距 40–56px；移动城市信息保持三项紧凑排列。
   - 城市时间线不通过空白模拟人生阶段长度。保留 sticky 目录，删除文案后不补装饰。
6. `layouts/partials/pages/post.html`
   - 取消标题区 310px 下限；有封面保留右侧 4:3 图，目标宽 240–280px，长标题可以自然增加页头高度。
   - 无图坐标板改为普通大小的编号、阅读时间辅助区，取消 290px 下限与重复日期。
   - 移动无图不建立独立大面板，有图维持 4:3 与已有裁切规则。
   - 标题目标桌面 36–48px、移动 28–34px；不统一成超大展示标题。

## Scope

- Inherit：以上模板对应路由及标签 term 页。
- Verify：暗色、长标题、摘要缺失、无图、有图、手机窄屏。
- Exclude：主题子模块、作品详情互动、内容筛选规则、URL 和发布日期。

## Validation

- Product：首屏能进入阅读，不先浏览多层介绍。
- Interface：总方案列出的四种视口；首页、`/posts/`、`/topics/` 及三个专题、`/tags/`、`/works/`、`/about/`、有图与无图文章。
- System：通过现有选择器与品牌 token 调整，无额外色彩体系。
- Repository：`hugo --noBuildLock --gc --minify`、`python3 verify_urls.py`、`git diff --check` 均通过。

## Stop conditions

如果需要修改作品内部布局或内容筛选逻辑，先报告新增范围。没有封面时不得为填空生成图片。

## Design documentation

实施验收后在文章规范记录紧凑页头与无图辅助信息的展示决策；品牌文件不新增装饰色规则。
