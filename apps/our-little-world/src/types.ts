export type SceneType = "couple" | "cat" | "house" | "girl" | "travel" | "future";
export type MemorySceneType = "meeting" | "cat-arrival" | "cat-life" | "marriage" | "wedding" | "birth" | "growing" | "journey";

export interface MemorySlot {
  label: string;
  scene: MemorySceneType;
}

export interface Chapter {
  id: string;
  year: string;
  mapLabel: string;
  title: string;
  subtitle: string;
  scene: SceneType;
  paragraphs: string[];
  x: number;
  y: number;
  memorySlots?: MemorySlot[];
  destinations?: string[];
  futureList?: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  level: number;
  className: string;
  scene: "girl" | "cat";
  attributes: Array<{ label: string; value: number }>;
  skill: string;
  description: string;
}
