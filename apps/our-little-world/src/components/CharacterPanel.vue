<template>
  <aside class="character-panel" aria-labelledby="character-title">
    <header>
      <div>
        <span>同行成员 / 02</span>
        <h2 id="character-title">同行角色</h2>
      </div>
      <button type="button" aria-label="关闭角色卡" @click="$emit('close')">×</button>
    </header>

    <div class="character-grid">
      <article v-for="character in characters" :key="character.id">
        <div class="character-avatar">
          <PixelCharacter :scene="character.scene" :name="character.name" />
        </div>
        <p class="character-level">等级 {{ character.level }}</p>
        <h3>{{ character.name }}</h3>
        <p class="character-class">{{ character.className }}</p>
        <dl>
          <div v-for="attribute in character.attributes" :key="attribute.label">
            <dt>{{ attribute.label }}</dt>
            <dd><i :style="{ width: `${attribute.value}%` }"></i><span>{{ attribute.value }}</span></dd>
          </div>
        </dl>
        <p class="character-skill"><span>特别能力</span>{{ character.skill }}</p>
        <p class="character-description">{{ character.description }}</p>
      </article>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { CharacterProfile } from "../types";
import PixelCharacter from "./PixelCharacter.vue";

defineProps<{ characters: CharacterProfile[] }>();
defineEmits<{ close: [] }>();
</script>
