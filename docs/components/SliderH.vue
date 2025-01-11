<template>
  <div class="slider">
    <div
      class="slider-inner"
      ref="sliderInnerRef"
      :style="{
        '--ratio': currentRatio,
        '--offset': offset,
        '--extension': extension,
      }"
    >
      <div class="effect">
        <div class="slider-fill"></div>
        <div
          :class="[
            'extension',
            direction === 'bottom' ? 'extension-left' : 'extension-left-invert',
          ]"
        ></div>
        <div
          :class="[
            'extension',
            direction === 'bottom'
              ? 'extension-right'
              : 'extension-right-invert',
          ]"
        ></div>
      </div>
      <div
        v-if="!readonly"
        class="slider-indicator"
        ref="sliderIndicatorRef"
        :onPointerdown="onPointerDown"
        :onPointermove="onPointerMove"
        :onPointerup="onPointerUpOrCancel"
        :onPointercancel="onPointerUpOrCancel"
      >
        <div class="slider-indicator-inner"></div>
      </div>
      <div
        :class="[
          'value-text',
          direction === 'top' ? 'value-text-top' : 'value-text-bottom',
        ]"
      >
        {{ name ? `${name}: ` : "" }}
        {{ liveValue }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType, ref, toRefs } from "vue";
const props = defineProps({
  maxValue: { type: Number, required: true },
  modelValue: { type: Number, required: true },
  extension: { type: Number, default: 20 },
  direction: { type: String as PropType<"top" | "bottom">, default: "bottom" },
  readonly: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);
const ratio = computed({
  get(): number {
    return props.modelValue / props.maxValue;
  },
  set(v) {
    emit("update:modelValue", v * props.maxValue);
  },
});
const sliderInnerRef = ref<HTMLDivElement>(null!);
const sliderIndicatorRef = ref<HTMLDivElement>(null!);
const maxValue = toRefs(props).maxValue;
const extension = toRefs(props).extension;
const direction = toRefs(props).direction;
const name = defineModel("name", { default: "" });

const trackingPointer = ref<{
  id: number;
  startRatio: number;
  startPos: number;
  endPos: number;
  minPos: number;
  maxPos: number;
  fullWidth: number;
} | null>(null);

const clamp = (min, value, max) => {
  return Math.min(max, Math.max(min, value));
};

const offset = computed(() => {
  if (trackingPointer.value == null) return 0;
  const normalizedPos = clamp(
    trackingPointer.value.minPos,
    trackingPointer.value.endPos,
    trackingPointer.value.maxPos
  );
  return normalizedPos - trackingPointer.value.startPos;
});
const currentRatio = computed(() => {
  if (trackingPointer.value == null) return ratio.value;
  return trackingPointer.value.startRatio;
});

const liveValue = computed(() => {
  if (trackingPointer.value == null)
    return Math.round(ratio.value * maxValue.value);
  const normalizedPos = clamp(
    trackingPointer.value.minPos,
    trackingPointer.value.endPos,
    trackingPointer.value.maxPos
  );
  const ratioDiff =
    (normalizedPos - trackingPointer.value.startPos) /
    trackingPointer.value.fullWidth;
  const newRatio = trackingPointer.value.startRatio + ratioDiff;
  return Math.round(newRatio * maxValue.value);
});

const onPointerDown = (ev: PointerEvent) => {
  console.log(ev);
  if (trackingPointer.value != null) return;
  sliderIndicatorRef.value.setPointerCapture(ev.pointerId);
  const fullWidth = sliderInnerRef.value.getBoundingClientRect().width;
  const startPos = ev.clientX;
  const endPos = ev.clientX;
  const startRatio = ratio.value;
  const maxPos = startPos + fullWidth * (1 - startRatio);
  const minPos = startPos - fullWidth * startRatio;

  const id = ev.pointerId;
  trackingPointer.value = {
    id,
    startRatio: ratio.value,
    startPos,
    endPos,
    minPos,
    maxPos,
    fullWidth,
  };
};
const onPointerMove = (ev: PointerEvent) => {
  if (
    trackingPointer.value == null ||
    trackingPointer.value.id !== ev.pointerId
  ) {
    return;
  }
  console.log(ev);
  trackingPointer.value.endPos = ev.clientX;

  const normalizedPos = clamp(
    trackingPointer.value.minPos,
    trackingPointer.value.endPos,
    trackingPointer.value.maxPos
  );
  const ratioDiff =
    (normalizedPos - trackingPointer.value.startPos) /
    trackingPointer.value.fullWidth;
  const newRatio = trackingPointer.value.startRatio + ratioDiff;
  const newValue = Math.round(newRatio * maxValue.value);
  emit("update:modelValue", newValue);
};
const onPointerUpOrCancel = (ev: PointerEvent) => {
  if (
    trackingPointer.value == null ||
    trackingPointer.value.id !== ev.pointerId
  ) {
    return;
  }
  console.log(ev);
  const normalizedPos = clamp(
    trackingPointer.value.minPos,
    trackingPointer.value.endPos,
    trackingPointer.value.maxPos
  );
  const diff = normalizedPos - trackingPointer.value.startPos;
  const ratioDiff = (diff / trackingPointer.value.fullWidth) * 1;
  const newPercentage = trackingPointer.value.startRatio + ratioDiff;
  sliderIndicatorRef.value.releasePointerCapture(ev.pointerId);

  console.log(
    normalizedPos,
    trackingPointer.value.startPos,
    trackingPointer.value.startRatio,
    newPercentage
  );
  ratio.value = newPercentage;
  trackingPointer.value = null;
};
</script>
<style lang="css" scoped>
.slider {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  user-select: none;
}

.slider-inner {
  position: relative;
  flex: 1 1 0;
  background: transparent;
  --ratio: 0.5;
  --offset: 0;
  --indicator-padding: 5px;
  --extension: 0;
  display: flex;
  align-items: stretch;
}

.slider-fill {
  height: 1px;
  width: calc(100% * var(--ratio) + 1px * var(--offset));
  background-color: black;
}

.value-text {
  position: absolute;
  top: 50%;
  left: calc(100% * var(--ratio) / 2);
  pointer-events: none;
  color: black;
  text-shadow: 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white,
    0px 0px 1px white;
  white-space: nowrap;
  font-size: 0.75rem;
}
.value-text-top {
  transform: translate(calc(-50% + 1px * var(--offset) / 2), -0%);
}

.value-text-bottom {
  transform: translate(calc(-50% + 1px * var(--offset) / 2), -100%);
}

.slider-indicator {
  position: absolute;
  height: calc(100% + var(--indicator-padding) * 2);
  aspect-ratio: 1;
  top: 50%;
  left: calc(100% * var(--ratio));
  transform: translate(calc(-50% + 1px * var(--offset)), -50%);
  background-color: rgba(0, 0, 0, 0.2);
  touch-action: none;
}

.slider-indicator-inner {
  position: absolute;
  height: calc(100% - var(--indicator-padding) * 2);
  width: 2px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(79, 255, 52, 0.5);
}

.extension-left {
  left: 0;
  top: 0;
  bottom: calc(0% - 1px * var(--extension));
  transform: translate(0, 0);
}

.extension-left-invert {
  left: 0;
  top: calc(0% - 1px * var(--extension));
  bottom: 0;
  transform: translate(0, 0);
}

.extension-right {
  left: calc(100% * var(--ratio));
  top: 0;
  bottom: calc(0% - 1px * var(--extension));
  transform: translate(calc(-100% + 1px * var(--offset)), 0);
}

.extension-right-invert {
  left: calc(100% * var(--ratio));
  top: calc(0% - 1px * var(--extension));
  bottom: 0;
  transform: translate(calc(-100% + 1px * var(--offset)), 0);
}

.extension {
  position: absolute;
  width: 1px;
  background-color: black;
}
.effect {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  filter: drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 1px white)
    drop-shadow(0px 0px 1px white);
}
</style>
