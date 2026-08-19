import { useLoopingAudio } from "../../../shared/src/mobileAudio";

export function useWorldMusic() {
  return useLoopingAudio({
    src: "/works/our-little-world/music.wav?v=2",
    storageKey: "our-little-world:muted",
    volume: 0.72
  });
}
