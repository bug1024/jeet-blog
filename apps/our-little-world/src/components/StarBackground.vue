<template>
  <canvas ref="canvas" class="world-stars" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
}

const canvas = ref<HTMLCanvasElement | null>(null);
let context: CanvasRenderingContext2D | null = null;
let stars: Star[] = [];
let animationFrame = 0;
let resizeObserver: ResizeObserver | undefined;
let width = 0;
let height = 0;
let reducedMotion = false;

function createStars() {
  const count = Math.min(150, Math.max(55, Math.round((width * height) / 10500)));
  stars = Array.from({ length: count }, (_, index) => ({
    x: ((index * 83.17) % 100) / 100 * width,
    y: ((index * 47.63 + 13) % 100) / 100 * height,
    size: index % 19 === 0 ? 2 : index % 5 === 0 ? 1.5 : 1,
    alpha: 0.25 + ((index * 17) % 60) / 100,
    speed: 0.5 + (index % 7) * 0.12,
    phase: index * 0.63
  }));
}

function resize() {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.value.width = Math.round(width * dpr);
  canvas.value.height = Math.round(height * dpr);
  context = canvas.value.getContext("2d");
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);
  createStars();
  draw(0);
}

function draw(time: number) {
  if (!context) return;
  context.clearRect(0, 0, width, height);

  for (const star of stars) {
    const flicker = reducedMotion ? 1 : 0.72 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.28;
    context.fillStyle = `rgba(237, 229, 203, ${star.alpha * flicker})`;
    context.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
  }

  if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
}

onMounted(() => {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  resizeObserver = new ResizeObserver(resize);
  if (canvas.value) resizeObserver.observe(canvas.value);
  if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  cancelAnimationFrame(animationFrame);
});
</script>
