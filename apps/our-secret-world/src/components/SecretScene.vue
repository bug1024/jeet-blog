<template>
  <svg class="secret-scene" viewBox="0 0 160 110" role="img" :aria-label="`${title}的像素画面`" shape-rendering="crispEdges">
    <g v-if="scene === 'crowd'">
      <g class="muted-people">
        <rect v-for="x in [16, 42, 68, 94, 120, 140]" :key="x" :x="x" y="42" width="8" height="8" />
        <rect v-for="x in [13, 39, 65, 91, 117, 137]" :key="`b${x}`" :x="x" y="52" width="14" height="25" />
      </g>
      <rect class="point-a" x="52" y="46" width="8" height="8" />
      <rect class="point-b" x="106" y="46" width="8" height="8" />
      <rect class="ground" x="9" y="80" width="142" height="3" />
    </g>
    <g v-else-if="scene === 'dog'">
      <path class="dog" d="M60 49h38v24H60zM63 40h10v11h16V40h9v11h9v8h-9" />
      <rect class="point-a" x="70" y="57" width="5" height="5" />
      <rect class="point-b" x="88" y="57" width="5" height="5" />
      <rect class="ground" x="28" y="77" width="104" height="3" />
    </g>
    <g v-else-if="scene === 'cactus'">
      <path class="cactus" d="M70 25h20v60H70zM53 43h17v15H60v13H48V48h5zM90 50h18V36h11v31h-11V57H90z" />
      <rect class="pot" x="61" y="85" width="38" height="12" />
      <rect class="point-a" x="43" y="35" width="7" height="7" />
      <rect class="point-b" x="119" y="28" width="7" height="7" />
    </g>
    <g v-else-if="scene === 'park'">
      <path class="tree" d="M24 28h26v24H24zM17 39h40v19H17z" />
      <rect class="trunk" x="33" y="58" width="8" height="24" />
      <path class="bench" d="M73 59h54v6H73zM78 49h44v8H78zM80 65h6v14h-6zM115 65h6v14h-6z" />
      <rect class="point-a" x="84" y="41" width="7" height="7" />
      <rect class="point-b" x="106" y="41" width="7" height="7" />
      <rect class="ground" x="12" y="82" width="136" height="3" />
    </g>
    <g v-else-if="scene === 'track'">
      <path class="track" d="M27 31h106a31 31 0 010 62H27a31 31 0 010-62zm0 12a19 19 0 000 38h106a19 19 0 000-38z" />
      <rect class="point-a" x="47" y="36" width="7" height="7" />
      <rect class="point-b" x="105" y="81" width="7" height="7" />
    </g>
    <g v-else-if="scene === 'mountain'">
      <path class="mountain-back" d="M7 89L48 34l23 30 19-25 63 50z" />
      <path class="mountain-front" d="M13 91l45-39 22 23 17-13 50 29z" />
      <path class="path" d="M42 88l28-18 18 5 22-21" />
      <rect class="point-a" x="68" y="66" width="7" height="7" />
      <rect class="point-b" x="106" y="49" width="7" height="7" />
    </g>
    <g v-else-if="scene === 'hotel'">
      <rect class="wall" x="27" y="14" width="106" height="83" />
      <rect class="door" x="57" y="28" width="46" height="69" />
      <rect class="door-line" x="62" y="34" width="36" height="58" />
      <rect class="point-a" x="49" y="57" width="7" height="7" />
      <rect class="point-b" x="108" y="57" width="7" height="7" />
      <rect class="handle" x="88" y="61" width="5" height="5" />
    </g>
    <g v-else>
      <rect class="balance-line" x="25" y="58" width="110" height="3" />
      <rect class="balance-mark" x="78" y="49" width="4" height="21" />
      <rect class="point-a" x="62" y="47" width="9" height="9" />
      <rect class="point-b" x="89" y="47" width="9" height="9" />
      <rect class="shadow-a" x="60" y="71" width="13" height="3" />
      <rect class="shadow-b" x="87" y="71" width="13" height="3" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { Scene } from "../data";

defineProps<{ scene: Scene; title: string }>();
</script>
