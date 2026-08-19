import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  createMobileAudioContext,
  saveAudioPreference,
  unlockMobileAudio,
  type AudioPlaybackState
} from "../../shared/src/mobileAudio";

const storageKey = "our-secret-world:muted";
const phraseLength = 14.4;
const notes = [
  [0, 329.63, 1.8], [1.8, 392, 1.2], [3.6, 440, 2.1], [6.2, 392, 1.4],
  [8.2, 293.66, 1.8], [10.3, 329.63, 1.2], [12, 261.63, 2.1]
] as const;

export function useSecretMusic() {
  const muted = ref(false);
  const status = ref<AudioPlaybackState>("idle");
  let context: AudioContext | null = null;
  let output: GainNode | null = null;
  let timer: number | null = null;

  try {
    muted.value = localStorage.getItem(storageKey) === "true";
    if (muted.value) status.value = "muted";
  } catch { /* optional */ }

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

  async function start(): Promise<boolean> {
    if (muted.value) {
      status.value = "muted";
      return false;
    }
    status.value = "starting";
    if (!context) {
      context = createMobileAudioContext();
      if (!context) {
        status.value = "blocked";
        return false;
      }
      output = context.createGain();
      output.gain.value = 0.34;
      output.connect(context.destination);
    }
    const unlocked = await unlockMobileAudio(context);
    if (!unlocked) {
      status.value = "blocked";
      return false;
    }
    if (timer !== null) {
      status.value = "playing";
      return true;
    }
    schedule(context.currentTime + 0.1);
    timer = window.setInterval(() => {
      if (context?.state === "running") schedule(context.currentTime + 0.1);
    }, phraseLength * 1000);
    status.value = "playing";
    return true;
  }

  function stop(nextStatus: AudioPlaybackState = "idle") {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    void context?.close();
    context = null;
    output = null;
    status.value = nextStatus;
  }

  async function toggle() {
    if (status.value === "playing" || status.value === "starting") {
      muted.value = true;
      saveAudioPreference(storageKey, true);
      stop("muted");
      return;
    }
    muted.value = false;
    saveAudioPreference(storageKey, false);
    await start();
  }

  async function resumeAfterVisibilityChange() {
    if (document.visibilityState !== "visible" || muted.value || !context || timer === null) return;
    const resumed = await unlockMobileAudio(context);
    status.value = resumed ? "playing" : "blocked";
  }

  onMounted(() => document.addEventListener("visibilitychange", resumeAfterVisibilityChange));
  onBeforeUnmount(() => {
    stop();
    document.removeEventListener("visibilitychange", resumeAfterVisibilityChange);
  });
  return { muted, status, start, toggle };
}
