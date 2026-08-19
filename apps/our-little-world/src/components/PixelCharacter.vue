<template>
  <svg class="pixel-scene" viewBox="0 0 96 72" role="img" :aria-label="label" shape-rendering="crispEdges">
    <template v-if="scene === 'couple'">
      <rect class="ground" x="13" y="59" width="70" height="3" />
      <g class="person-one">
        <rect x="25" y="26" width="12" height="12" />
        <rect x="22" y="39" width="18" height="15" />
        <rect x="22" y="54" width="6" height="8" />
        <rect x="34" y="54" width="6" height="8" />
      </g>
      <g class="person-two">
        <rect x="59" y="25" width="12" height="13" />
        <rect x="56" y="39" width="18" height="15" />
        <rect x="56" y="54" width="6" height="8" />
        <rect x="68" y="54" width="6" height="8" />
      </g>
      <rect class="pixel-star" x="45" y="16" width="5" height="5" />
    </template>

    <template v-else-if="scene === 'cat'">
      <g class="cat-body">
        <rect x="31" y="28" width="34" height="26" />
        <rect x="34" y="21" width="9" height="11" />
        <rect x="54" y="21" width="9" height="11" />
        <rect x="25" y="47" width="10" height="6" />
        <rect x="22" y="42" width="6" height="8" />
      </g>
      <rect class="pixel-warm" x="39" y="36" width="5" height="5" />
      <rect class="pixel-warm" x="53" y="36" width="5" height="5" />
      <rect class="pixel-ink" x="46" y="43" width="5" height="4" />
      <rect class="ground" x="18" y="57" width="62" height="3" />
    </template>

    <template v-else-if="scene === 'house'">
      <path class="house-roof" d="M18 34h8v-7h8v-7h28v7h8v7h8v6H18z" />
      <rect class="house-wall" x="25" y="40" width="46" height="24" />
      <rect class="pixel-warm window-glow" x="34" y="47" width="10" height="9" />
      <rect class="pixel-warm window-glow" x="52" y="47" width="10" height="9" />
      <rect class="pixel-door" x="44" y="51" width="9" height="13" />
      <rect class="ground" x="13" y="64" width="70" height="3" />
    </template>

    <template v-else-if="scene === 'girl'">
      <rect class="pixel-star" x="19" y="18" width="4" height="4" />
      <rect class="pixel-star" x="73" y="24" width="3" height="3" />
      <g class="person-two">
        <rect x="42" y="20" width="13" height="13" />
        <rect x="39" y="34" width="19" height="18" />
        <rect x="41" y="52" width="6" height="10" />
        <rect x="51" y="52" width="6" height="10" />
      </g>
      <rect class="pixel-warm" x="45" y="24" width="3" height="3" />
      <rect class="pixel-warm" x="51" y="24" width="3" height="3" />
      <rect class="ground" x="25" y="62" width="48" height="3" />
    </template>

    <template v-else-if="scene === 'travel'">
      <path class="map-land" d="M16 22h24v7h17v-5h23v35H57v-6H40v6H16z" />
      <path class="map-route" d="M25 49L40 37L53 46L70 31" />
      <rect class="pixel-warm" x="22" y="46" width="6" height="6" />
      <rect class="pixel-warm" x="37" y="34" width="6" height="6" />
      <rect class="pixel-warm" x="50" y="43" width="6" height="6" />
      <rect class="pixel-warm" x="67" y="28" width="6" height="6" />
    </template>

    <template v-else>
      <rect class="future-line" x="14" y="52" width="68" height="3" />
      <rect class="pixel-warm" x="17" y="45" width="8" height="7" />
      <rect class="future-sun" x="69" y="34" width="13" height="13" />
      <text class="future-mark" x="44" y="31">?</text>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SceneType } from "../types";

const props = defineProps<{ scene: SceneType; name?: string }>();
const sceneNames: Record<SceneType, string> = {
  couple: "两个人",
  cat: "丫丫",
  house: "家",
  girl: "女孩",
  travel: "旅行",
  future: "未来"
};
const label = computed(() => props.name ? `${props.name}的像素画面` : `${sceneNames[props.scene]}的像素画面`);
</script>
