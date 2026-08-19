# 我们的秘密世界

一份隐藏发布的像素互动作品。它用八段无日期记录呈现两个人从相遇、靠近到保持边界的过程，页面以两个始终不重合的发光像素作为视觉签名。

## 内容维护

- 故事与节点：`src/data.ts`
- 页面状态与交互：`src/App.vue`
- 像素画面：`src/components/SecretScene.vue`
- 背景音乐：`src/useSecretMusic.ts`
- 视觉样式：`src/style.css`

## 构建

```bash
npm run typecheck:works
npm run build:secret-world
hugo server --noBuildLock --buildDrafts
```

页面正式发布，但通过 `hidden: true` 从常规列表隐藏，仅保留直接链接。
