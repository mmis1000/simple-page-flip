<template>
  <DemoBase :effect="effect" showLeft showTop />
</template>
<script setup lang="ts">
import { getEffectLeftTop } from '../../src/lib';
import DemoBase from './DemoRawBase.vue';

const effect = (
  width: number,
  height: number,
  shadow: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => getEffectLeftTop(
  width,
  height,
  left,
  top,
  shadow
);
</script>
<style scoped></style>