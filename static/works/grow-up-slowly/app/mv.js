// Player for the 慢一点长大 MV: draws each frame from song time, so picture, lyrics and music cannot drift apart.
// ?capture exposes window.mvCapture for rendering the video file frame by frame (see scripts/render-grow-up-slowly.cjs).
import { W, H, S, clamp, smooth, range, makeTextures } from './paint.js';
import { SHOTS, DURATION } from './shots.js';

const LRC = `[00:10.64]傍晚的操场，风吹乱你的头发
[00:15.23]你跑在前面，催我快点追上
[00:19.56]爬过五座山峰，终于看见湖光
[00:23.93]下山时趴在背上，睡得安安静静
[00:28.89]草丛里的锹甲，有没有自己的家
[00:33.32]你问了好多问题，舍不得放下
[00:38.20]蝴蝶飞向远方，小鸟也有了家
[00:42.60]你望着它们，笑得像朵花
[00:47.24]你总想赢，又害怕输
[00:51.93]一点小委屈，能记住好久
[00:55.93]白天说错的话，夜里又想起
[01:01.25]你问我，做错了还算不算好孩子
[01:05.90]慢一点长大，慢一点长大
[01:10.53]让我再陪你跑过春秋冬夏
[01:15.22]不必每次都赢，不必永远听话
[01:19.88]哭过笑过，都是成长的回答
[01:24.54]慢一点长大，慢一点长大
[01:29.10]世界那么大，还有多少没开的花
[01:33.76]愿你有自己的主张，也有柔软的心肠
[01:38.82]带着一点倔强，去看看远方
[01:44.04]你喜欢粉色，喜欢桌上摆着花
[01:48.09]每件小小的事，都有自己的想法
[01:52.78]骑在我的肩上，说要去拯救世界
[01:57.11]转眼又靠在怀里，问我明天去哪
[02:01.85]你等我回家，问了妈妈好几遍
[02:06.48]一见面就拉着手，说今天的新发现
[02:11.16]有时我也会着急，忘了你才五岁
[02:15.76]还有那么多事情，要陪你慢慢学会
[02:20.46]总有一天，你不再要我抱
[02:25.13]有自己的朋友，有自己的热闹
[02:29.78]也许忘了这些普通的夜晚
[02:34.75]忘了我曾陪你跑过多少圈
[02:39.11]慢一点长大，慢一点长大
[02:43.73]让我再陪你跑过春秋冬夏
[02:48.42]不必每次都赢，不必永远听话
[02:53.09]做错了再重新来，也没什么可怕
[02:57.76]慢一点长大，慢一点长大
[03:02.45]我知道你终究会走向远方
[03:07.02]愿你依然爱奔跑，依然心地柔软
[03:11.66]愿这世界，值得你所有的喜欢
[03:16.95]傍晚的操场，风吹乱你的头发
[03:21.63]你回头喊我，爸爸，快一点呀
[03:26.28]我笑着追上去，像往常一样
[03:30.35]却希望这段路，能再长一点啊`;

const LYRICS = LRC.split('\n').map((line) => {
    const m = line.match(/^\[(\d+):(\d+\.\d+)\](.*)$/);
    return { t: +m[1] * 60 + +m[2], text: m[3].trim() };
});
// Long lines break at the comma, like a line of verse; short ones stay whole.
LYRICS.forEach((l) => { l.lines = [...l.text].length >= 13 && l.text.includes('，') ? [l.text.slice(0, l.text.indexOf('，')), l.text.slice(l.text.indexOf('，') + 1)] : [l.text]; });
LYRICS.forEach((l, i) => { l.end = Math.min(LYRICS[i + 1] ? LYRICS[i + 1].t - 0.3 : l.t + 5.2, l.t + 6.5); });

// LXGW WenKai (SIL OFL 1.1), cut down to the characters this film uses: fonts/README.md.
const KAI = '"MV WenKai", "Kaiti SC", "STKaiti", "KaiTi", serif';
const fontsReady = Promise.all([
    ['fonts/wenkai-regular.woff2', '400'],
    ['fonts/wenkai-medium.woff2', '500'],
].map(([url, weight]) => new FontFace('MV WenKai', `url(${url})`, { weight }).load().then((f) => document.fonts.add(f)).catch(() => {})));
const capture = new URLSearchParams(location.search).has('capture');

const root = document.getElementById('mv');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const buffer = document.createElement('canvas');
const bctx = buffer.getContext('2d');
let scale = 1, textures = null, showLyrics = true;

function setResolution(w) {
    const h = Math.round((w * 9) / 16);
    // The HTML canvas already starts at 1280 wide, so the size alone does not mean the textures exist.
    if (canvas.width === w && textures) return;
    canvas.width = buffer.width = w;
    canvas.height = buffer.height = h;
    scale = w / W;
    textures = makeTextures(w, h);
}

function shotIndex(T) {
    let i = 0;
    while (i < SHOTS.length - 1 && SHOTS[i + 1].t <= T) i++;
    return i;
}

function drawShot(c, i, T) {
    const shot = SHOTS[i];
    const end = SHOTS[i + 1] ? SHOTS[i + 1].t : DURATION;
    const lt = T - shot.t;
    c.save();
    c.setTransform(scale, 0, 0, scale, 0, 0);
    c.fillStyle = '#1c1420';
    c.fillRect(0, 0, W, H);
    shot.draw(c, lt, clamp(lt / (end - shot.t)), T);
    c.restore();
}

function title(T) {
    const a = smooth(range(T, 1.6, 3.2)) * (1 - smooth(range(T, 7.6, 9.2)));
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = '#fff7ea';
    ctx.shadowColor = 'rgba(70, 40, 50, .35)';
    ctx.shadowBlur = 18;
    ctx.font = `500 132px ${KAI}`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('慢一点长大', 150, 300);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = a * 0.85;
    ctx.fillRect(156, 344, 64, 4);
    ctx.font = `400 40px ${KAI}`;
    ctx.fillText('给 75', 156, 404);
    ctx.restore();
}

function lyric(T) {
    if (!showLyrics) return;
    const line = LYRICS.find((l) => T >= l.t - 0.05 && T < l.end + 0.3);
    if (!line) return;
    const a = smooth(range(T, line.t - 0.05, line.t + 0.25)) * (1 - smooth(range(T, line.end, line.end + 0.3)));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = `400 50px ${KAI}`;
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0, 0, 0, .25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2 * scale;
    ctx.fillStyle = '#f6f1e7';
    line.lines.forEach((text, k) => ctx.fillText(text, W / 2, H - 96 - (line.lines.length - 1 - k) * 65));
    ctx.restore();
}

// Closing words after the last line: they come in softly, and the film stops dead on them.
const CLOSE_IN = 215.9, CUT = 218.3;
function closing(T) {
    if (T < CLOSE_IN || T >= CUT) return;
    ctx.save();
    ctx.globalAlpha = smooth(range(T, CLOSE_IN, CLOSE_IN + 0.6));
    ctx.font = `500 76px ${KAI}`;
    ctx.letterSpacing = '10px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(40, 20, 30, .3)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 3 * scale;
    ctx.fillStyle = '#f6f1e7';
    ctx.fillText('再跑一圈吧', W / 2 + 5, H * 0.3);
    ctx.restore();
}

export function render(T) {
    T = clamp(T, 0, DURATION);
    S.T = T;
    S.boil = Math.floor(T * 8) % 3;
    const i = shotIndex(T);
    drawShot(ctx, i, T);
    const shot = SHOTS[i];
    if (i > 0 && shot.in && T - shot.t < shot.in) {
        drawShot(bctx, i - 1, T);
        S.T = T;
        ctx.globalAlpha = 1 - smooth((T - shot.t) / shot.in);
        ctx.drawImage(buffer, 0, 0);
        ctx.globalAlpha = 1;
    }
    // Paper and pigment over everything.
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.6;
    ctx.drawImage(textures.grain, 0, 0);
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.34;
    ctx.drawImage(textures.brushes[S.boil], 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    const v = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.48, canvas.width * 0.3, canvas.width / 2, canvas.height / 2, canvas.width * 0.72);
    v.addColorStop(0, 'rgba(60, 35, 45, 0)');
    v.addColorStop(1, 'rgba(60, 35, 45, .32)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    title(T);
    lyric(T);
    closing(T);
    // Fade in from dark at the start; at the end a hard cut to black while the music rings out.
    const fade = T >= CUT ? 1 : 1 - smooth(range(T, 0, 1.8));
    if (fade > 0) {
        ctx.globalAlpha = fade;
        ctx.fillStyle = '#1c1420';
        ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
}

await fontsReady;
if (capture) {
    root.classList.add('mv-capture');
    setResolution(1920);
    window.mvCapture = {
        duration: DURATION,
        frame(T, lyrics = true) {
            showLyrics = lyrics;
            render(T);
            return true;
        },
    };
} else {
    startPlayer();
}

function startPlayer() {
    const audio = document.getElementById('song');
    const bigPlay = document.getElementById('big-play');
    const toggle = document.getElementById('toggle');
    const seek = document.getElementById('seek');
    const time = document.getElementById('time');
    const subs = document.getElementById('subs');
    const full = document.getElementById('full');
    const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    const touch = matchMedia('(pointer: coarse)').matches;

    function fit() {
        const box = canvas.getBoundingClientRect();
        const want = box.width * Math.min(devicePixelRatio || 1, 2);
        setResolution(touch || want < 1400 ? 1280 : 1920);
        draw(true);
    }

    let playing = false, cursor = 7, lastAudio = -1, lastClock = 0, lastFrame = -1;
    function songTime() {
        if (!playing) return cursor;
        const a = audio.currentTime, now = performance.now();
        if (a !== lastAudio) { lastAudio = a; lastClock = now; }
        return Math.min(DURATION, a + Math.min(0.25, (now - lastClock) / 1000));
    }
    function draw(force = false) {
        const T = songTime();
        const frame = Math.floor(T * 24);
        if (force || frame !== lastFrame) {
            lastFrame = frame;
            render(T);
            seek.value = T;
            time.textContent = fmt(T);
        }
    }
    function loop() {
        draw();
        if (playing) requestAnimationFrame(loop);
    }

    async function play() {
        // The poster shows the title at 0:07; playing from it starts the song from the top.
        if (root.classList.contains('is-poster') || audio.ended || cursor >= DURATION - 0.1) cursor = 0;
        // The song is only fetched on the first play (preload="none"), so a seek made before that waits for its metadata.
        if (audio.readyState === 0) {
            const start = cursor;
            if (start > 0) audio.addEventListener('loadedmetadata', () => { audio.currentTime = start; }, { once: true });
        } else if (Math.abs(audio.currentTime - cursor) > 0.05) audio.currentTime = cursor;
        // The audio "play" event below switches the player into playing state.
        try { await audio.play(); } catch { /* blocked: stay on the poster */ }
    }
    function pause() {
        audio.pause();
        stopped();
    }
    // Also runs when the browser or the system pauses the song (a call, headphones unplugged, lock-screen controls).
    function stopped() {
        if (!playing) return;
        cursor = audio.currentTime;
        playing = false;
        root.classList.remove('is-playing', 'is-idle');
        toggle.setAttribute('aria-label', '播放');
        draw(true);
    }
    audio.addEventListener('pause', stopped);
    audio.addEventListener('play', () => {
        if (playing) return;
        playing = true;
        lastAudio = -1;
        root.classList.add('is-playing');
        root.classList.remove('is-poster');
        toggle.setAttribute('aria-label', '暂停');
        requestAnimationFrame(loop);
        idle();
    });
    const flip = () => (playing ? pause() : play());

    bigPlay.addEventListener('click', play);
    toggle.addEventListener('click', flip);
    canvas.addEventListener('click', () => { if (!root.classList.contains('is-poster')) flip(); });
    audio.addEventListener('ended', () => {
        playing = false;
        cursor = DURATION;
        root.classList.remove('is-playing', 'is-idle');
        root.classList.add('is-poster');
        toggle.setAttribute('aria-label', '播放');
        draw(true);
    });
    seek.addEventListener('input', () => {
        cursor = +seek.value;
        root.classList.remove('is-poster');
        if (playing) { audio.currentTime = cursor; lastAudio = -1; }
        draw(true);
    });
    subs.addEventListener('click', () => {
        showLyrics = !showLyrics;
        subs.setAttribute('aria-pressed', String(showLyrics));
        draw(true);
    });

    // Full screen: the real thing where the browser allows it; on iPhone the page around the frame takes over instead.
    const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
    function setImmersive(on) {
        root.classList.toggle('is-immersive', on);
        full.setAttribute('aria-label', on ? '退出全屏' : '全屏');
        parent.postMessage({ type: 'grow-up-slowly:immersive', on }, '*');
        requestAnimationFrame(fit);
    }
    full.addEventListener('click', async () => {
        if (fsElement()) return (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        if (root.classList.contains('is-immersive')) return setImmersive(false);
        const request = root.requestFullscreen || root.webkitRequestFullscreen;
        if (request) {
            try { await request.call(root); return; } catch { /* fall through */ }
        }
        setImmersive(true);
    });
    const onFs = () => { root.classList.toggle('is-fullscreen', !!fsElement()); full.setAttribute('aria-label', fsElement() ? '退出全屏' : '全屏'); requestAnimationFrame(fit); };
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);

    addEventListener('keydown', (e) => {
        // Let focused controls keep their own keys: Space presses a button, arrows move the seek bar.
        if (e.key === ' ' && e.target.closest('button')) return;
        if (e.target.closest('input') && e.key !== ' ') return;
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); root.classList.contains('is-poster') && !playing ? play() : flip(); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            cursor = clamp(songTime() + (e.key === 'ArrowRight' ? 5 : -5), 0, DURATION);
            root.classList.remove('is-poster');
            if (playing) { audio.currentTime = cursor; lastAudio = -1; }
            draw(true);
        } else if (e.key === 'f') full.click();
        else if (e.key === 'c') subs.click();
        else if (e.key === 'Escape' && root.classList.contains('is-immersive')) setImmersive(false);
    });

    let idleTimer = 0;
    function idle() {
        root.classList.remove('is-idle');
        clearTimeout(idleTimer);
        if (playing) idleTimer = setTimeout(() => root.classList.add('is-idle'), 2600);
    }
    root.addEventListener('pointermove', idle);
    root.addEventListener('pointerdown', idle);

    addEventListener('resize', fit);
    fit();
    root.classList.add('is-ready');
}
