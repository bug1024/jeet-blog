import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sampleRate = 44100;

function synthesize(duration, render) {
  const frames = Math.ceil(duration * sampleRate);
  const left = new Float64Array(frames);
  const right = new Float64Array(frames);

  function tone(start, frequency, length, amplitude, pan = 0, overtone = 0) {
    const first = Math.floor(start * sampleRate);
    const last = Math.min(frames, Math.ceil((start + length) * sampleRate));
    for (let frame = first; frame < last; frame += 1) {
      const elapsed = frame / sampleRate - start;
      const attack = Math.min(1, elapsed / 0.12);
      const release = Math.min(1, (length - elapsed) / 0.42);
      const envelope = Math.max(0, attack * release);
      const fundamental = Math.sin(2 * Math.PI * frequency * elapsed);
      const harmonic = overtone * Math.sin(4 * Math.PI * frequency * elapsed);
      const value = (fundamental + harmonic) * amplitude * envelope;
      left[frame] += value * Math.sqrt((1 - pan) / 2);
      right[frame] += value * Math.sqrt((1 + pan) / 2);
    }
  }

  render(tone);
  let peak = 0.001;
  for (let frame = 0; frame < frames; frame += 1) {
    peak = Math.max(peak, Math.abs(left[frame]), Math.abs(right[frame]));
  }
  const scale = Math.min(1, 0.88 / peak);
  const dataSize = frames * 4;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(2, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 4, 28);
  wav.writeUInt16LE(4, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);
  for (let frame = 0; frame < frames; frame += 1) {
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[frame] * scale)) * 32767), 44 + frame * 4);
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[frame] * scale)) * 32767), 46 + frame * 4);
  }
  return wav;
}

const works = [
  {
    output: "static/works/our-little-world/music.mp3",
    duration: 12.8,
    render(tone) {
      const melody = [
        [0, 587.33, 1.15], [1.6, 440, 0.75], [2.6, 369.99, 1.1], [4.2, 440, 0.7],
        [5.2, 493.88, 1.15], [7.1, 440, 0.7], [8.1, 329.63, 1.05], [10.2, 369.99, 1.45]
      ];
      melody.forEach(([start, frequency, length]) => tone(start, frequency, length, 0.19, 0, 0.2));
      [146.83, 220, 293.66].forEach((frequency, index) => tone(index * 0.04, frequency, 12.1, 0.032, 0, 0.08));
    }
  },
  {
    output: "static/works/our-secret-world/music.mp3",
    duration: 14.4,
    render(tone) {
      const melody = [
        [0, 329.63, 1.8], [1.8, 392, 1.2], [3.6, 440, 2.1], [6.2, 392, 1.4],
        [8.2, 293.66, 1.8], [10.3, 329.63, 1.2], [12, 261.63, 2.1]
      ];
      melody.forEach(([start, frequency, length], index) => tone(start, frequency, length, 0.17, index % 2 === 0 ? -0.3 : 0.3));
      tone(0, 130.81, 13.9, 0.035, -0.16);
      tone(0.06, 196, 13.84, 0.03, 0.16);
    }
  }
];

const temporaryDirectory = mkdtempSync(join(tmpdir(), "bug1024-audio-"));
try {
  works.forEach((work, index) => {
    const wavPath = join(temporaryDirectory, `${index}.wav`);
    writeFileSync(wavPath, synthesize(work.duration, work.render));
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wavPath, "-codec:a", "libmp3lame", "-b:a", "96k", work.output]);
  });
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
