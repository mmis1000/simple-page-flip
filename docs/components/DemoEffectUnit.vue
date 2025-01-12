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
        :unit="`${scale}px`"
      />
      <SliderH
        :class="['slider-top-most']"
        name="unit"
        unit="px"
        v-model="scale"
        :max-value="1"
        :extension="10"
        direction="bottom"
        :maxFractionDigit="2"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getEffectLeftBottom } from "../../src/lib";
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
  initialScale: {
    type: Number,
    default: 1,
  } 
});

const scale = ref(props.initialScale);

const effect = computed(() =>
  getEffectLeftBottom(
    props.width,
    props.height,
    props.height / 2,
    props.width / 2,
    props.width / 16,
    `${scale.value}px`
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

.slider-top-most {
  position: absolute;
  left: var(--padding);
  top: calc(var(--padding) - var(--bar-distance) - var(--bar-width));
  width: var(--page-width);
  height: var(--bar-width);
}
</style>
