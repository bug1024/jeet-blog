// Renders the 我们的小小世界 MV (or part of it) to a 1920 × 1080, 30 fps MP4 with the original song, or draws the covers.
// Needs a static server for static/ (python3 -m http.server 8765 -d static), Playwright and ffmpeg.
// Usage: PW=$(npm root -g)/playwright node scripts/render-our-little-world-mv.cjs <song.wav> <out.mp4> [options]
//   --from <s> --to <s>   only this stretch (the audio is cut to match)
//   --no-lyrics           without subtitles
//   --master              also write <out> 母版.mov: x264 crf 12 + the original PCM audio, for archiving
//   --cover               write <out-dir>/cover 4x3.png and cover 1x1.png instead of a video
// Frames go to ffmpeg as PNG (lossless), so x264 is the only lossy step. Audio uses Apple's AAC encoder (macOS) for a
// true 320 kbps; elsewhere set MV_AAC=aac.
const { chromium } = require(process.env.PW || 'playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const [song, out] = args;
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const has = (name) => args.includes(`--${name}`);

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', (e) => console.error(e.message));
    await page.goto('http://localhost:8765/works/our-little-world-mv/app/?capture');
    await page.waitForFunction(() => window.mvCapture);
    const { duration, fps, offset } = await page.evaluate(() => ({ duration: window.mvCapture.duration, fps: window.mvCapture.fps, offset: window.mvCapture.audioOffset }));

    if (has('cover')) {
        for (const [name, w, h] of [['4x3', 2400, 1800], ['1x1', 2048, 2048]]) {
            const file = path.join(path.dirname(out), `cover ${name}.png`);
            const url = await page.evaluate(([w, h]) => window.mvCapture.cover(w, h), [w, h]);
            fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
            console.log(file);
        }
        return browser.close();
    }

    const from = +opt('from', 0), to = Math.min(+opt('to', duration), duration);
    const lyrics = !has('no-lyrics');
    // The song plays AUDIO_OFFSET late (film time = file time + offset): cut it earlier, or pad silence at the very start.
    const aStart = from - offset;
    const aIn = aStart >= 0 ? ['-ss', aStart.toFixed(4)] : [];
    const aFilter = ['-af', `${aStart < 0 ? `adelay=${Math.round(-aStart * 1000)}:all=1,` : ''}apad`, '-ac', '2'];
    const video = (crf) => ['-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-tune', 'animation', '-pix_fmt', 'yuv420p'];
    const outputs = ['-map', '0:v', '-map', '1:a', ...aFilter, ...video('16'), '-c:a', process.env.MV_AAC || 'aac_at', '-b:a', '320k', '-shortest', '-movflags', '+faststart', out];
    if (has('master')) outputs.push('-map', '0:v', '-map', '1:a', ...aFilter, ...video('12'), '-c:a', 'pcm_s16le', '-shortest', out.replace(/\.mp4$/, ' 母版.mov'));
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-', ...aIn, '-i', song, ...outputs], { stdio: ['pipe', 'inherit', 'inherit'] });
    const frames = Math.round((to - from) * fps), started = Date.now();
    for (let i = 0; i < frames; i++) {
        const data = await page.evaluate(([T, l]) => { window.mvCapture.frame(T, l); return document.getElementById('screen').toDataURL('image/png'); }, [from + i / fps, lyrics]);
        if (!ff.stdin.write(Buffer.from(data.split(',')[1], 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
        if (i % 300 === 0) console.log(`${i}/${frames}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    await browser.close();
    console.log('done', out);
})();
