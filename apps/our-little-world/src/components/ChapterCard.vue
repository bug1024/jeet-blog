<template>
  <article class="chapter-card" :aria-labelledby="`chapter-${chapter.id}`">
    <div class="chapter-scene">
      <p><span>记忆</span><span>{{ chapter.year }}</span></p>
      <PixelCharacter :scene="chapter.scene" :name="chapter.title" />
      <small>{{ chapter.subtitle }}</small>
    </div>

    <div class="chapter-copy">
      <header>
        <span>{{ String(index + 1).padStart(2, "0") }} / {{ String(total).padStart(2, "0") }}</span>
        <p>{{ chapter.year }}</p>
      </header>
      <h2 :id="`chapter-${chapter.id}`">{{ chapter.title }}</h2>
      <div class="chapter-paragraphs">
        <p v-for="paragraph in chapter.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>

      <ul v-if="chapter.destinations" class="destination-list" aria-label="去过的地方">
        <li v-for="place in chapter.destinations" :key="place">{{ place }}</li>
      </ul>

      <ul v-if="chapter.futureList" class="future-list" aria-label="未来清单">
        <li v-for="item in chapter.futureList" :key="item"><i aria-hidden="true"></i>{{ item }}</li>
      </ul>

      <div v-if="chapter.memorySlots" class="memory-slots">
        <figure v-for="slot in chapter.memorySlots" :key="slot.label">
          <PixelMemory :scene="slot.scene" :label="slot.label" />
          <figcaption>{{ slot.label }}</figcaption>
        </figure>
      </div>

      <button v-if="chapter.id === 'future'" class="text-command" type="button" @click="$emit('letter')">
        读取 2040 留言 <span aria-hidden="true">→</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Chapter } from "../types";
import PixelCharacter from "./PixelCharacter.vue";
import PixelMemory from "./PixelMemory.vue";

defineProps<{ chapter: Chapter; index: number; total: number }>();
defineEmits<{ letter: [] }>();
</script>
