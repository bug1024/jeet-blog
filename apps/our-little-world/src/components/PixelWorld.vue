<template>
  <section class="world-map" aria-labelledby="world-map-title">
    <header class="world-map-head">
      <div>
        <span>家庭存档 / 01</span>
        <h1 id="world-map-title">我们的小世界</h1>
      </div>
      <p>{{ visited.size }} / {{ chapters.length }} 已读取</p>
    </header>

    <div class="map-board">
      <svg class="map-route-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M15 31 L32 17 L49 40 L67 20 L82 47 L61 75" />
      </svg>

      <div class="map-house-light" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
      </div>

      <button
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        class="map-node"
        :class="{ visited: visited.has(chapter.id), future: chapter.id === 'future' }"
        :style="{ '--map-x': `${chapter.x}%`, '--map-y': `${chapter.y}%` }"
        type="button"
        :aria-label="`${chapter.year} ${chapter.mapLabel}`"
        @click="$emit('select', index)"
      >
        <span class="map-node-beacon"><i></i></span>
        <strong>{{ chapter.mapLabel }}</strong>
        <small>{{ chapter.year }}</small>
      </button>

      <p class="map-hint">选择一个地点，读取这一段存档</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Chapter } from "../types";

defineProps<{ chapters: Chapter[]; visited: Set<string> }>();
defineEmits<{ select: [index: number] }>();
</script>
