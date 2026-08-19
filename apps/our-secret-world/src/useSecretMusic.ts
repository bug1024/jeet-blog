import { onBeforeUnmount, ref } from "vue";

const storageKey = "our-secret-world:muted";
const phraseLength = 14.4;
const notes = [
  [0, 329.63, 1.8], [1.8, 392, 1.2], [3.6, 440, 2.1], [6.2, 392, 1.4],
  [8.2, 293.66, 1.8], [10.3, 329.63, 1.2], [12, 261.63, 2.1]
] as const;

export function useSecretMusic() {
  const muted = ref(false);
  let context: AudioContext | null = null;
  let output: GainNode | null = null;
  let timer: number | null = null;

  try { muted.value = localStorage.getItem(storageKey) === "true"; } catch { /* optional */ }

  function tone(start: number, frequency: number, duration: number, gainValue: number, pan: number) {
    if (!context || !output) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const panner = context.createStereoPanner();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    panner.pan.value = pan;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(panner).connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function schedule(start: number) {
    notes.forEach(([offset, frequency, duration], index) => {
      tone(start + offset, frequency, duration, 0.15, index % 2 === 0 ? -0.32 : 0.32);
    });
    tone(start, 130.81, phraseLength - 0.5, 0.028, -0.18);
    tone(start + 0.06, 196, phraseLength - 0.5, 0.022, 0.18);
  }

  async function start() {
    if (muted.value) return;
    if (!context) {
      context = new AudioContext();
      output = context.createGain();
      output.gain.value = 0.24;
      output.connect(context.destination);
    }
    await context.resume();
    if (timer !== null) return;
    schedule(context.currentTime + 0.1);
    timer = window.setInterval(() => context && schedule(context.currentTime + 0.1), phraseLength * 1000);
  }

  function stop() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    void context?.close();
    context = null;
    output = null;
  }

  async function toggle() {
    muted.value = !muted.value;
    try { localStorage.setItem(storageKey, String(muted.value)); } catch { /* optional */ }
    if (muted.value) stop(); else await start();
  }

  onBeforeUnmount(stop);
  return { muted, start, toggle };
}
