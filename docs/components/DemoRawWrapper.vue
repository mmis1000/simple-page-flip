<template>
  <div class="wrap-out">
    <div
      class="wrap"
      :style="{ '--page-width': `${width}px`, '--page-height': `${height}px` }"
    >
      <slot></slot>
      <SliderH
        :class="[
          'slider-top',
          showTop && 'slider-top-most',
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
        v-if="showTop"
        :class="['slider-top', onRight && 'horizontal-slider-on-right']"
        name="top offset"
        v-model="top"
        :max-value="width"
        :extension="10"
        direction="bottom"
      />
      <SliderV
        v-if="!onRight"
        :class="['slider-left', showLeft && 'slider-left-most']"
        name="height"
        readonly
        :modelValue="height"
        :max-value="height"
        :extension="30"
      />
      <SliderV
        v-if="!onRight && showLeft"
        class="slider-left"
        name="left offset"
        v-model="left"
        :max-value="height"
        :extension="10"
      />
      <SliderH
        v-if="showBottom"
        :class="['slider-bottom', onRight && 'horizontal-slider-on-right']"
        name="bottom offset"
        v-model="bottom"
        :max-value="width"
        :extension="10"
        direction="top"
      />
      <SliderV
        v-if="onRight"
        :class="['slider-right', showRight && 'slider-right-most']"
        name="height"
        readonly
        :modelValue="height"
        :max-value="height"
        :extension="30"
        direction="left"
      />
      <SliderV
        v-if="onRight && showRight"
        class="slider-right"
        name="right offset"
        v-model="right"
        :max-value="height"
        :extension="10"
        direction="left"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import SliderV from "./SliderV.vue";
import SliderH from "./SliderH.vue";

defineProps({
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 160,
  },
  edges: {
    type: Array as PropType<("top" | "left" | "right" | "bottom")[]>,
    default: [],
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

const top = defineModel("top", { default: 60 });
const right = defineModel("right", { default: 60 });
const left = defineModel("left", { default: 80 });
const bottom = defineModel("bottom", { default: 60 });
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

.slider-top {
  position: absolute;
  left: var(--padding);
  top: calc(var(--padding) - var(--bar-distance) - var(--bar-width));
  width: var(--page-width);
  height: var(--bar-width);
}

.slider-top-most {
  top: calc(var(--padding) - var(--bar-distance) - var(--bar-width) * 2);
}

.slider-bottom {
  position: absolute;
  left: var(--padding);
  top: calc(var(--padding) + var(--page-height) + var(--bar-distance));
  width: var(--page-width);
  height: var(--bar-width);
}

.horizontal-slider-on-right {
  left: calc(var(--padding) + var(--page-width));
}
</style>
