export type AudioPlaybackState = "idle" | "starting" | "playing" | "muted" | "blocked";

type SafariWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

export function createMobileAudioContext(): AudioContext | null {
  const AudioContextConstructor = window.AudioContext || (window as SafariWindow).webkitAudioContext;
  if (!AudioContextConstructor) return null;

  try {
    return new AudioContextConstructor();
  } catch {
    return null;
  }
}

function primeAudioOutput(context: AudioContext) {
  const buffer = context.createBuffer(1, 1, context.sampleRate);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

export async function unlockMobileAudio(context: AudioContext): Promise<boolean> {
  if (context.state === "closed") return false;

  try {
    // This must happen before the first await. Mobile Safari and many WKWebViews
    // only unlock Web Audio while the original click is still active.
    primeAudioOutput(context);
    if (context.state !== "running") await context.resume();
    return context.state === "running";
  } catch {
    return false;
  }
}

export function saveAudioPreference(storageKey: string, muted: boolean) {
  try {
    localStorage.setItem(storageKey, String(muted));
  } catch {
    // Audio remains usable when storage is unavailable.
  }
}
