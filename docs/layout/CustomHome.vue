<script setup lang="ts">
import { VPButton, VPLink } from "vitepress/theme";
import Fold from "../components/Fold.vue";
import BreakIn from "../components/BreakIn.vue";
</script>

<template>
  <div class="custom-home">
    <div class="hero">
      <div class="hero-container">
        <div class="main">
          <h1 class="name">
            <Fold>
              <div class="clip">Simple page flip</div>
            </Fold>
          </h1>
          <p class="text"><!--
        -->A util library for generating page flip effect stylesheet
          </p>
          <BreakIn>
            <p class="tagline">Make a better page flip</p>
          </BreakIn>
          <div class="actions">
            <div class="action">
              <VPButton
                href="/get-started"
                theme="alt"
                text="Get started"
              ></VPButton>
            </div>
            <div class="action">
              <VPButton
                href="/api-references"
                theme="alt"
                text="API references"
              ></VPButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="features">
      <div class="feature-list">
        <div class="container">
          <div class="items">
            <div class="item grid-3">
              <VPLink :no-icon="true" class="VPFeature">
                <div class="box">
                  <div class="title">CSS Only</div>
                  <div class="details">
                    All generated results are just vanilla css styles
                  </div>
                </div>
              </VPLink>
            </div>
            <div class="item grid-3">
              <VPLink :no-icon="true" class="VPFeature">
                <div class="box">
                  <div class="title">Seemless</div>
                  <div class="details">
                    No jitter when transition from one style to other
                  </div>
                </div>
              </VPLink>
            </div>
            <div class="item grid-3">
              <VPLink :no-icon="true" class="VPFeature">
                <div class="box">
                  <div class="title">No residue</div>
                  <div class="details">
                    No remaining effect on screen when flip is completed, make
                    it suitable for e-reader effect or jump scares
                  </div>
                </div>
              </VPLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<style scoped>
.custom-home {
  padding: 0;
  margin: 0;
}

.hero {
  padding: calc(var(--vp-layout-top-height, 0px) + 48px) 24px 48px;
}
@media (min-width: 640px) {
  .hero {
    padding: calc(var(--vp-layout-top-height, 0px) + 80px) 48px 64px;
  }
}

.hero-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1152px;
}

@media (min-width: 960px) {
  .hero-container {
    flex-direction: row;
  }
}

.main {
  position: relative;
  z-index: 10;
  order: 2;
  flex-grow: 1;
  flex-shrink: 0;
}
@media (min-width: 960px) {
  .main {
    order: 1;
    width: calc((100% / 3) * 2);
  }
}
@media (min-width: 960px) {
  .hero {
    padding: calc(var(--vp-layout-top-height, 0px) + 80px) 64px 64px;
  }
}
.name {
  max-width: 392px;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;

  /** for effect text */
  display: inline-block;
}
.text {
  max-width: 392px;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
}
@media (min-width: 640px) {
  .name,
  .text {
    max-width: 576px;
    line-height: 56px;
    font-size: 48px;
  }
}
@media (min-width: 960px) {
  .name,
  .text {
    line-height: 64px;
    font-size: 56px;
  }
}

.clip {
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}

.tagline {
  padding-top: 8px;
  max-width: 392px;
  line-height: 28px;
  font-size: 18px;
  font-weight: 500;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
}
@media (min-width: 640px) {
  .tagline {
    padding-top: 12px;
    max-width: 576px;
    line-height: 32px;
    font-size: 20px;
  }
}
@media (min-width: 960px) {
  .tagline {
    line-height: 36px;
    font-size: 24px;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
  padding-top: 24px;
}
@media (min-width: 640px) {
  .actions {
    padding-top: 32px;
  }
}

.action {
  flex-shrink: 0;
  padding: 6px;
}

.feature-list {
  position: relative;
  padding: 0 24px;
}
@media (min-width: 640px) {
  .feature-list {
    padding: 0 48px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.VPFeature {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 768px) {
  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
