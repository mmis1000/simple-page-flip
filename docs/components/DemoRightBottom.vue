<template>
  <DemoBase :effect="effect" :onRight="true" showRight showBottom />
</template>
<script setup lang="ts">
import { getEffectRightBottom } from '../../src/lib';
import DemoBase from './DemoBase.vue';

const effect = (
  width: number,
  height: number,
  shadow: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => getEffectRightBottom(
  width,
  height,
  right,
  bottom,
  shadow
);
</script>
<style scoped></style>