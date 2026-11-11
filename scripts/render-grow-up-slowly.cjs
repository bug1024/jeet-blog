// Renders the 慢一点长大 MV to a 1920 × 1080, 24 fps MP4 with the original song.
// Needs a static server for static/ (python3 -m http.server 8765 -d static), Playwright and ffmpeg.
// Usage: PW=$(npm root -g)/playwright node scripts/render-grow-up-slowly.cjs <song.wav> <out.mp4> [--no-lyrics] [--4k]
const { chromium } = require(process.env.PW || 'playwright');
const { spawn } = require('child_process');

const [song, out] = process.argv.slice(2);
const lyrics = !process.argv.includes('--no-lyrics');
const width = process.argv.includes('--4k') ? 3840 : 1920;
const FPS = 24;

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', (e) => console.error(e.message));
    await page.goto(`http://localhost:8765/works/grow-up-slowly/app/?capture&width=${width}`);
    await page.waitForFunction(() => window.mvCapture);
    const duration = await page.evaluate(() => window.mvCapture.duration);
    const frames = Math.ceil(duration * FPS);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', song,
        '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', width > 1920 ? '17' : '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k',
        '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < frames; i++) {
        const data = await page.evaluate(([T, l]) => { window.mvCapture.frame(T, l); return document.getElementById('screen').toDataURL('image/jpeg', 0.95); }, [i / FPS, lyrics]);
        if (!ff.stdin.write(Buffer.from(data.split(',')[1], 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
        if (i % 240 === 0) console.log(`${i}/${frames}`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    await browser.close();
    console.log('done', out);
})();
