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
        :onRight="onRight"
      />
      <SliderH
        :class="[
          'slider-top',
          'slider-top-most',
          onRight && 'horizontal-slider-on-right',
        ]"
        name="width"
        readonly
        :modelValue="width"
        :max-value="width"
        :extension="30"
        direction="bottom"
      />
      <SliderH
        :class="['slider-top', onRight && 'horizontal-slider-on-right']"
        name="centerX"
        v-model="top"
        :max-value="width"
        :extension="10"
        direction="bottom"
      />
      <SliderV
        v-if="!onRight"
        :class="['slider-left', 'slider-left-most']"
        name="height"
        readonly
        :modelValue="height"
        :max-value="height"
        :extension="30"
      />
      <SliderV
        v-if="!onRight"
        class="slider-left"
        name="centerY"
        v-model="left"
        :max-value="height"
        :extension="10"
      />
      <SliderV
        v-if="onRight"
        :class="['slider-right', 'slider-right-most']"
        name="height"
        readonly
        :modelValue="height"
        :max-value="height"
        :extension="30"
        direction="left"
      />
      <SliderV
        v-if="onRight"
        class="slider-right"
        name="right offset"
        v-model="left"
        :max-value="height"
        :extension="10"
        direction="left"
      />
      <Cross
        :class="['center', onRight && 'right']"
        :style="{
          '--left': top,
          '--top': left,
        }"
      />
      <Angle
        :class="['center', onRight && 'right']"
        :style="{
          '--left': top,
          '--top': left,
        }"
        :base-angle="Math.PI"
        :min-angle="-Math.PI / 2"
        :max-angle="Math.PI / 2"
        v-model:angle="angle"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { createEffectLeft, createEffectRight } from "../../src/lib";
import DemoBook from "./DemoBook.vue";
import SliderH from "./SliderH.vue";
import SliderV from "./SliderV.vue";
import Cross from "./Cross.vue";
import Angle from "./Angle.vue";

const props = defineProps({
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 160,
  },
  onRight: {
    type: Boolean,
    default: false,
  },
  initialShadow: {
    type: Number,
    default: 30,
  },
  initialAngle: {
    type: Number,
    default: (Math.PI / 180) * 30,
  },
});

const left = ref(props.height / 2);
const top = ref(props.width / 2);
const angle = ref(props.initialAngle);
const effect = computed(() =>
  !props.onRight
    ? createEffectLeft(
        props.width,
        props.height,
        top.value,
        left.value,
        angle.value,
        10
      )
    : createEffectRight(
        props.width,
        props.height,
        top.value,
        left.value,
        angle.value,
        10
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

.slider-left {
  position: absolute;
  top: var(--padding);
  left: calc(var(--padding) - var(--bar-distance) - var(--bar-width));
  width: var(--bar-width);
  height: var(--page-height);
}

.slider-left-most {
  left: calc(var(--padding) - var(--bar-distance) - var(--bar-width) * 2);
}

.slider-right {
  position: absolute;
  top: var(--padding);
  left: calc(var(--padding) + var(--page-width) * 2 + var(--bar-distance));
  width: var(--bar-width);
  height: var(--page-height);
}

.slider-right-most {
  left: calc(
    var(--padding) + var(--page-width) * 2 + var(--bar-distance) +
      var(--bar-width)
  );
}
.horizontal-slider-on-right {
  left: calc(var(--padding) + var(--page-width));
}

.center {
  --left: 0;
  --top: 0;
  --baseLeft: var(--padding);
  --baseTop: var(--padding);
  position: absolute;
  left: calc(var(--baseLeft) + 1px * var(--left));
  top: calc(var(--baseTop) + 1px * var(--top));
}

.center.right {
  --baseLeft: calc(var(--padding) + var(--page-width));
}
</style>
