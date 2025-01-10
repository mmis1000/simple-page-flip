<template>
  <DemoBase :effect="effect" :onRight="true" showTop showBottom />
</template>
<script setup lang="ts">
import { getEffectRight } from '../../src/lib';
import DemoBase from './DemoRaw.vue';

const effect = (
  width: number,
  height: number,
  shadow: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => getEffectRight(
  width,
  height,
  top,
  bottom,
  shadow
);
</script>
<style scoped></style>