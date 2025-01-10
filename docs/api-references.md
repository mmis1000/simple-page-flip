# API references

<script setup>
import DemoLeftTop from './components/DemoLeftTop.vue'
import DemoLeftBottom from './components/DemoLeftBottom.vue'
import DemoLeft from './components/DemoLeft.vue'
import DemoRightTop from './components/DemoRightTop.vue'
import DemoRightBottom from './components/DemoRightBottom.vue'
import DemoRight from './components/DemoRight.vue'
import DemoEffectStrength from './components/DemoEffectStrength.vue'
</script>

## Interfaces

### EffectStyle

The return type of APIs in this library

```typescript
export declare interface EffectStyle {
    flipFront: Partial<CSSStyleDeclaration>;
    flipBack: Partial<CSSStyleDeclaration>;
    flipShadow: Partial<CSSStyleDeclaration>;
    flipEffect: Partial<CSSStyleDeclaration>;
}
```

## The `shadow` parameter

This parameter controls the max width of shadow effect and reflection.

<DemoEffectStrength top="60" bottom="50" initial-shadow="10"/>

<DemoEffectStrength top="60" bottom="50" initial-shadow="30"/>

The actual shadow width is capped by the distance to the corner.  
The book will have no effect applied when it is nearly completely opened or closed.  

<DemoEffectStrength top="10" bottom="0" initial-shadow="10"/>

It won't overflow the page dog-ear when specified value is much wider than the dog-ear itself.

<DemoEffectStrength top="10" bottom="0" initial-shadow="50"/>

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
