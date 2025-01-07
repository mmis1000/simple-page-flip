<template>
  <DemoBase :effect="effect" :onRight="true" showRight showTop />
</template>
<script setup lang="ts">
import { getEffectRightTop } from '../../src/lib';
import DemoBase from './DemoBase.vue';

const effect = (
  width: number,
  height: number,
  shadow: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => getEffectRightTop(
  width,
  height,
  right,
  top,
  shadow
);
</script>
<style scoped></style>