<template>
  <DemoBase :effect="effect" showTop showBottom />
</template>
<script setup lang="ts">
import { getEffectLeft } from '../../src/lib';
import DemoBase from './DemoRaw.vue';

const effect = (
  width: number,
  height: number,
  shadow: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => getEffectLeft(
  width,
  height,
  top,
  bottom,
  shadow
);
</script>
<style scoped></style>