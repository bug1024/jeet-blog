// Player for the 我们的小小世界 MV: every frame is drawn from song time, so picture, lyrics and music cannot drift apart.
// ?capture exposes window.mvCapture for rendering the video file frame by frame (scripts/render-our-little-world-mv.cjs).
import { W, H, view, resetT, clamp, range, E } from './core.js';
import { C, TYPE, DURATION, FPS, AUDIO_OFFSET, sectionAt } from './design.js';
import { makeTextures, finish, paperBase, piece, rectPts, torn } from './paper.js';
import { loadFonts, parseLRC, lyrics, logo } from './type.js';
import { drawScene, setLyrics, endCard, outro } from './scenes.js';

const params = new URLSearchParams(location.search);
const capture = params.has('capture');
const root = document.getElementById('mv');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
let showLyrics = true;

const [, lrc] = await Promise.all([loadFonts(), fetch('lyrics.lrc').then((r) => r.text())]);
const LYRICS = parseLRC(lrc);
setLyrics(LYRICS);
makeTextures(W, H);

// Canvas width in pixels: 1920 draws the stage 1:1, 1280 at two thirds.
function setResolution(w) {
    if (canvas.width === w && view.s === w / W) return false;
    canvas.width = w;
    canvas.height = Math.round((w * H) / W);
    view.s = w / W;
    return true;
}

export function frame(T) {
    T = clamp(T, 0, DURATION);
    resetT(ctx);
    drawScene(ctx, T);
    resetT(ctx);
    const end = endCard(T);
    if (showLyrics) {
        // The outro lyrics sit on small torn paper slips so they never fight the landscape.
        if (sectionAt(T).name === 'outro') {
            const line = LYRICS.find((l) => T >= l.t - 0.05 && T < l.end + TYPE.exit && l.section.name === 'outro');
            if (line && end.fade < 1) {
                const k = E.slide(range(T, line.t - 0.1, line.t + 0.4)) * (1 - E.settle(range(T, line.end, line.end + TYPE.exit)));
                piece(ctx, torn(rectPts(960 - 330, 900, 660, 86), Math.floor(line.t * 10), 2.5), C.paperLight, { alpha: k, fringe: 0, lift: 0.5 });
            }
        }
        lyrics(ctx, T, LYRICS);
    }
    if (end.fade > 0) {
        ctx.globalAlpha = end.fade;
        paperBase(ctx);
        ctx.globalAlpha = 1;
        logo(ctx, 960, 576, end.title, 1, C.ink);
    }
    finish(ctx, Math.round(T * FPS), canvas.width, canvas.height);
}

// Cover and poster: the outro's house at dusk, the family under the eave and the road home, with the title.
// shift moves the picture sideways (in widths), so the poster's play button lands on open field, not on the house.
function keyPicture(x, w, h, shift = 0) {
    const s = Math.min(w, h) / H, wide = w / h >= 1.2;
    x.save();
    x.translate(w / 2 + w * shift, h / 2 + h * 0.06);
    x.scale(s * (wide ? 0.9 : 0.82), s * (wide ? 0.9 : 0.82));
    x.translate(-W / 2, -H / 2);
    outro(x, 193.2);
    x.restore();
    x.save();
    x.translate(w / 2, h * 0.17);
    x.scale(s * (wide ? 1.05 : 0.86), s * (wide ? 1.05 : 0.86));
    logo(x, 0, 26, 1, 1, C.ink);
    x.restore();
    finish(x, 0, w, h);
}
function cover(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    keyPicture(c.getContext('2d'), w, h);
    return c.toDataURL('image/png');
}
function poster() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    keyPicture(ctx, canvas.width, canvas.height, 0.16);
}

if (capture) {
    root.classList.add('mv-capture');
    setResolution(1920);
    window.mvCapture = {
        duration: DURATION, fps: FPS, audioOffset: AUDIO_OFFSET, cover,
        frame(T, withLyrics = true) { showLyrics = withLyrics; frame(T); return true; },
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
        const want = canvas.getBoundingClientRect().width * Math.min(devicePixelRatio || 1, 2);
        setResolution(touch || want < 1400 ? 1280 : 1920);
        draw(true);
    }

    // Film time = audio time + AUDIO_OFFSET (the song file starts a touch earlier than the timing it was cut to).
    let playing = false, cursor = 0, lastAudio = -1, lastClock = 0, lastFrame = -1;
    function songTime() {
        if (!playing) return cursor;
        const a = audio.currentTime, now = performance.now();
        if (a !== lastAudio) { lastAudio = a; lastClock = now; }
        return Math.min(DURATION, a + AUDIO_OFFSET + Math.min(0.25, (now - lastClock) / 1000));
    }
    const toAudio = (T) => Math.max(0, T - AUDIO_OFFSET);
    function draw(force = false) {
        const T = songTime();
        const f = Math.floor(T * FPS);
        if (force || f !== lastFrame) {
            lastFrame = f;
            if (root.classList.contains('is-poster')) poster(); else frame(T);
            seek.value = T;
            time.textContent = fmt(T);
        }
    }
    function loop() {
        draw();
        if (playing) requestAnimationFrame(loop);
    }

    async function play() {
        // Playing from the poster starts the song from the top.
        if (root.classList.contains('is-poster') || audio.ended || cursor >= DURATION - 0.1) cursor = 0;
        // The song is only fetched on the first play (preload="none"), so a seek made before that waits for its metadata.
        if (audio.readyState === 0) {
            const start = toAudio(cursor);
            if (start > 0) audio.addEventListener('loadedmetadata', () => { audio.currentTime = start; }, { once: true });
        } else if (Math.abs(audio.currentTime - toAudio(cursor)) > 0.05) audio.currentTime = toAudio(cursor);
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

    // Full screen: the real thing where the browser allows it; on iPhone the page around the frame takes over instead.
    const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
    function setImmersive(on) {
        root.classList.toggle('is-immersive', on);
        full.setAttribute('aria-label', on ? '退出全屏' : '全屏');
        parent.postMessage({ type: 'our-little-world-mv:immersive', on }, '*');
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
    root.classList.add('is-ready');
}
