# 收紧文章的章节与收尾间距

Written against: `cb49e0e2d003b81128aac41440c86a821a44cdb4`

## Evidence chain

- Surface：文章详情与关于正文。
- Problem：用户希望提高信息密度；文章二级标题上间距 `3.15em`、移动 `2.65em`，文章页头后另有 44px、移动 54px 空档。
- Design evidence：`assets/scss/custom/_custom.scss` 的 `.article-body`、标题规则与移动分支；用户明确选择此项调整。
- Owner：公共 SCSS、`layouts/partials/pages/post.html`、`layouts/partials/components/topic-nav.html`。
- Scope：阅读排版，不改文章事实或章节结构。
- Uncertainty：收尾包含主题可选 partial，必须确认实际启用项，不能根据模板调用就认定全部展示。

## Design decision

通过缩小章节前后与页头之后的间距提高密度。保留正文约 700px 栏宽、现有字号及约 1.86 行距。

## Reuse

- 复用 `.article-body`、`.article-finish`、`.career-article-nav` 和现有品牌分隔线。
- Exemplar：现有正文段落 `.article-body > p`。

## Changes

1. `assets/scss/custom/_custom.scss`
   - 正文距页头桌面 28–32px、移动 24–28px，替换 44/54px。
   - 二级标题上间距改为约 `1.8em`，下间距约 `0.65em`；三级上间距约 `1.4em`。
   - 保留段落正常呼吸空间，正文不缩字、不挤行。代码块与表格按现有样式保留，检查相邻段落间距。
   - 关于正文标题采用同一节奏，不继续使用独立的超大章节间距。
2. 文章收尾与专题导航
   - 先查实际配置和渲染出的 footer，避免同时保留重复日期、序号、上下篇入口。
   - `.article-finish` 缩为一行辅助信息。专题文章以 `.career-article-nav` 作为主要后续入口；仅确认普通 post-nav 同时实际展示时，收掉重复入口。
   - 不在日期行、专题进度、上下篇区同时新增长横线；保留必要的正文结束分隔即可。

## Scope

- Inherit：所有普通文章及关于正文。
- Verify：有图、无图、长标题、短文、长文、引用、列表、代码块、表格、专题内外文章。
- Exclude：作品专用正文与交互、评论功能、文章内容删改。

## Validation

- Product：更早进入正文，章节之间可辨认但不形成空屏。
- Interface：四种视口、明暗主题；无横向溢出，代码与表格不被压缩。
- System：确认主题实际启用的 footer 组合后再删重复展示，不改主题子模块。
- Repository：仓库规定的三项检查通过。

## Stop conditions

如果无法确认某个 footer 是否实际展示，保留该功能并记录待核验项；不得凭模板名称删除。

## Design documentation

验收后将正文栏宽与章节节奏记录在文章规范，不为减少留白改写封面品牌规则。
