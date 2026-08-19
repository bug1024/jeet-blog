<template>
  <div class="secret-world" :class="`state-${state}`">
    <div class="secret-grain" aria-hidden="true"></div>

    <Transition name="secret-fade" mode="out-in">
      <section v-if="state === 'entrance'" key="entrance" class="secret-entrance" aria-labelledby="secret-title">
        <header><span>未公开记录</span><span>仅凭链接进入</span></header>
        <div class="entrance-signal" aria-hidden="true">
          <i></i><span></span><i></i>
        </div>
        <p>两个信号已建立连接</p>
        <h1 id="secret-title">我们的秘密世界</h1>
        <p class="entrance-copy">靠近，停下，再找到合适的距离。</p>
        <button type="button" class="secret-button" @click="enter">
          <span aria-hidden="true">●</span> 读取记录
        </button>
        <button type="button" class="entrance-sound" :aria-label="soundLabel" @click="toggle">
          {{ muted ? "声音关闭" : "声音开启" }}
        </button>
      </section>

      <main v-else key="world" class="secret-interface">
        <header class="secret-toolbar">
          <button type="button" @click="goMap">返回轨迹</button>
          <p><i></i> 两个信号保持连接</p>
          <button type="button" :aria-label="soundLabel" @click="toggle">{{ muted ? "×" : "♪" }}</button>
        </header>

        <Transition name="secret-shift" mode="out-in">
          <section v-if="state === 'map'" key="map" class="secret-map" aria-labelledby="map-title">
            <div class="map-heading">
              <div><span>八段未公开记录</span><h2 id="map-title">距离的变化</h2></div>
              <p>{{ visited.size }} / {{ chapters.length }} 已读取</p>
            </div>
            <div class="distance-chart">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M7 20 C22 27 28 41 40 45 S59 62 69 66 S84 72 93 78" />
              </svg>
              <button
                v-for="(chapter, index) in chapters"
                :key="chapter.id"
                type="button"
                class="secret-node"
                :class="{ visited: visited.has(chapter.id) }"
                :style="{ '--node-x': `${7 + index * 12.25}%`, '--node-y': `${20 + index * 8.25}%` }"
                :aria-label="`${chapter.index} ${chapter.title}`"
                @click="open(index)"
              >
                <span><i></i><i></i></span>
                <strong>{{ chapter.label }}</strong>
                <small>{{ chapter.index }}</small>
              </button>
              <div class="chart-note"><span>远</span><i></i><span>近</span></div>
            </div>
            <p class="map-instruction">选择一个节点，读取当时留下的距离</p>
          </section>

          <section v-else-if="state === 'chapter'" :key="active.id" class="secret-chapter">
            <div class="chapter-visual">
              <header><span>{{ active.index }}</span><span>{{ active.label }}</span></header>
              <SecretScene :scene="active.scene" :title="active.title" />
              <div class="distance-meter">
                <span>远</span><div><i :style="{ width: `${100 - active.distance}%` }"></i></div><span>近</span>
              </div>
              <small>仍然保留一格距离</small>
            </div>
            <article>
              <span>记录 {{ active.index }} / {{ chapters.length.toString().padStart(2, "0") }}</span>
              <h2>{{ active.title }}</h2>
              <div><p v-for="paragraph in active.paragraphs" :key="paragraph">{{ paragraph }}</p></div>
              <nav aria-label="记录切换">
                <button type="button" :disabled="activeIndex === 0" @click="previous">上一段</button>
                <button type="button" @click="goMap">查看轨迹</button>
                <button type="button" @click="next">{{ activeIndex === chapters.length - 1 ? "读完" : "下一段" }}</button>
              </nav>
            </article>
          </section>

          <section v-else key="ending" class="secret-ending" aria-labelledby="ending-title">
            <div class="ending-points" aria-hidden="true"><i></i><span></span><i></i></div>
            <p>距离记录 / 已保存</p>
            <h2 id="ending-title">有些关系不需要答案</h2>
            <p>谢谢你曾经在人海里看见我，也谢谢我们都没有让这份理解失去边界。</p>
            <strong>七夕快乐</strong>
            <div><button type="button" class="secret-button" @click="goMap">再次查看</button><a href="/">离开这里</a></div>
          </section>
        </Transition>
      </main>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import SecretScene from "./components/SecretScene.vue";
import { chapters } from "./data";
import { useSecretMusic } from "./useSecretMusic";

type State = "entrance" | "map" | "chapter" | "ending";
const state = ref<State>("entrance");
const activeIndex = ref(0);
const visited = reactive(new Set<string>());
const active = computed(() => chapters[activeIndex.value]);
const { muted, start, toggle } = useSecretMusic();
const soundLabel = computed(() => muted.value ? "开启背景音乐" : "关闭背景音乐");

function enter() { void start(); state.value = "map"; }
function goMap() { state.value = "map"; }
function open(index: number) { activeIndex.value = index; visited.add(chapters[index].id); state.value = "chapter"; }
function previous() { if (activeIndex.value > 0) open(activeIndex.value - 1); }
function next() { if (activeIndex.value < chapters.length - 1) open(activeIndex.value + 1); else state.value = "ending"; }
function onKey(event: KeyboardEvent) {
  if (event.key === "Escape" && state.value !== "entrance") goMap();
  if (state.value !== "chapter") return;
  if (event.key === "ArrowLeft") previous();
  if (event.key === "ArrowRight") next();
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>
