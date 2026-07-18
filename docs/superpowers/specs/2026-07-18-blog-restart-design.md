# Bug1024 博客重启设计

日期：2026-07-18
状态：已获用户批准

## 背景与目标

Bug1024 博客（bug1024.com，GitHub Pages + Jekyll）自 2020 年 6 月停更至今。现有 58 篇文章，集中在 2017 年（PHP/Java/MySQL 等后端技术 + 年度总结）。主题和依赖均为 2016-2017 年代技术。

目标：在 AI 时代重启博客，作为打造个人影响力的平台。

## 关键决策（经用户确认）

| 维度   | 决策                            |
| ---- | ----------------------------- |
| 内容定位 | AI 实践为主线 + 职业成长               |
| 差异化  | 一线实操 + 平台架构 + 团队落地三重视角        |
| 节奏   | 每周投入 2-3 小时，每月 1 篇深度文，少而精     |
| 技术栈  | 迁移到 Hugo                      |
| 分发   | 先博客跑顺，后加渠道                    |
| 旧文   | 58 篇全保留，URL 不变                |
| 品牌   | 保留 Bug1024，重写专业简介，"杀猪书生"降级为彩蛋 |
| 路线   | 方案 A：快速重启——成熟主题快速迁移，时间全部留给写作  |

## 1. 技术架构

- **Hugo (extended) + PaperMod 主题**：简洁、快、暗色模式、移动端友好、SEO 开箱即用
- **仓库**：沿用当前 `jeet-blog` 仓库。旧 Jekyll 代码打 tag（`jekyll-legacy`）存档，master 替换为 Hugo 站点
- **部署**：GitHub Actions 工作流——push 到 master 自动构建 Hugo 并发布到 GitHub Pages；`CNAME` 保留，bug1024.com 不变。写作流不变：写完 push 即生效
- **本地预览**：`hugo server`（不再依赖 Ruby 环境）

## 2. 内容迁移（58 篇全保留，URL 不变）

- 一次性迁移脚本：`_posts/*.md` → `content/posts/`
  - front matter 转换：`subtitle` → `description`；文件名日期后缀 → 显式 `slug`；保留 `title`、`date`、`tags`、`author`
  - 移除 Jekyll 专有字段：`layout`、`header-img`（PaperMod 不用；如个别文章需要头图可后续单独处理）
- Hugo permalink 配置为 `/:year/:month/:day/:slug/`，与 Jekyll `permalink: pretty` 生成的 URL 完全一致（如 `/2017/06/13/git/`）——旧链接一个不死
- `img/` 目录原样移入 `static/img/`，文中图片链接零改动
- 标签页、RSS、站点地图用 Hugo 内建 taxonomy/feed 替代原手写页面（tags.html、feed.xml）
- 迁移后验证：抽查若干旧文 URL 与线上一致；图片正常显示；标签页正常

## 3. 品牌刷新

- 站名保留 **Bug1024**
- 简介重写为专业定位：谁在写 + 写什么 + 为什么值得读
- **About 页重写**：十年后端老兵 → AI 平台/工具实践者的叙事线
- "杀猪书生"降级为 About 页彩蛋
- 清理时代遗迹：微博账号、百度统计、多说（duoshuo）残留全部移除
- 评论用 **giscus**（基于 GitHub Discussions，零成本零维护）
- 头像沿用现有 `img/avatar.jpg`

## 4. 内容策略（重启后前三个月）

- **第一篇**：《我为什么重新开始写博客》——重启宣言 + 内容承诺，本身即定位声明
- **三个内容支柱**：
  1. AI 工具实战工作流（一线经验）
  2. AI 平台/架构思考（平台视角）
  3. 团队落地与工程师成长（组织视角）
- 节奏：每月 1 篇深度文
- 选题库：先囤 10 个题目防断粮

## 5. 明确不做（YAGNI）

- 不做定制视觉设计
- 不接 Newsletter
- 不做多平台同步
- 不加 Google Analytics / 百度统计
- 以上待 5-6 篇新文发布后再评估

## 成功标准

- bug1024.com 以新形象上线，58 篇旧文 URL 全部可访问
- 第一篇新文发布
- 写作-发布流程顺畅：本地 `hugo server` 预览 → push 自动上线
