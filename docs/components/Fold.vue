<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import { getEffectLeft } from "../../src/lib";

const size = ref({
  width: 100,
  height: 100,
});
const containerRef = ref<HTMLDivElement | null>(null);
const observer = shallowRef<ResizeObserver | null>(null);

const DELAY_TIME = 1500;
const FULL_DURATION = 400;
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

const effect = computed(() => {
  const width = size.value.width / 2;
  const height = size.value.height;
  const maxOffset = height * 0.05;
  const shadowOffset = height * 0.1;
  const computedEffect = getEffectLeft(
    width,
    height,
    width,
    width - maxOffset * progress.value,
    shadowOffset
  );
  return computedEffect;
});
</script>
<template>
  <div class="fold" ref="containerRef">
    <div class="space-holder">
      <slot></slot>
    </div>
    <div class="fold-half">
      <div class="item-holder">
        <slot></slot>
      </div>
    </div>
    <div class="fold-half" :style="effect.flipFront as any">
      <div class="mask"></div>
    </div>
    <div class="fold-half" :style="effect.flipShadow as any"></div>
    <div class="fold-half" :style="effect.flipBack as any">
      <div class="item-holder shifted">
        <slot></slot>
      </div>
    </div>
    <div class="fold-half" :style="effect.flipEffect as any"></div>
  </div>
</template>
<style scoped>
.fold {
  position: relative;
  white-space: nowrap;
}
.space-holder {
  visibility: hidden;
}
.fold-half {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 50%;
  overflow: hidden;
}
.mask {
  width: 100%;
  height: 100%;
  background: var(--vp-c-bg);
}
.item-holder {
  width: 200%;
  height: 100%;
  background: var(--vp-c-bg);
}
.item-holder.shifted {
  transform: translateX(-50%);
}
</style>
