# 慢一点长大（动画 MV）

博客地址：`/works/grow-up-slowly/`，W-010。歌曲与歌词是作者写给 75 的原创作品，原始素材在作者本机：`慢一点长大.wav`、`慢一点长大.lrc`。

## 维护位置

- `content/works/grow-up-slowly.md`：作品信息；`layouts/works/grow-up-slowly.html`：iframe 外壳，负责 iPhone 上的伪全屏。
- `static/works/grow-up-slowly/app/`：播放器与画面，全部是 Canvas 2D 程序化绘制，没有逐帧图片。
  - `paint.js`：舞台 1920 × 1080、水粉形状（手剪边缘、每秒 8 次轻微“抖动”）、纸纹与笔触纹理。
  - `figures.js`：75、爸爸、妈妈和小伙伴共用的关节木偶，跑、走、蹲、坐等姿势；背影单独绘制。
  - `props.js`：锹甲、蝴蝶、小白鸟、花、月亮、帽子、消防头盔等小物件。
  - `sets.js`：操场、五座山与湖、下山路、草丛、卧室、四季、桌边、客厅、门厅、夜里的房子等场景。
  - `shots.js`：按 LRC 时间轴排的分镜，一句歌词对应一个或两个镜头，`in` 为溶接时长。
  - `mv.js`：歌词（内嵌 LRC）、片名、纹理叠加与播放器；画面始终由 `<audio>` 的当前时间决定。
- `fonts/`：霞鹜文楷 v1.530（SIL OFL 1.1）的子集，只含本片用到的字，常规体用于歌词，中粗用于片名和闭幕词。改动歌词或文字后运行 `sh scripts/subset-grow-up-slowly-font.sh <放有发布版 TTF 的目录>` 重新生成（需要 `pip install fonttools brotli`）。
- `song.m4a`：由 wav 转出的 AAC 160k，约 4.2 MB；`preload="none"`，第一次点播放时才下载，只打开看看不耗这部分流量。音乐走媒体播放，iPhone 静音键不影响。
- `scripts/render-grow-up-slowly.cjs`：逐帧导出 1080p / 24fps MP4（需先 `python3 -m http.server 8765 -d static`），加 `--no-lyrics` 得到无字幕版。

## 字幕与结尾

歌词用文楷常规体 50px、暖白 `#f6f1e7`、柔和投影，距底边 96px；13 字及以上的句子在逗号处分成两行。最后一句歌词之后，215.9 秒淡入闭幕词“再跑一圈吧”，218.3 秒画面连同文字直接切黑，音乐余音在黑场里结束。

## 播放器

点击画面或空格播放/暂停，←/→ 快退快进 5 秒，C 开关字幕，F 全屏。触屏设备与小窗口按 1280 × 720 绘制，其余按 1920 × 1080。角色动作按每秒 12 帧更新，像手绘动画的“一拍二”；镜头与风保持流畅。

修改分镜后，用 `?capture` 打开页面，调用 `window.mvCapture.frame(秒数)` 可以检查任意一帧。
