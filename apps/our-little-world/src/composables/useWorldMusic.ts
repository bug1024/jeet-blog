import { onBeforeUnmount, ref } from "vue";

const STORAGE_KEY = "our-little-world:muted";
const phraseLength = 12.8;
const melody = [
  { beat: 0, note: 587.33, length: 1.15 },
  { beat: 1.6, note: 440, length: 0.75 },
  { beat: 2.6, note: 369.99, length: 1.1 },
  { beat: 4.2, note: 440, length: 0.7 },
  { beat: 5.2, note: 493.88, length: 1.15 },
  { beat: 7.1, note: 440, length: 0.7 },
  { beat: 8.1, note: 329.63, length: 1.05 },
  { beat: 10.2, note: 369.99, length: 1.45 }
];

export function useWorldMusic() {
  const muted = ref(false);
  const playing = ref(false);
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: number | null = null;

  try {
    muted.value = localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // Storage is optional.
  }

  function playTone(start: number, frequency: number, duration: number, volume: number) {
    if (!context || !master) return;
    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const gain = context.createGain();
    const overtoneGain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    overtone.type = "sine";
    overtone.frequency.value = frequency * 2;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    overtoneGain.gain.value = 0.09;

    oscillator.connect(gain);
    overtone.connect(overtoneGain).connect(gain);
    gain.connect(master);
    oscillator.start(start);
    overtone.start(start);
    oscillator.stop(start + duration + 0.05);
    overtone.stop(start + duration + 0.05);
  }

  function schedulePhrase(start: number) {
    melody.forEach(({ beat, note, length }) => playTone(start + beat, note, length, 0.18));
    [146.83, 220, 293.66].forEach((note, index) => {
      playTone(start + index * 0.04, note, phraseLength - 0.7, 0.025);
    });
  }

  async function start() {
    if (muted.value) return;
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0.28;
      master.connect(context.destination);
    }
    await context.resume();
    if (playing.value) return;
    playing.value = true;
    schedulePhrase(context.currentTime + 0.08);
    timer = window.setInterval(() => {
      if (context?.state === "running") schedulePhrase(context.currentTime + 0.08);
    }, phraseLength * 1000);
  }

  function stop() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    playing.value = false;
    void context?.close();
    context = null;
    master = null;
  }

  async function toggle() {
    muted.value = !muted.value;
    try {
      localStorage.setItem(STORAGE_KEY, String(muted.value));
    } catch {
      // Storage is optional.
    }
    if (muted.value) stop();
    else await start();
  }

  onBeforeUnmount(() => {
    stop();
  });

  return { muted, playing, start, toggle };
}
