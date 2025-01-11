<template>
  <div class="wrap-out">
    <div
      class="wrap"
      :style="{ '--page-width': `${width}px`, '--page-height': `${height}px` }"
    >
      <DemoBook
        :width="width"
        :height="height"
        :effect="effect"
      />
      <SliderH
        :class="['slider-top-most']"
        name="width"
        readonly
        :modelValue="width"
        :max-value="width"
        :extension="30"
        direction="bottom"
      />
      <SliderH
        :class="['slider-top']"
        :style="{ '--start': top }"
        name="shadow"
        v-model="shadow"
        :max-value="width - top"
        :extension="10"
        direction="bottom"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { EffectStyle, getEffectLeft } from "../../src/lib";
import DemoBook from "./DemoBook.vue";
import SliderH from "./SliderH.vue";

const props = defineProps({
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 160,
  },
  top: {
    type: Number,
    default: 60
  },
  bottom: {
    type: Number,
    default: 60
  },
  initialShadow: {
    type: Number,
    default: 30
  }
});

const shadow = ref(props.initialShadow);

const effect = computed(() =>
  getEffectLeft(
    props.width,
    props.height,
    props.top,
    props.bottom,
    shadow.value
  )
);
</script>
<style lang="css" scoped>
.wrap {
  --bar-width: 20px;
  --bar-distance: 10px;

  --page-height: 160px;
  --page-width: 120px;

  --padding: calc(var(--bar-width) * 2 + var(--bar-distance) * 2);

  width: calc(var(--page-width) * 2);
  height: var(--page-height);
  padding: var(--padding);
  box-sizing: content-box;
  border: 1px solid black;
  /* background: repeating-linear-gradient(100deg, #faddab 0%, #faddab 1.5%, #e7b870 2%, #e7b870 2.5%, #faddab 3%); */
  background: white;
  position: relative;

  margin: 16px 0;
}

@media (max-width: 420px) {
  .wrap-out {
    margin: 0 -24px;
    display: flex;
    justify-content: center;
  }

  .wrap {
    flex-shrink: 0;
  }
}

.slider-top {
  --start: 0;
  position: absolute;
  left: calc(var(--padding) + 1px * var(--start));
  top: calc(var(--padding) - var(--bar-distance) - var(--bar-width));
  width: calc(var(--page-width) - 1px * var(--start));
  height: var(--bar-width);
}

.slider-top-most {
  position: absolute;
  left: var(--padding);
  top: calc(var(--padding) - var(--bar-distance) - var(--bar-width) * 2);
  width: var(--page-width);
  height: var(--bar-width);
}
</style>
