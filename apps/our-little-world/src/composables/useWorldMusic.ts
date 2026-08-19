import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  createMobileAudioContext,
  saveAudioPreference,
  unlockMobileAudio,
  type AudioPlaybackState
} from "../../../shared/src/mobileAudio";

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
  const status = ref<AudioPlaybackState>("idle");
  const playing = computed(() => status.value === "playing");
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: number | null = null;

  try {
    muted.value = localStorage.getItem(STORAGE_KEY) === "true";
    if (muted.value) status.value = "muted";
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
      master = context.createGain();
      master.gain.value = 0.36;
      master.connect(context.destination);
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
    status.value = "playing";
    schedulePhrase(context.currentTime + 0.08);
    timer = window.setInterval(() => {
      if (context?.state === "running") schedulePhrase(context.currentTime + 0.08);
    }, phraseLength * 1000);
    return true;
  }

  function stop(nextStatus: AudioPlaybackState = "idle") {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    void context?.close();
    context = null;
    master = null;
    status.value = nextStatus;
  }

  async function toggle() {
    if (status.value === "playing" || status.value === "starting") {
      muted.value = true;
      saveAudioPreference(STORAGE_KEY, true);
      stop("muted");
      return;
    }
    muted.value = false;
    saveAudioPreference(STORAGE_KEY, false);
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

  return { muted, playing, status, start, toggle };
}
