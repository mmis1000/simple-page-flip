---
# https://vitepress.dev/reference/default-theme-home-page
layout: page
sidebar: false

pageClass: no-separator

hero:
  name: "Simple page flip"
  text: "A util library for generating page flip effect stylesheet"
  tagline: Make a better page flip
  actions:
    # - theme: brand
    #   text: Markdown Examples
    #   link: /markdown-examples
    - theme: alt
      text: Get started
      link: /get-started
    - theme: alt
      text: API references
      link: /api-references

features:
  - title: CSS Only
    details: All generated results are just vanilla css styles
  - title: Seemless
    details: No jitter when transition from one style to other
  - title: No residue
    details: No remaining effect on screen when flip is completed, make it suitable for e-reader effect or jump scares
---

<style>
/** overrides .VPNavBar:not(.home) .divider-line[data-v-cf6e7c5e] */
.no-separator .divider-line.divider-line.divider-line {
  background: transparent
}
</style>
<script setup lang="ts">
import CustomHome from './layout/CustomHome.vue'
</script>

<CustomHome>
</CustomHome>