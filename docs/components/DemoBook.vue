<template>
  <div :class="{ right: onRight }">
    <div class="wrap" :style="{ '--WIDTH': width, '--HEIGHT': height }">
      <div class="item-layer layer-under">
        <div class="item">
          <div class="text-placeholder">Text Text</div>
        </div>
      </div>
      <div class="item-layer layer-flip-front">
        <div class="item" :style="asStyleValue(effect.flipFront)">
          The<br />
          &nbsp&nbspBook Title
        </div>
      </div>
      <div class="item-layer layer-shadow">
        <div class="item" :style="asStyleValue(effect.flipShadow)"></div>
      </div>
      <div class="item-layer layer-flip-back">
        <div class="item" :style="asStyleValue(effect.flipBack)">
          <div class="text-placeholder">Text Text</div>
        </div>
      </div>
      <div class="item-layer layer-effect">
        <div class="item" :style="asStyleValue(effect.flipEffect)"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, StyleValue } from "vue";
import { EffectStyle } from "../../src/lib";

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  effect: {
    type: Object as PropType<EffectStyle>,
    required: true,
  },
  onRight: {
    type: Boolean,
    required: true,
  },
});

const asStyleValue = (v: any): Partial<StyleValue> => v
</script>
<style lang="css" scoped>
.wrap {
  --HEIGHT: 400;
  --WIDTH: 300;

  aspect-ratio: calc(1 / var(--HEIGHT) * var(--WIDTH) * 2);

  container-type: size;
  --scale-px: 1px;

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

.item {
  height: calc(var(--scale-px, 1px) * var(--HEIGHT));
  width: calc(var(--scale-px, 1px) * var(--WIDTH));
  background: #4f4fbb;
  color: white;
  box-sizing: border-box;
  padding: calc(100% / var(--HEIGHT) * 32);
  pointer-events: all;
}

.layer-flip-back .item,
.layer-under .item {
  background: #e7e7e7;
  color: #333;
  border: 1px solid black;
}

.layer-flip-front .item {
  font-size: calc(var(--scale-px, 1px) * 24);
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
