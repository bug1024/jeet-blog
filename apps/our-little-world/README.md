# 我们的小世界

一份家庭互动作品，以一张可以探索的存档地图串起 2018 年至今的六段故事。

## 内容维护

- 章节、年份和正文：`src/data/chapters.ts`
- 角色卡与未来留言：`src/data/memories.ts`
- 页面状态和交互：`src/App.vue`
- 视觉样式：`src/style.css`

章节中的记忆画面全部采用内联 SVG 绘制，场景类型在 `chapters.ts` 中配置，不依赖真实照片。

## 本地构建

```bash
npm run typecheck:little-world
npm run build:little-world
hugo server --noBuildLock --buildDrafts
```

生成文件输出到 `static/works/our-little-world/app/`，Hugo 页面入口位于 `content/works/our-little-world.md`。页面正式发布，但通过通用的 `hidden` 参数从公开列表隐藏，仅保留直接访问入口。
