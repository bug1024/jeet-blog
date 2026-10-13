# 首页双栏距离小幅收紧

Written against: 15b1ff8c99692effea145c27fea3f1140d81bfb5

## Evidence chain

- Surface: 首页 `/` 三个内容模块。
- Problem: 用户接受小幅缩短栏目与内容的横向距离，不改变栏目字号。
- Design evidence: 当前 `.home-directory` 大屏左栏 148px、间距 32px；中屏 110px、间距 24px。桌面分隔虚线起点跟随内容栏。
- Owner: `assets/scss/custom/_custom.scss` 的 `.home-directory`。
- Scope and affected surfaces: 三个首页模块的双栏布局及两条模块分隔虚线。
- Uncertainty: 视觉效果需通过桌面和移动端预览验收，这是已选择的试验，不是已证实的规则违规。

## Design decision

大屏左栏维持 148px，只将间距由 32px 减至 24px，内容起点向左移动 8px。中屏保持现有 110px/24px，720px 以下继续单栏。两条虚线的大屏起点同步从 180px 改为 172px，不新增分隔线。

## Reuse

- 复用 `.home-directory`、`.home-section-head`、`--brand-line` 和现有断点。
- Exemplar: 当前 900px 断点的 24px 间距。

## Changes

1. `assets/scss/custom/_custom.scss`
   - Change: 仅调整大屏横向 gap 与虚线起点。
   - Preserve: 栏目 18px 普通字重宋体、所有标题字号、钢蓝主标题、摘要与元信息颜色、垂直间距。
   - Verify: 三个内容模块与虚线起点保持对齐，窄屏布局不退化。

## Scope

- Inherit: 首页三个内容模块。
- Verify: 1440px、900px、720px、390px、375px。
- Exclude: 首页以外页面、字体、主标题、丫丫和新装饰。

## Validation

- Product: 原有导航链接与文章数据保持不变。
- Interface: 桌面内容起点比原来左移 8px；中屏和移动端维持原布局，无横向溢出。
- System: 不建立另一套字体或颜色体系。
- Repository: `hugo --noBuildLock --gc --minify`、`python3 verify_urls.py`、`git diff --check`。

## Stop conditions

- 若需要缩小文字或增加背景来实现效果，停止并保留原设计。

## Design documentation

- None。仅本地预览，不提交、不推送。
