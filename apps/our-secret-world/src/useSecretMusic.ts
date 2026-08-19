import { useLoopingAudio } from "../../shared/src/mobileAudio";

export function useSecretMusic() {
  return useLoopingAudio({
    src: "/works/our-secret-world/music.wav?v=2",
    storageKey: "our-secret-world:muted",
    volume: 0.68
  });
}
