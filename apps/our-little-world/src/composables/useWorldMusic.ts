import { useLoopingAudio } from "../../../shared/src/mobileAudio";

export function useWorldMusic() {
  return useLoopingAudio({
    src: "/works/our-little-world/music.mp3?v=1",
    storageKey: "our-little-world:muted",
    volume: 0.72
  });
}
