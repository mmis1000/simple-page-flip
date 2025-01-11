<template>
  <div class="angle" ref="angleRef">
    <div class="leg" :style="{ '--angle': baseAngle }"></div>
    <div class="leg-value" :style="{ '--angle': baseAngle }">
      0
      <div class="leg-value-symbol">°</div>
    </div>
    <div class="leg" :style="{ '--angle': baseAngle + showingAngle }"></div>
    <div class="leg-value" :style="{ '--angle': baseAngle + showingAngle }">
      {{ ((angle / Math.PI) * 180).toFixed(0) }}
      <div class="leg-value-symbol">°</div>
    </div>
    <div
      class="handle"
      ref="angleIndicatorRef"
      :style="{ '--angle': baseAngle + showingAngle }"
      :onPointerdown="onPointerDown"
      :onPointermove="onPointerMove"
      :onPointerup="onPointerUpOrCancel"
      :onPointercancel="onPointerUpOrCancel"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  baseAngle: {
    type: Number,
    default: 0,
  },
  minAngle: {
    type: Number,
    default: -Math.PI,
  },
  maxAngle: {
    type: Number,
    default: Math.PI,
  },
});

const angle = defineModel("angle", { default: 0 });

const angleRef = ref<HTMLDivElement>(null!);
const angleIndicatorRef = ref<HTMLDivElement>(null!);

const showingAngle = computed(() => {
  if (trackingPointer.value) {
    const initialUserAngle = Math.atan2(
      trackingPointer.value.startPos[1] - trackingPointer.value.centerPos[1],
      trackingPointer.value.startPos[0] - trackingPointer.value.centerPos[0],
    );
    const endUserAngle = Math.atan2(
      trackingPointer.value.endPos[1] - trackingPointer.value.centerPos[1],
      trackingPointer.value.endPos[0] - trackingPointer.value.centerPos[0],
    );
    const diff = endUserAngle - initialUserAngle;
    let newAngle = trackingPointer.value.startAngle + diff;
    if (newAngle < -Math.PI) newAngle += Math.PI * 2;
    if (newAngle > Math.PI) newAngle -= Math.PI * 2;
    newAngle = clamp(props.minAngle, newAngle, props.maxAngle);
    return newAngle;
  } else {
    return angle.value;
  }
});

const trackingPointer = ref<null | {
  id: number;
  centerPos: readonly [number, number];
  startPos: readonly [number, number];
  startAngle: number;
  endPos: readonly [number, number];
}>(null);

const clamp = (min, value, max) => {
  return Math.min(max, Math.max(min, value));
};

const onPointerDown = (ev: PointerEvent) => {
  console.log(ev);
  if (trackingPointer.value != null) return;
  angleIndicatorRef.value.setPointerCapture(ev.pointerId);
  const box = angleRef.value.getBoundingClientRect();
  const centerPos = [box.x, box.y] as const;
  const startPos = [ev.clientX, ev.clientY] as const;
  const endPos = [ev.clientX, ev.clientY] as const;
  const startAngle = angle.value;

  const id = ev.pointerId;
  trackingPointer.value = {
    id,
    centerPos,
    startPos,
    startAngle,
    endPos,
  };
};
const onPointerMove = (ev: PointerEvent) => {
  if (
    trackingPointer.value == null ||
    trackingPointer.value.id !== ev.pointerId
  )
    return;
  console.log(ev);
  trackingPointer.value.endPos = [ev.clientX, ev.clientY] as const;

  const initialUserAngle = Math.atan2(
    trackingPointer.value.startPos[1] - trackingPointer.value.centerPos[1],
    trackingPointer.value.startPos[0] - trackingPointer.value.centerPos[0],
  );
  const endUserAngle = Math.atan2(
    trackingPointer.value.endPos[1] - trackingPointer.value.centerPos[1],
    trackingPointer.value.endPos[0] - trackingPointer.value.centerPos[0],
  );
  console.log(trackingPointer.value.startAngle, initialUserAngle, endUserAngle)
  const diff = endUserAngle - initialUserAngle;
  let newAngle = trackingPointer.value.startAngle + diff;
  if (newAngle < -Math.PI) newAngle += Math.PI * 2;
  if (newAngle > Math.PI) newAngle -= Math.PI * 2;
  newAngle = clamp(props.minAngle, newAngle, props.maxAngle);
  angle.value = newAngle;
};
const onPointerUpOrCancel = (ev: PointerEvent) => {
  console.log(ev);
  if (
    trackingPointer.value == null ||
    trackingPointer.value.id !== ev.pointerId
  )
    return;
  angleIndicatorRef.value.releasePointerCapture(ev.pointerId);
  trackingPointer.value = null;
};
</script>
<style scoped>
.angle {
  position: relative;
  user-select: none;
  --leg-dist: 20;
  --leg-length: 40;
  --indicator-width: 30;
}

.leg {
  --angle: 0;
  position: absolute;
  bottom: calc(1px * var(--leg-dist));
  left: 0;
  width: 1px;
  height: calc(1px * var(--leg-length));
  transform-origin: 0 calc(1px * var(--leg-dist) + 1px * var(--leg-length));
  transform: rotate(calc(1rad * var(--angle))) translateX(-50%);
  background-color: black;
  filter: drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 1px white)
    drop-shadow(0px 0px 1px white);
}

.leg-value {
  --angle: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: rotate(calc(1rad * var(--angle)))
    translateY(
      calc(
        -1px * var(--leg-dist) + -1px * var(--leg-length) - 1px * var(
            --indicator-width
          ) / 2
      )
    )
    rotate(calc(-1rad * var(--angle))) translate(-50%, 50%);
  color: blue;
  text-shadow: 0px 0px 1px white, 0px 0px 1px white, 0px 0px 1px white,
    0px 0px 1px white;
  font-size: 0.75rem;
}
.leg-value-symbol {
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
}
.handle {
  --angle: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(1px * var(--indicator-width));
  height: calc(1px * var(--indicator-width));
  transform-origin: 0 100%;
  transform: rotate(calc(1rad * var(--angle)))
    translateY(
      calc(
        -1px * var(--leg-dist) + -1px * var(--leg-length) - 1px * var(
            --indicator-width
          ) / 2
      )
    )
    translate(-50%, 50%);
  background-color: rgba(0, 0, 0, 0.2);
  touch-action: none;
}
</style>
