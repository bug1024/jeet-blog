---
name: blog-cover-generator
description: 为 BUG1024 个人网站和“第 1024 格”系列生成、调整并准备具有作者识别度的文章封面与视觉作品。适用于博客封面（blog cover）、文章头图（hero image）、社交分享图（social sharing image）、作品集版本（portfolio edition）、视觉概念和封面变体等任务，覆盖工作、系统、AI、工程、生活、家庭、时间、摄影和个人经历等内容。保持墨色、雾白和钢蓝的克制体系；每张 AI 生成图必须表达与文章相关的一种自然秩序、一个明确的 Bug，以及一次具有实际作用的钢蓝回应，避免落入通用编辑配图风格。
---

# BUG1024 文章封面生成器

生成对文章的视觉解释，而不是第二块标题区。让图像负责气质和隐喻，让标题负责表达观点。

## 必读资料

选择视觉方向前，完整阅读：

- [brand-system.md](references/brand-system.md)：固定品牌规则与生产规范；
- [visual-system.md](references/visual-system.md)：“第 1024 格”的作者签名、Bug 分类和验收标准；
- [visual-directions.md](references/visual-directions.md)：视觉方向选择与英文 Prompt 范例；
- [runtime-adapters.md](references/runtime-adapters.md)：在不改变视觉体系的前提下选择图片生成运行时。

在 `jeet-blog` 仓库内工作时，还必须完整阅读 `AGENTS.md`、`docs/content/article-authoring.md` 和 `docs/brand/bug1024-identity.md`。仓库规则发生变化时，以仓库规则为准。

## 工作流程

1. 阅读文章全文或用户提供的完整提纲。不得只根据标题推测封面。
2. 提取视觉简报，至少包括：
   - 具体主题；
   - 核心矛盾或关系；
   - 一个隐喻或真实场景中可见的自然秩序；
   - 恰好一种 Bug 类型及其具体表现；
   - 钢蓝承担 Bug、修补（patch）还是痕迹（trace）；
   - 可选的人为痕迹，例如使用、选择、照料或维护；
   - 预期的情绪温度；
   - 需要排除的物件与陈词滥调。
3. 判断是否确实需要生成封面：
   - 存在作者本人拍摄且与文章直接相关的照片时，优先使用照片；
   - 找不到诚实、具体的视觉概念时，使用网站默认钢蓝文章坐标板；
   - 只有图像能够实质解释文章，而非单纯填补空白时，才生成新图。
4. 生成封面时应用 `references/visual-system.md`。不断收紧简报，直到秩序、Bug 和钢蓝作用都具体且与文章不可互换。
5. 从 `references/visual-directions.md` 中只选择一个方向。默认使用“结构静物”；只有文章明显需要其他媒介时才切换。除非用户要求对比，否则只生成一个方案。
6. 根据简报和品牌规则编写英文生产 Prompt。不得在图内放置文章标题、`1024`、BUG1024 字标、封面编号、伪代码、UI 标签或装饰文字。
7. 根据 `references/runtime-adapters.md` 选择图片生成运行时。跨平台时保持视觉简报和验收规则一致。
8. 同时检查全尺寸图和小缩略图，并应用 `visual-directions.md` 与 `visual-system.md` 中的验收标准。拒绝通用氛围图、装饰性钢蓝、过度隐藏或过度突出的 Bug，以及多个相互竞争的异常。
9. 每次迭代只调整一个明确问题。保留已经确认的主题、秩序、Bug 类型、构图、配色和情绪。
10. 使用 `scripts/prepare_cover.py` 将选中图片处理为 `2400 × 1800`、兼容 sRGB 的 RGB WebP。除非构图依赖边缘完整性，否则使用 `cover` 裁切。
11. 在 `jeet-blog` 中默认保存为 `static/images/article/<slug>-cover.webp`。未获得明确许可时，不得覆盖已有封面。
12. 编写客观描述画面内容的 `alt`。不得把隐喻、创作解释或 Prompt 塞入 `alt`。只有真实地点、日期、来源或具体观察需要记录时才添加图注；不得为生成图虚构纪实信息。
13. 在 `jeet-blog` 中为每张 AI 生成封面分配连续的 `bug-visual-NNN` 编号，按照 `references/visual-system.md` 的约定创建 `data/visuals/<id>.yaml`，记录自然秩序、Bug、钢蓝作用、隐喻和最终 Prompt；在文章 front matter 中用顶层 `visual` 字段关联该编号。
14. 写入 front matter 前检查当前文章模板。模板不支持约定的 `cover` 字段时，明确说明；得到授权后补齐支持，否则保持图片未接入。不得在模板实际忽略配置时宣称封面已经生效。
15. 交付时报告视觉编号、视觉方向、自然秩序、Bug 类型、钢蓝作用、最终英文 Prompt、保存路径、尺寸以及是否已经接入文章。

## 英文 Prompt 模板

只保留当前任务需要的字段，避免把 Prompt 写成冗长的规则堆积：

```text
Use case: <stylized-concept or photorealistic-natural>
Asset type: BUG1024 article cover, 4:3 landscape
Article premise: <one factual sentence>
Natural order: <one real arrangement, rhythm, sequence, boundary, or structure>
Single Bug: <one Bug type and its physical manifestation>
Steel-blue role: <the Bug, patch, or trace; causal, not decorative>
Primary request: <one scene expressing this relationship>
Style/medium: <selected direction>
Composition/framing: one clear focal relationship, generous breathing room, readable at thumbnail size, no text area required
Lighting/mood: restrained, observant, quiet confidence; not dramatic or sentimental
Color palette: ink #111A21, mist white #F8FAF9, muted natural materials; steel blue #365B6D occupies less than 10% and participates in the Bug
Constraints: no words, letters, numbers, logo, title, watermark; exactly one Bug; no generic grid overlay
Avoid: cyberpunk, neon blue, holograms, humanoid robots, glowing brains, circuit-board clichés, server-rack literalism, glossy corporate stock photography, cinematic spectacle, motivational-poster mood
```

## 交付规则

- 默认只交付一张完成的封面，不生成联系表。
- 将 AI 生成封面视为“第 1024 格”视觉作品的一部分；跨题材保持“秩序—Bug—钢蓝”关系，但不机械重复同一种构图。
- 编辑作者照片时保持事实真实性，不得生成不存在的物体或改变纪实含义。
- 文章封面内不放 BUG1024 标志，网站页眉已经承担品牌识别。
- AI 生成作品中的钢蓝必须具有结构意义，不得只是可有可无的装饰；不得为了统一而把钢蓝强加到作者纪实照片中。
- 不得在每张图里放置 `1024`、网格、坐标或作品编号。“第 1024 格”不是寻找彩蛋的游戏。
- 文章封面标准比例为 `4:3`。只有用户明确要求时才从同一视觉概念派生独立社交裁切版本。
- `alt` 只描述可见内容；视觉隐喻与生成过程以 `data/visuals/` 中的档案为准。
- 未经用户明确要求，不得提交、发布或修改文章模板。
- 以仓库内当前目录作为 Skill 唯一事实源。其他平台应链接或打包此目录，不得维护内容不同的副本。

## 封面规格化

Run:

```bash
python3 scripts/prepare_cover.py INPUT OUTPUT --fit cover --focus-x 50 --focus-y 50
```

只有构图必须完整保留时才使用 `--fit contain`。运行 `python3 scripts/prepare_cover.py --help` 查看全部参数。
