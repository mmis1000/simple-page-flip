<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import { getEffectLeft, getEffectRight } from "../../src/lib";

const size = ref({
  width: 100,
  height: 100,
});
const containerRef = ref<HTMLDivElement | null>(null);
const observer = shallowRef<ResizeObserver | null>(null);

const DELAY_TIME = 2500;
const FULL_DURATION = 2500;
const progress = ref(0);
const startTime = ref(0);
const raf = ref<number | null>(null);

const animate = (time: number) => {
  const newProgress = (time - startTime.value - DELAY_TIME) / FULL_DURATION;
  if (newProgress > 1) {
    progress.value = 1;
    raf.value = null;
    return;
  } else if (newProgress > 0) {
    progress.value = newProgress;
  } else {
    progress.value = 0;
  }
  raf.value = requestAnimationFrame(animate);
};

onMounted(() => {
  observer.value = new ResizeObserver((entries) => {
    const entry = entries[0];
    size.value.width = entry.contentRect.width;
    size.value.height = entry.contentRect.height;
  });
  observer.value.observe(containerRef.value!);
  startTime.value = performance.now();
  raf.value = requestAnimationFrame(animate);
});
onUnmounted(() => {
  observer.value?.disconnect();
});

const BREAK_POINT_1 = 0.2;
const BREAK_POINT_2 = 0.8;

const holeStyle = computed(() => {
  const holdProgress =
    progress.value < BREAK_POINT_1
      ? progress.value / BREAK_POINT_1
      : progress.value < BREAK_POINT_2
      ? 1
      : progress.value <= 1
      ? 1 - (progress.value - BREAK_POINT_2) / (1 - BREAK_POINT_2)
      : 0;
  return getEffectRight(
    size.value.height,
    size.value.height,
    (1 - holdProgress * 0.5) * size.value.height,
    size.value.height,
    size.value.height * 0.1
  );
});
const contentStyle = computed(() => {
  if (progress.value < BREAK_POINT_1) {
    return {
      transform: "translateX(100%)",
    };
  } else if (progress.value < BREAK_POINT_2) {
    return {
      transform: `translateX(${
        100 *
        (1 - (progress.value - BREAK_POINT_1) / (BREAK_POINT_2 - BREAK_POINT_1))
      }%)`,
    };
  } else {
    return {
      transform: "translateX(0%)",
    };
  }
});
</script>
<template>
  <div class="break-in" ref="containerRef">
    <div
      class="hole"
      :style="{
        width: size.height + 'px',
      }"
    >
      <div class="page back-most"></div>
      <div class="page" :style="holeStyle.flipFront as any"></div>
      <div class="page" :style="holeStyle.flipShadow as any"></div>
      <div class="page" :style="holeStyle.flipBack as any"></div>
      <div class="page" :style="holeStyle.flipEffect as any"></div>
    </div>
    <div class="content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
.break-in {
  overflow: hidden;
  position: relative;
}
.content {
  filter: drop-shadow(0px 0px 4px var(--vp-c-bg))
    drop-shadow(0px 0px 4px var(--vp-c-bg))
    drop-shadow(0px 0px 4px var(--vp-c-bg));
}
.hole {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
}
.page {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: var(--vp-c-bg);
}
.page.back-most {
  background-color: grey;
}

:global(.dark .page.back-most) {
  background-color: black;
}
</style>
