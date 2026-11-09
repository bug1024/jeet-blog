# 绘本翻页效果

站内所有绘本统一使用同一套翻页：`static/js/page-curl.js` 与 `static/css/page-curl.css`。不要在单本绘本里另写翻页动画或复制这两份文件；需要调整效果时改这里，所有绘本一起生效。第一本接入的是《75’s Magic Day》（`static/works/75-magic-day/book.js`），可以照着接。

## 效果

- 纸页沿一条随书角移动的折线翻起。折线外的部分翻到页面上方，露出纸背：纸色底，透出约 10% 的镜像印刷。
- 折线两侧有三层明暗：平铺页面靠近折线处变暗，翻起的纸背在折线后有一道高光，下一页被翻起的纸投下阴影。阴影深浅随翻页进度变化，翻到一半最深。
- 纸页从右往左翻，翻过去后消失在左侧书脊，可以略微抬出页面上下边缘。
- 点击下一页、上一页、方向键或链接时自动翻，约 0.9 秒；也可以用手指或鼠标拖动：拖右侧往前翻，拖左侧往回翻，折线始终跟着手指。松手时过半或快速一甩就翻过去，否则落回原位。
- 减少动态效果模式下不翻页，直接换页。

## 接入方式

页面里先加载两份文件（Hugo 模板中用 `md5 (readFile ...)` 作版本号）：

```html
<link rel="stylesheet" href="/css/page-curl.css?v=…">
<script src="/js/page-curl.js?v=…" defer></script>
```

模块只负责画翻页，不管路由和页面状态。绘本自己决定“从哪页翻到哪页”，并在翻完后切换真实页面。

```js
// 自动翻一页。turning 是翻动的那页，under 是露出来的那页；都传克隆节点。
const controller = PageCurl.start({
    host,                       // 带定位（position 非 static）的容器，翻页舞台加在它里面
    rect: { left, top, width, height }, // 当前页相对 host 内容区的位置和尺寸
    turning: currentClone,      // 往前翻：当前页；往回翻：上一页
    under: nextClone,           // 往前翻：下一页；往回翻：当前页
    corner: "bottom",           // 翻起的书角："bottom" 或 "top"
    paper: "#faf4e6",           // 纸背颜色
});
// 往回翻时先把上一页放到“已翻过去”的位置：controller.progress(1)
await controller.play(0, 1);    // 往前翻；往回翻用 play(1, 0)
showRealPage();                 // 先换真实页面
controller.destroy();           // 再移除舞台，同一帧完成，不会闪
```

拖动翻页：

```js
PageCurl.drag(pageElement, {
    start(direction, corner) {  // direction: "forward" | "back"；没有可翻的页时返回 null
        return target ? PageCurl.start({ ... , corner }) : null; // 往回翻记得 progress(1)
    },
    end(direction, turned, controller) {
        if (turned) showRealPage();
        controller.destroy();   // 无论是否翻过去都要销毁
    },
});
```

注意事项：

- 克隆页面时去掉 `id`，图片设成 `loading="eager"`，否则下一页图片可能还没加载。
- 页面元素加 `touch-action: pan-y`，竖向滚动保持原生，横向拖动交给翻页。
- 翻页区域内的链接和按钮不会触发拖动，点读、互动按钮照常可用。
- 跳到非相邻的位置（如目录、结尾页）可以用普通过渡，不必翻页。
