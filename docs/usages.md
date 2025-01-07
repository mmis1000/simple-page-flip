# Usages

<script setup>
import DemoLeftTop from './components/DemoLeftTop.vue'
import DemoLeftBottom from './components/DemoLeftBottom.vue'
import DemoLeft from './components/DemoLeft.vue'
import DemoRightTop from './components/DemoRightTop.vue'
import DemoRightBottom from './components/DemoRightBottom.vue'
import DemoRight from './components/DemoRight.vue'
</script>

## Basic setups

## Raw Effects

These are raw effect that fold from specific edge to other

### Left Top

connects from left edge to top edge

<DemoLeftTop />

``` typescript
export declare const getEffectLeftTop: (
    width: number,
    height: number,
    leftOffset: number,
    topOffset: number,
    maxShadowWidth: number
) => EffectStyle;
```

### Left Bottom

connects from left edge to bottom edge

<DemoLeftBottom />

``` typescript
export declare const getEffectLeftBottom: (
    width: number,
    height: number,
    leftOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
) => EffectStyle;
```

### Left

connects from top edge to bottom edge (flip the whole left edge to right)

<DemoLeft />

``` typescript
export declare const getEffectLeft: (
    width: number,
    height: number,
    topOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
) => EffectStyle;
```

### Right Top

connects from right edge to top edge

<DemoRightTop />

``` typescript
export declare const getEffectRightTop: (
    width: number,
    height: number,
    rightOffset: number,
    topOffset: number,
    maxShadowWidth: number
) => EffectStyle;
```

### Right Bottom

connects from right edge to bottom edge

<DemoRightBottom />

``` typescript
export declare const getEffectRightBottom: (
    width: number,
    height: number,
    rightOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
) => EffectStyle;
```

### Right

connects from top edge to bottom edge (flip the whole right edge to left)

<DemoRight />

``` typescript
export declare const getEffectRight: (
    width: number,
    height: number,
    topOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
) => EffectStyle;
```
