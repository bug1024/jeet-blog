# 我们的小小世界（纸艺动画 MV）

博客地址：`/works/our-little-world-mv/`，W-011。（`/works/our-little-world/` 是另一件隐藏作品 W-004“我们的小世界”像素地图，不要混用。）歌曲与歌词是作者的原创作品，原始素材在作者本机：`《我们的小小世界》/我们的小小世界.wav`、`我们的小小世界.lrc`。

## 维护位置

- `content/works/our-little-world-mv.md`：作品信息；`layouts/works/our-little-world-mv.html`：iframe 外壳，负责 iPhone 上的伪全屏，并用应用文件的哈希刷新缓存。
- `static/works/our-little-world-mv/app/`：播放器与画面，全部是 Canvas 2D 程序化绘制，没有逐帧图片。
  - `src/design.js`：设计系统，色彩、字体、排版层级、网格、节拍（73.5 BPM）、段落时间，以及 `AUDIO_OFFSET`。
  - `src/core.js`：随机数、噪声、运动曲线、节拍网格、镜头；`view.s` 是舞台到画布的缩放，`resetT(ctx)` 代替 `setTransform(1, 0, 0, 1, 0, 0)`。
  - `src/paper.js`：纸张与印刷，剪刀边、手撕边、正片叠底、网点、路、颗粒与暗角。
  - `src/type.js`：片名标识（只用中文）、横排与竖排歌词。
  - `src/motifs.js`：窗、房子、三花猫、山、海、书页、地图、脚印、四季邮票、剪影。
  - `src/scenes.js`：前奏与主歌 1、副歌（三次共用，按次数丰富）、尾声，以及按段落分派画面。
  - `src/scenes2.js`：预副歌 1、主歌 2、预副歌 2、桥段，以及翻页、推窗、擦回纸面等转场。
  - `src/film.js`：逐帧渲染入口、尾声歌词纸条、片尾、海报与封面、播放器。
- `lyrics.lrc`：歌词与时间轴，唯一来源；画面只读取各句起始时间作为镜头提示点。
- `fonts/`：思源宋体 CN 的 Light / Regular / SemiBold 子集（SIL OFL 1.1，见 `fonts/LICENSE.txt`）。改动歌词或画面里的文字后运行 `sh scripts/subset-our-little-world-mv-font.sh <放有 SourceHanSerifCN-*.otf 的目录>`（需要 `pip install fonttools brotli`）。
- `song.m4a`：由 wav 转出的 AAC 128k 单声道，约 3.3 MB；`preload="none"`，第一次点播放时才下载。音乐走媒体播放，iPhone 静音键不影响。
- `cover.webp` / `cover-thumb.webp`：封面与作品列表缩略图，由 `--cover` 生成的 4:3 封面转出。

## 时间

现在的歌曲文件比 LRC 所依据的版本早 0.09 秒开始，`AUDIO_OFFSET = 0.09` 统一补偿：画面时间 = 音频时间 + 0.09。歌词、节拍和镜头都按 LRC 时间，换音频时只需重新测这个偏移。

## 播放器

海报是尾声的关键画面（黄昏的房子、屋檐下的一家人、回家的路）加片名，从海报播放时从头开始。点击画面或空格播放/暂停，←/→ 快退快进 5 秒，C 开关字幕，F 全屏。触屏设备与小窗口按 1280 × 720 绘制，其余按 1920 × 1080。

## 导出

先 `python3 -m http.server 8765 -d static`，再：

```bash
PW=$(npm root -g)/playwright node scripts/render-our-little-world-mv.cjs <我们的小小世界.wav> <out.mp4> [--master] [--no-lyrics] [--from 秒 --to 秒] [--cover]
```

输出 1920 × 1080、30fps，H.264 + AAC 320k；`--master` 另存 x264 crf 12 + 原始 PCM 的 `.mov` 母版；`--cover` 在输出目录写出 4:3 与 1:1 封面。用 `?capture` 打开页面，`window.mvCapture.frame(秒数)` 可以检查任意一帧。

作品最初在作者本机的 `《我们的小小世界》/mv/` 工程里完成（含设计规范 `DESIGN.md` 与样片），之后以博客这份为准。
