<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getEffectLeft } from "../../src/lib";

const items = [
  "hsl(0, 50%, 50%)",
  "hsl(30, 50%, 50%)",
  "hsl(60, 50%, 50%)",
  "hsl(90, 50%, 50%)",
  "hsl(120, 50%, 50%)",
  "hsl(150, 50%, 50%)",
  "hsl(180, 50%, 50%)",
  "hsl(210, 50%, 50%)",
  "hsl(240, 50%, 50%)",
  "hsl(270, 50%, 50%)",
  "hsl(300, 50%, 50%)",
  "hsl(330, 50%, 50%)",
];

const DURATION = 4000;
// 0 ~ 1
const progress = ref(0);
const raf = ref<ReturnType<typeof requestAnimationFrame> | null>(null);

const tick = () => {
  progress.value = (Date.now() % DURATION) / DURATION;
  raf.value = requestAnimationFrame(tick);
};
onMounted(() => {
  raf.value = requestAnimationFrame(tick);
});

onUnmounted(() => {
  cancelAnimationFrame(raf.value!);
});
const effects = computed(() => {
  const startIndex = Math.floor((1 - progress.value) * items.length);
  const itemList = [...items.slice(startIndex), ...items.slice(0, startIndex)];
  const fixedProgress = progress.value % (1 / items.length);

  const TOP_MAX = 100;
  const BOTTOM_MAX = 90;
  const SHADOW_MAX = 20;

  return [
    {
      key: -1 + '-start',
      color: itemList[itemList.length - 1],
      effect: getEffectLeft(
        100,
        150,
        TOP_MAX * (0 + 0 / items.length),
        BOTTOM_MAX * (0 + 0 / items.length),
        SHADOW_MAX
      ),
    },
    ...itemList.map((item, index) => {
      const color = item;
      const effect = getEffectLeft(
        100,
        150,
        TOP_MAX * (fixedProgress + index / items.length),
        BOTTOM_MAX * (fixedProgress + index / items.length),
        SHADOW_MAX
      );

      return {
        key: index + '-item',
        color,
        effect,
      };
    }),
    {
      key: itemList.length + '-end',
      color: itemList[0],
      effect: getEffectLeft(
        100,
        150,
        TOP_MAX * (1 + 0 / items.length),
        BOTTOM_MAX * (1 + 0 / items.length),
        SHADOW_MAX
      ),
    },
  ];
});
</script>
<template>
  <div class="demo-flip-multiple">
    <template v-for="effect in effects" :key="effect.key">
      <div
        class="page"
        :style="{ ...effect.effect.flipFront, background: effect.color }"
        :data-key="effect.key + '-front'"
      ></div>
    </template>
    <template v-for="effect in effects.slice(0).reverse()" :key="effect.key">
      <div class="page" :style="effect.effect.flipShadow" :data-key="effect.key + '-shadow'"></div>
      <div
        class="page"
        :style="{ ...effect.effect.flipBack, background: effect.color }"
        :data-key="effect.key + '-back'"
      ></div>
      <div class="page" :style="effect.effect.flipEffect" :data-key="effect.key + '-effect'"></div>
    </template>
  </div>
</template>
<style lang="css" scoped>
.demo-flip-multiple {
  --page-width: 100px;
  --page-height: 150px;
  --page-padding: 60px;
  width: calc(var(--page-width) * 2 + var(--page-padding) * 2);
  height: calc(var(--page-height) + var(--page-padding) * 2);
  background: grey;
  position: relative;
  overflow: hidden;
}

.page {
  position: absolute;
  left: var(--page-padding);
  top: var(--page-padding);
  width: var(--page-width);
  height: var(--page-height);
  background: white;
}
</style>
