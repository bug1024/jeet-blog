# 那道旧门槛（水粉动画 MV）

博客地址：`/works/old-threshold-mv/`，W-012。歌曲与歌词是作者写给父亲的原创作品；原始素材与动画工程在作者本机：`《那道旧门槛》/那道旧门槛.wav`、`那道旧门槛.lrc`、`mv/`（工程 README 里有导出视频、静帧、封面的命令）。

## 怎么做到实时播放

和《慢一点长大》《我们的小小世界》一样，画面由浏览器按歌曲时间实时绘制。水粉笔触很重，所以每个镜头拆成图层（`src/shot.js`）：

- 不动的部分（天空、远山、地形、房屋、廊桥）在镜头开始前画一次，缓存成位图，之后只做平移缩放；
- 会动的部分（人物、缝纫机、炊烟、雨、灯光、电视画面）每帧重画；
- 播放器在空闲帧里提前画好接下来几秒的镜头，用完的镜头释放缓存。

1080p 下一帧约 3–9 毫秒。触屏设备和小窗口按 1280 × 720 绘制，缓存也随之缩小。

画面以意境为主：人物走路多用远景，廊桥里只露出窗口经过的头；门槛段父亲不走进走出，用镜头叠化和前景路人遮挡交代。

## 维护位置

- `content/works/old-threshold-mv.md`：作品信息；`layouts/works/old-threshold-mv.html`：iframe 外壳，负责 iPhone 上的伪全屏，用应用文件的哈希刷新缓存。
- `static/works/old-threshold-mv/app/`
  - `src/`：与工程 `mv/src/` 相同的绘制代码。改画面时先在工程里改、看，再整体复制过来。
    - `design.js` 设计系统与段落时间；`gouache.js` 水粉纹理与笔触；`figure.js` 人物骨骼、IK 与步态；`land.js` 山路与廊桥；`shot.js` 图层缓存；`scenes.js` 镜头表与预取；`scene-*.js` 各段画面；`film.js` 播放器。
  - `lyrics.lrc`：歌词与时间轴，唯一来源。
  - `song.m4a`：由 wav 转出的 AAC 128k 单声道，约 4.2 MB；`preload="none"`，第一次点播放时才下载。走媒体播放，iPhone 静音键不影响。
  - `poster.webp`：播放前的海报。
  - `fonts/`：三类文字分开处理——歌词用霞鹜文楷常规体（`hand-regular`，无描边、深灰褐、整句淡入淡出）；黑板字用霞鹜文楷中等字重（`hand-medium`），在画面里渲染成粉笔：缩小、逐字书写、轻微错位，带固定颗粒与断笔；手机聊天用设备自带黑体，不打包字体。片名仍用思源宋体（`serif-*`）。均为 SIL OFL 1.1 子集，许可见 `fonts/LICENSE*.txt`。改歌词或画面里的字后运行 `sh scripts/subset-old-threshold-mv-font.sh <思源宋体目录> <霞鹜文楷目录>`。
- `static/works/old-threshold-mv/cover.webp` / `cover-thumb.webp`：封面与作品列表缩略图，由工程的 `tools/cover.cjs` 生成。

## 播放器

点击画面或空格播放/暂停，←/→ 快退快进 5 秒，C 开关字幕，F 全屏。
