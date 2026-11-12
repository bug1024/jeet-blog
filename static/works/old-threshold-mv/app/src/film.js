// Frame renderer and player: song time in, finished frame out. Everything is drawn live from song time.
//   ?sheet            the character sheet
//   ?t=<s>            (project preview) start at this time; click / space to play
//   ?capture          expose window.mvCapture for tools/render.cjs and tools/still.cjs
// On the blog page (an <audio id="song"> is present) the full player runs instead of the preview.
import { W, H, clamp, resetT, view } from './core.js';
import { DURATION, FPS, AUDIO_OFFSET } from './design.js';
import { makeTextures, finish } from './gouache.js';
import { loadFonts, parseLRC, lyrics } from './type.js';
import { drawScene, lyricPlace, prefetch } from './scenes.js';
import { sheet, walkTest } from './sheet.js';
import { cover } from './cover.js';

const params = new URLSearchParams(location.search);
const capture = params.has('capture');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const root = document.getElementById('mv');

await loadFonts();
const LYRICS = parseLRC(await (await fetch(document.body.dataset.lrc || 'data/lyrics.lrc')).text(), 240.6);
makeTextures();

// Canvas width in pixels: 1920 draws the stage 1:1, 1280 at two thirds (phones, small windows).
function setResolution(w) {
    if (canvas.width === w && view.s === w / W) return false;
    canvas.width = w;
    canvas.height = Math.round((w * H) / W);
    view.s = w / W;
    return true;
}
setResolution(W);

let showLyrics = true;
export function frame(T) {
    T = clamp(T, 0, DURATION);
    resetT(ctx);
    ctx.globalAlpha = 1;
    drawScene(ctx, T);
    resetT(ctx);
    finish(ctx, W, H);
    if (showLyrics) lyrics(ctx, T, LYRICS, (l, t) => lyricPlace(l, t));
}

function drawSheet() {
    resetT(ctx);
    sheet(ctx);
    finish(ctx, W, H);
}

window.mvCapture = {
    duration: DURATION, fps: FPS, audioOffset: AUDIO_OFFSET,
    frame(T, withLyrics = true) { showLyrics = withLyrics; frame(T); return true; },
    sheet() { drawSheet(); return true; },
    walk(t) { resetT(ctx); walkTest(ctx, t); finish(ctx, W, H); return true; },
    cover,
    lyricsLayout() { return LYRICS.map((l) => ({ t: l.t, end: l.end, text: l.text, ...lyricPlace(l, l.t) })); },
};
document.documentElement.dataset.ready = '1';

if (params.has('sheet')) drawSheet();
else if (capture) { if (root) root.classList.add('mv-capture'); }
else if (document.getElementById('song')) startPlayer();
else startPreview();

// Project preview: the whole song decoded up front so any point can be played (the dev server has no byte ranges).
function startPreview() {
    const start = +(params.get('t') || 0);
    const ac = new AudioContext();
    let buffer = null, src = null, startedAt = 0, from = start, playing = false;
    fetch('data/master.wav').then((r) => r.arrayBuffer()).then((b) => ac.decodeAudioData(b)).then((b) => { buffer = b; });
    const now = () => (playing ? from + (ac.currentTime - startedAt) : from);
    const toggle = () => {
        if (!buffer) return;
        if (playing) { from = now(); src.stop(); playing = false; return; }
        ac.resume();
        src = ac.createBufferSource();
        src.buffer = buffer;
        src.connect(ac.destination);
        const fileT = from - AUDIO_OFFSET;
        startedAt = ac.currentTime + Math.max(0, -fileT);
        src.start(startedAt, Math.max(0, fileT));
        playing = true;
    };
    let last = -1;
    const draw = () => {
        const t = now();
        if (t !== last) { frame(t); last = t; }
        prefetch(t);
        requestAnimationFrame(draw);
    };
    canvas.addEventListener('click', toggle);
    addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); toggle(); } });
    draw();
}

// Blog player: media-element audio (so the iPhone silent switch does not mute it), a poster until the first play,
// seek bar, subtitles toggle, full screen (or the page taking over on iPhone).
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
        const want = canvas.getBoundingClientRect().width * Math.min(devicePixelRatio || 1, 2);
        if (setResolution(touch || want < 1400 ? 1280 : 1920)) draw(true);
    }

    let playing = false, cursor = 0, lastAudio = -1, lastClock = 0, lastFrame = -1;
    function songTime() {
        if (!playing) return cursor;
        const a = audio.currentTime, now = performance.now();
        if (a !== lastAudio) { lastAudio = a; lastClock = now; }
        return Math.min(DURATION, a + AUDIO_OFFSET + Math.min(0.25, (now - lastClock) / 1000));
    }
    const toAudio = (T) => Math.max(0, T - AUDIO_OFFSET);
    function draw(force = false) {
        if (root.classList.contains('is-poster')) return;
        const T = songTime();
        const f = Math.floor(T * FPS);
        if (force || f !== lastFrame) {
            lastFrame = f;
            frame(T);
            seek.value = T;
            time.textContent = fmt(T);
        }
    }
    function loop() {
        draw();
        // Paint the layers of the shots coming up while there is time to spare.
        prefetch(songTime());
        if (playing) requestAnimationFrame(loop);
    }

    async function play() {
        if (audio.ended || cursor >= DURATION - 0.1) cursor = 0;
        if (audio.readyState === 0) {
            const start = toAudio(cursor);
            if (start > 0) audio.addEventListener('loadedmetadata', () => { audio.currentTime = start; }, { once: true });
        } else if (Math.abs(audio.currentTime - toAudio(cursor)) > 0.05) audio.currentTime = toAudio(cursor);
        try { await audio.play(); } catch { /* blocked: stay where we are */ }
    }
    function pause() { audio.pause(); stopped(); }
    function stopped() {
        if (!playing) return;
        cursor = Math.min(DURATION, audio.currentTime + AUDIO_OFFSET);
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
        toggle.setAttribute('aria-label', '播放');
        draw(true);
    });
    seek.addEventListener('input', () => {
        cursor = +seek.value;
        root.classList.remove('is-poster');
        if (playing) { audio.currentTime = toAudio(cursor); lastAudio = -1; }
        draw(true);
    });
    subs.addEventListener('click', () => {
        showLyrics = !showLyrics;
        subs.setAttribute('aria-pressed', String(showLyrics));
        draw(true);
    });

    const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
    function setImmersive(on) {
        root.classList.toggle('is-immersive', on);
        full.setAttribute('aria-label', on ? '退出全屏' : '全屏');
        parent.postMessage({ type: 'old-threshold-mv:immersive', on }, '*');
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
    const onFs = () => { full.setAttribute('aria-label', fsElement() ? '退出全屏' : '全屏'); requestAnimationFrame(fit); };
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);

    addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.target.closest('button')) return;
        if (e.target.closest('input') && e.key !== ' ') return;
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); flip(); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            cursor = clamp(songTime() + (e.key === 'ArrowRight' ? 5 : -5), 0, DURATION);
            root.classList.remove('is-poster');
            if (playing) { audio.currentTime = toAudio(cursor); lastAudio = -1; }
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
    // While the poster is up, quietly paint the first shots so the start is smooth.
    const warm = () => { if (!playing && root.classList.contains('is-poster')) { prefetch(0); setTimeout(warm, 120); } };
    setTimeout(warm, 300);
    root.classList.add('is-ready');
}
