<template>
  <div class="little-world" :class="`screen-${screen}`" @keydown.esc="handleEscape">
    <StarBackground />
    <div class="world-vignette" aria-hidden="true"></div>

    <Transition name="world-fade" mode="out-in">
      <section v-if="screen === 'boot'" key="boot" class="boot-screen" aria-labelledby="world-title">
        <div class="boot-save">
          <span>家庭存档 01</span>
          <span>2018—2026</span>
        </div>
        <button class="sound-toggle boot-sound" type="button" :aria-label="soundLabel" @click="toggleMusic">
          <span aria-hidden="true">{{ muted ? "×" : "♪" }}</span>{{ muted ? "声音关闭" : "声音开启" }}
        </button>

        <pre class="ascii-house" aria-hidden="true">          ·
       ▄▄▄▄▄
      ▀     ▀
     ▀       ▀
    █▄▄▄▄▄▄▄▄▄█
    █  ▣   ▣  █
    █    ▄    █
    █▄▄▄▄▄▄▄▄▄█</pre>
        <p class="boot-status"><i></i> 世界已载入</p>
        <h1 id="world-title">我们的小世界</h1>
        <p class="boot-names">W × W</p>
        <button class="pixel-button boot-enter" type="button" @click="enterWorld">
          <span aria-hidden="true">▶</span> 进入
        </button>
        <p class="boot-note">一份用代码完成的家庭礼物</p>
      </section>

      <div v-else key="world" class="world-interface">
        <header class="world-toolbar">
          <button type="button" class="toolbar-home" @click="goMap">
            <span aria-hidden="true">⌂</span><span>世界地图</span>
          </button>
          <p><i></i> 我们的小世界 <small>/ 运行中</small></p>
          <div class="toolbar-actions">
            <button class="sound-toggle" type="button" :aria-label="soundLabel" @click="toggleMusic">
              <span aria-hidden="true">{{ muted ? "×" : "♪" }}</span>
            </button>
            <button type="button" class="toolbar-party" @click="showCharacters = true">
              同行角色 <span>02</span>
            </button>
          </div>
        </header>

        <Transition name="scene-shift" mode="out-in">
          <PixelWorld
            v-if="screen === 'map'"
            key="map"
            :chapters="chapters"
            :visited="visited"
            @select="openChapter"
          />

          <section v-else-if="screen === 'chapter' && activeChapter" key="chapter" class="chapter-screen">
            <ChapterCard
              :chapter="activeChapter"
              :index="activeIndex"
              :total="chapters.length"
              @letter="showLetter = true"
            />
            <nav class="chapter-nav" aria-label="章节切换">
              <button type="button" :disabled="activeIndex === 0" @click="previousChapter">
                <span aria-hidden="true">←</span> 上一段
              </button>
              <button type="button" @click="goMap">返回地图</button>
              <button type="button" @click="nextChapter">
                {{ activeIndex === chapters.length - 1 ? "完成探索" : "下一段" }} <span aria-hidden="true">→</span>
              </button>
            </nav>
          </section>

          <section v-else key="ending" class="ending-screen" aria-labelledby="ending-title">
            <div class="ending-house" aria-hidden="true">
              <PixelCharacter scene="house" />
            </div>
            <p>家庭存档 / 已完成</p>
            <h2 id="ending-title">谢谢你</h2>
            <p class="ending-copy">谢谢你一直和我一起生活，也一起照顾这个越来越热闹的小世界。</p>
            <strong>七夕快乐</strong>
            <div class="ending-actions">
              <button class="pixel-button" type="button" @click="goMap">再次查看地图</button>
              <a href="/works/">返回作品列表</a>
            </div>
          </section>
        </Transition>
      </div>
    </Transition>

    <Transition name="panel-slide">
      <div v-if="showCharacters" class="world-overlay" role="dialog" aria-modal="true" aria-label="同行角色">
        <button class="overlay-backdrop" type="button" aria-label="关闭角色卡" @click="showCharacters = false"></button>
        <CharacterPanel :characters="characters" @close="showCharacters = false" />
      </div>
    </Transition>

    <Transition name="panel-slide">
      <div v-if="showLetter" class="world-overlay letter-overlay" role="dialog" aria-modal="true" aria-labelledby="letter-title">
        <button class="overlay-backdrop" type="button" aria-label="关闭未来留言" @click="showLetter = false"></button>
        <article class="future-letter">
          <header>
            <span>{{ futureLetter.year }}</span>
            <button type="button" aria-label="关闭未来留言" @click="showLetter = false">×</button>
          </header>
          <p>私人留言</p>
          <h2 id="letter-title">{{ futureLetter.title }}</h2>
          <div>
            <p v-for="paragraph in futureLetter.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
          <small>这封信先保存在未来，到时候再回来看看。</small>
        </article>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import ChapterCard from "./components/ChapterCard.vue";
import CharacterPanel from "./components/CharacterPanel.vue";
import PixelCharacter from "./components/PixelCharacter.vue";
import PixelWorld from "./components/PixelWorld.vue";
import StarBackground from "./components/StarBackground.vue";
import { chapters } from "./data/chapters";
import { characters, futureLetter } from "./data/memories";
import { useWorldMusic } from "./composables/useWorldMusic";

type Screen = "boot" | "map" | "chapter" | "ending";

const screen = ref<Screen>("boot");
const activeIndex = ref(0);
const showCharacters = ref(false);
const showLetter = ref(false);
const visited = reactive(new Set<string>());
const activeChapter = computed(() => chapters[activeIndex.value]);
const { muted, start: startMusic, toggle: toggleMusic } = useWorldMusic();
const soundLabel = computed(() => (muted.value ? "开启背景音乐" : "关闭背景音乐"));

function saveProgress() {
  try {
    localStorage.setItem("our-little-world:visited", JSON.stringify([...visited]));
  } catch {
    // The work remains fully usable when storage is unavailable.
  }
}

function enterWorld() {
  void startMusic();
  screen.value = "map";
}

function goMap() {
  screen.value = "map";
  showLetter.value = false;
}

function openChapter(index: number) {
  activeIndex.value = index;
  visited.add(chapters[index].id);
  saveProgress();
  screen.value = "chapter";
}

function previousChapter() {
  if (activeIndex.value > 0) openChapter(activeIndex.value - 1);
}

function nextChapter() {
  if (activeIndex.value < chapters.length - 1) {
    openChapter(activeIndex.value + 1);
    return;
  }
  screen.value = "ending";
}

function handleEscape() {
  if (showLetter.value) {
    showLetter.value = false;
  } else if (showCharacters.value) {
    showCharacters.value = false;
  } else if (screen.value === "chapter" || screen.value === "ending") {
    goMap();
  }
}

function handleKeyboard(event: KeyboardEvent) {
  if (event.key === "Escape") handleEscape();
  if (screen.value !== "chapter" || showCharacters.value || showLetter.value) return;
  if (event.key === "ArrowLeft") previousChapter();
  if (event.key === "ArrowRight") nextChapter();
}

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem("our-little-world:visited") || "[]") as string[];
    stored.filter((id) => chapters.some((chapter) => chapter.id === id)).forEach((id) => visited.add(id));
  } catch {
    // Ignore stale or blocked local storage.
  }
  window.addEventListener("keydown", handleKeyboard);
});

onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyboard));
</script>
