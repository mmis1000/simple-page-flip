<template>
  <div
    style="width: 200px; height: 250px; background: white; position: relative"
    ref="root"
  >
    <div
      class="layer-flip-front"
      style="
        position: absolute;
        left: 50px;
        top: 50px;
        width: 100px;
        height: 150px;
        background: green;
      "
    >
      Front Front Front
    </div>
    <div
      class="layer-shadow"
      style="
        position: absolute;
        left: 50px;
        top: 50px;
        width: 100px;
        height: 150px;
      "
    ></div>
    <div
      class="layer-flip-back"
      style="
        position: absolute;
        left: 50px;
        top: 50px;
        width: 100px;
        height: 150px;
        background: blue;
      "
    >
      Back Back Back
    </div>
    <div
      class="layer-effect"
      style="
        position: absolute;
        left: 50px;
        top: 50px;
        width: 100px;
        height: 150px;
      "
    ></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getEffectLeftTop } from "../../src/lib";

const root = ref<HTMLDivElement>();

onMounted(() => {
  const rootEl = root.value!;
  const effect = getEffectLeftTop(100, 150, 100, 50, 10);
  rootEl
    .querySelectorAll<HTMLDivElement>(":scope .layer-flip-front")
    .forEach((el) => {
      Object.assign(el.style, effect.flipFront);
    });
  rootEl
    .querySelectorAll<HTMLDivElement>(":scope .layer-shadow")
    .forEach((el) => {
      Object.assign(el.style, effect.flipShadow);
    });
  rootEl
    .querySelectorAll<HTMLDivElement>(":scope .layer-flip-back")
    .forEach((el) => {
      Object.assign(el.style, effect.flipBack);
    });
  rootEl
    .querySelectorAll<HTMLDivElement>(":scope .layer-effect")
    .forEach((el) => {
      Object.assign(el.style, effect.flipEffect);
    });
});
</script>
