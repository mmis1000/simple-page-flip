<template>
  <DemoRawWrapper
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
    <DemoBook
      :width="width"
      :height="height"
      :effect="effect"
      :onRight="onRight"
    />
  </DemoRawWrapper>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import DemoRawWrapper from "./DemoRawWrapper.vue";
import { EffectStyle } from "../../src/lib";
import DemoBook from "./DemoBook.vue";

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
