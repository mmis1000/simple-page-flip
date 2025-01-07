<template>
  <Demo
    :onRight="onRight"
    :showTop="showTop"
    :showLeft="showLeft"
    :showRight="showRight"
    :showBottom="showBottom"
    v-model:top="top"
    v-model:left="left"
    v-model:bottom="bottom"
    v-model:right="right"
  >
    <div :class="{ right: onRight }">
      <div class="wrap" :style="{ '--WIDTH': width, '--HEIGHT': height }">
        <div class="item-layer layer-under">
          <div class="item-wrap">
            <div class="item">
              <div class="text-placeholder"></div>
            </div>
          </div>
        </div>
        <div class="item-layer layer-flip-front">
          <div class="item-wrap" :style="effect.flipFront as any">
            <div class="item">
              The<br />
              &nbsp&nbspBook Title
            </div>
          </div>
        </div>
        <div class="item-layer layer-shadow">
          <div class="item-wrap" :style="effect.flipShadow as any">
            <div class="item"></div>
          </div>
        </div>
        <div class="item-layer layer-flip-back">
          <div class="item-wrap" :style="effect.flipBack as any">
            <div class="item">
              <div class="text-placeholder"></div>
            </div>
          </div>
        </div>
        <div class="item-layer layer-effect">
          <div class="item-wrap" :style="effect.flipEffect as any">
            <div class="item"></div>
          </div>
        </div>
      </div>
    </div>
  </Demo>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import Demo from "./Demo.vue";
import { EffectStyle } from "../../src/lib";

const props = defineProps({
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 160,
  },
  effect: {
    type: Function as PropType<
      (
        width: number,
        height: number,
        shadow: number,
        left: number,
        top: number,
        right: number,
        bottom: number
      ) => EffectStyle
    >,
    required: true,
  },
  onRight: {
    type: Boolean,
    default: false,
  },
  showTop: {
    type: Boolean,
    default: false,
  },
  showLeft: {
    type: Boolean,
    default: false,
  },
  showRight: {
    type: Boolean,
    default: false,
  },
  showBottom: {
    type: Boolean,
    default: false,
  },
});

const shadow = 10;
const top = ref(60);
const left = ref(75);
const bottom = ref(90);
const right = ref(105);
const effect = computed(() =>
  props.effect(
    props.width,
    props.height,
    shadow,
    left.value,
    top.value,
    right.value,
    bottom.value
  )
);
</script>
<style scoped>
.wrap {
  --HEIGHT: 400;
  --WIDTH: 300;

  aspect-ratio: calc(1 / var(--HEIGHT) * var(--WIDTH) * 2);

  container-type: size;
  --scale-px: calc(100cqw / var(--WIDTH) * 0.5);

  position: relative;
}

.item-layer {
  position: absolute;
  height: calc(var(--scale-px, 1px) * var(--HEIGHT));
  width: calc(var(--scale-px, 1px) * var(--WIDTH));
  left: 0;
  top: 0;
  pointer-events: none;
}

.right .item-layer {
  transform: translateX(100%);
}

.item-wrap {
  height: calc(var(--scale-px, 1px) * var(--HEIGHT));
  width: calc(var(--scale-px, 1px) * var(--WIDTH));
  pointer-events: all;
  transform-origin: 0 0;
}

.item {
  height: calc(var(--scale-px, 1px) * var(--HEIGHT));
  width: calc(var(--scale-px, 1px) * var(--WIDTH));
  background: #4f4fbb;
  color: white;
  box-sizing: border-box;
  padding: calc(100% / var(--HEIGHT) * 32);
}

.layer-flip-back .item,
.layer-under .item {
  background: #e7e7e7;
  color: #333;
  border: 1px solid black;
}

.layer-flip-back .item {
  transform: scaleX(-1);
}

.layer-shadow .item {
  background: transparent !important;
}

/* .layer-shadow {
  filter: blur(2px);
} */

.layer-effect .item {
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.5),
    rgba(255, 255, 255, 0.3) 30%,
    rgba(0, 0, 0, 0)
  );
}

.layer-flip-front .item {
  font-size: calc(var(--scale-px, 1px) * 32);
  line-height: 1.5;
}

.layer-under .item,
.layer-flip-back .item {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.text-placeholder {
  flex: 1 1 auto;
  background: repeating-linear-gradient(
    180deg,
    transparent,
    transparent 3.5%,
    #ccc 3.5%,
    #ccc 6.5%,
    transparent 6.5%,
    transparent 10%
  );
}
</style>
