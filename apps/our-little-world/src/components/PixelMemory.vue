<template>
  <svg class="pixel-memory" viewBox="0 0 160 70" role="img" :aria-label="label" shape-rendering="crispEdges">
    <g v-if="scene === 'meeting'">
      <rect class="pm-ground" x="15" y="57" width="130" height="3" />
      <path class="pm-blue" d="M28 31h10v-6h28v6h10v4H28z" />
      <rect class="pm-one" x="43" y="35" width="12" height="18" />
      <path class="pm-rose" d="M84 29h10v-6h28v6h10v4H84z" />
      <rect class="pm-two" x="99" y="33" width="12" height="20" />
      <rect class="pm-warm" x="76" y="17" width="5" height="5" />
    </g>

    <g v-else-if="scene === 'cat-arrival'">
      <path class="pm-box" d="M47 34h66v25H47zM40 28h33l7 6H47zM120 28H87l-7 6h33z" />
      <path class="pm-cat" d="M64 21h8v7h16v-7h8v25H64z" />
      <rect class="pm-warm" x="70" y="32" width="4" height="4" />
      <rect class="pm-warm" x="87" y="32" width="4" height="4" />
      <rect class="pm-ink" x="78" y="39" width="5" height="3" />
    </g>

    <g v-else-if="scene === 'cat-life'">
      <rect class="pm-ground" x="18" y="56" width="124" height="3" />
      <path class="pm-cat" d="M26 35h29v18H26zM29 28h8v8h11v-8h7v8" />
      <path class="pm-blue" d="M77 45h28l-5 11H82z" />
      <rect class="pm-warm" x="112" y="31" width="8" height="8" />
      <rect class="pm-line" x="119" y="36" width="18" height="3" />
    </g>

    <g v-else-if="scene === 'marriage'">
      <rect class="pm-paper" x="43" y="13" width="74" height="47" />
      <rect class="pm-blue" x="43" y="13" width="74" height="9" />
      <rect class="pm-line" x="53" y="29" width="18" height="3" />
      <rect class="pm-line" x="89" y="29" width="18" height="3" />
      <rect class="pm-rose" x="73" y="36" width="7" height="7" />
      <rect class="pm-rose" x="80" y="43" width="7" height="7" />
      <rect class="pm-rose" x="87" y="36" width="7" height="7" />
    </g>

    <g v-else-if="scene === 'wedding'">
      <path class="pm-house" d="M33 34h10v-8h10v-7h54v7h10v8h10v5H33z" />
      <rect class="pm-wall" x="43" y="39" width="74" height="21" />
      <rect class="pm-warm" x="56" y="46" width="12" height="9" />
      <rect class="pm-warm" x="92" y="46" width="12" height="9" />
      <rect class="pm-door" x="75" y="46" width="11" height="14" />
    </g>

    <g v-else-if="scene === 'birth'">
      <rect class="pm-ground" x="29" y="57" width="102" height="3" />
      <path class="pm-blue" d="M50 38h62v17H50zM54 32h8v8h42v-8h8v8" />
      <rect class="pm-rose" x="71" y="39" width="20" height="12" />
      <rect class="pm-warm" x="76" y="19" width="8" height="8" />
      <rect class="pm-warm" x="78" y="16" width="4" height="14" />
      <rect class="pm-warm" x="73" y="21" width="14" height="4" />
    </g>

    <g v-else-if="scene === 'growing'">
      <rect class="pm-line" x="35" y="14" width="3" height="45" />
      <rect class="pm-line" x="38" y="20" width="10" height="2" />
      <rect class="pm-line" x="38" y="30" width="7" height="2" />
      <rect class="pm-line" x="38" y="40" width="10" height="2" />
      <g class="pm-two"><rect x="68" y="25" width="14" height="14" /><rect x="64" y="40" width="22" height="18" /></g>
      <rect class="pm-warm" x="104" y="43" width="14" height="14" />
      <rect class="pm-blue" x="118" y="49" width="10" height="8" />
    </g>

    <g v-else>
      <path class="pm-route" d="M24 51L55 28L83 44L131 19" />
      <rect class="pm-warm" x="20" y="47" width="8" height="8" />
      <rect class="pm-blue" x="51" y="24" width="8" height="8" />
      <rect class="pm-rose" x="79" y="40" width="8" height="8" />
      <rect class="pm-warm" x="127" y="15" width="8" height="8" />
      <path class="pm-case" d="M66 49h28v14H66zM72 44h16v5H72z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { MemorySceneType } from "../types";

defineProps<{ scene: MemorySceneType; label: string }>();
</script>
