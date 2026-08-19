import { onBeforeUnmount, onMounted, ref } from "vue";

export type AudioPlaybackState = "idle" | "starting" | "playing" | "muted" | "blocked";

interface LoopingAudioOptions {
  src: string;
  storageKey: string;
  volume: number;
}

export function useLoopingAudio({ src, storageKey, volume }: LoopingAudioOptions) {
  const muted = ref(false);
  const status = ref<AudioPlaybackState>("idle");
  let audio: HTMLAudioElement | null = null;
  let wantsPlayback = false;

  try {
    muted.value = localStorage.getItem(storageKey) === "true";
    if (muted.value) status.value = "muted";
  } catch {
    // Audio remains usable when storage is unavailable.
  }

  function savePreference() {
    try {
      localStorage.setItem(storageKey, String(muted.value));
    } catch {
      // Audio remains usable when storage is unavailable.
    }
  }

  function getAudio() {
    if (audio) return audio;
    audio = document.createElement("audio");
    audio.src = src;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = volume;
    audio.setAttribute("playsinline", "");
    audio.setAttribute("webkit-playsinline", "");
    audio.hidden = true;
    document.body.append(audio);
    return audio;
  }

  async function start(): Promise<boolean> {
    if (muted.value) {
      status.value = "muted";
      return false;
    }

    wantsPlayback = true;
    status.value = "starting";
    const player = getAudio();

    try {
      // Keep play() in the original click call stack. This is the most reliable
      // path in mobile Safari and embedded WKWebViews such as WeChat.
      const playPromise = player.play();
      if (playPromise) await playPromise;
      status.value = "playing";
      return true;
    } catch {
      status.value = "blocked";
      return false;
    }
  }

  function stop(nextStatus: AudioPlaybackState = "idle") {
    wantsPlayback = false;
    audio?.pause();
    status.value = nextStatus;
  }

  async function toggle() {
    if (status.value === "playing" || status.value === "starting") {
      muted.value = true;
      savePreference();
      stop("muted");
      return;
    }

    muted.value = false;
    savePreference();
    await start();
  }

  async function resumeAfterVisibilityChange() {
    if (document.visibilityState !== "visible" || muted.value || !wantsPlayback || !audio) return;
    try {
      const playPromise = audio.play();
      if (playPromise) await playPromise;
      status.value = "playing";
    } catch {
      status.value = "blocked";
    }
  }

  onMounted(() => document.addEventListener("visibilitychange", resumeAfterVisibilityChange));
  onBeforeUnmount(() => {
    stop();
    document.removeEventListener("visibilitychange", resumeAfterVisibilityChange);
    audio?.remove();
    audio = null;
  });

  return { muted, status, start, toggle };
}
