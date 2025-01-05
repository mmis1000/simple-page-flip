<template>
  <div class="wrap" :style="{ '--page-width': `${width}px`, '--page-height': `${height}px` }">
    <SliderH class="slider-top" name="top offset" v-model="top" :max-value="width" :extension="10" direction="bottom" />
    <SliderV class="slider-left" name="left offset" v-model="left" :max-value="height" :extension="10" />
    <SliderH class="slider-bottom" name="bottom offset" v-model="bottom" :max-value="width" :extension="10" direction="top" />
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import SliderV from './SliderV.vue';
import SliderH from './SliderH.vue';
const props = defineProps({
  width: {
    type: Number,
    default: 150,
  },
  height: {
    type: Number,
    default: 200,
  },
  edges: {
    type: Array as PropType<("top" | "left" | "right" | "bottom")[]>,
    default: []
  },
})

const top = defineModel('top', { default: 60 })
const left = defineModel('left', { default: 80 })
const bottom = defineModel('bottom', { default: 60 })

</script>
<style lang="css" scoped>
.wrap {
  --bar-width: 20px;
  --bar-distance: 10px;

  --page-height: 200px;
  --page-width: 150px;
  --padding: calc((var(--page-height) + var(--page-width)) / 4);
  width: calc(var(--page-width) * 2);
  height: var(--page-height);
  padding: var(--padding);
  box-sizing: content-box;
  border: 1px solid black;
  /* background: repeating-linear-gradient(100deg, #faddab 0%, #faddab 1.5%, #e7b870 2%, #e7b870 2.5%, #faddab 3%); */
  background: white;
  position: relative;
}

.slider-left {
  position: absolute;
  top: var(--padding);
  left: calc(var(--padding) - var(--bar-distance) - var(--bar-width));
  width: var(--bar-width);
  height: var(--page-height);
}

.slider-top {
  position: absolute;
  left: var(--padding);
  top: calc(var(--padding) - var(--bar-distance) - var(--bar-width));
  width: var(--page-width);
  height: var(--bar-width);
}

.slider-bottom {
  position: absolute;
  left: var(--padding);
  top: calc(var(--padding) + var(--page-height) + var(--bar-distance));
  width: var(--page-width);
  height: var(--bar-width);
}
</style>