<template>
  <DemoBase :effect="effect" showLeft showBottom/>
</template>
<script setup lang="ts">
import { getEffectLeftBottom } from '../../src/lib';
import DemoBase from './DemoBase.vue';

const effect = (
  width: number,
  height: number,
  shadow: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) => getEffectLeftBottom(
  width,
  height,
  left,
  bottom,
  shadow
);
</script>
<style scoped></style>