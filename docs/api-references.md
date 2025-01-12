# API references

<script setup>
import DemoLeftTop from './components/DemoLeftTop.vue'
import DemoLeftBottom from './components/DemoLeftBottom.vue'
import DemoLeft from './components/DemoLeft.vue'
import DemoRightTop from './components/DemoRightTop.vue'
import DemoRightBottom from './components/DemoRightBottom.vue'
import DemoRight from './components/DemoRight.vue'
import DemoEffectStrength from './components/DemoEffectStrength.vue'
import DemoEffectFull from './components/DemoEffectFull.vue'
import DemoEffectUnit from './components/DemoEffectUnit.vue'
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

## The `maxShadowWidth` parameter

This parameter controls the max width of shadow effect and reflection.

<DemoEffectStrength :top="60" :bottom="50" :initial-shadow="10"/>

<DemoEffectStrength :top="60" :bottom="50" :initial-shadow="30"/>

The actual shadow width is capped by the distance to the corner.  
The book will have no effect applied when it is nearly completely opened or closed.  

<DemoEffectStrength :top="10" :bottom="0" :initial-shadow="10"/>

It won't overflow the page dog-ear when specified value is much wider than the dog-ear itself.

<DemoEffectStrength :top="10" :bottom="0" :initial-shadow="50"/>

## The `unit` parameter

The `unit` parameter represent base length unit of this library (defaults to `1px`), it can be used with js/css variable to resize the effect.

<DemoEffectUnit/>
<DemoEffectUnit :initial-scale="0.5" />

it can also be combined with container query unit like `1cqw` to make the effect responsive

## Raw Effects

These are raw effects that fold from specific edge to other

### Left Top

Connects from left edge to top edge

<DemoLeftTop />

``` typescript
export declare const getEffectLeftTop: (
    width: number,
    height: number,
    leftOffset: number,
    topOffset: number,
    maxShadowWidth: number,
    unit?: string,
) => EffectStyle;
```

### Left Bottom

Connects from left edge to bottom edge

<DemoLeftBottom />

``` typescript
export declare const getEffectLeftBottom: (
    width: number,
    height: number,
    leftOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```

### Left

Connects from top edge to bottom edge (flip the whole left edge to right)

<DemoLeft />

``` typescript
export declare const getEffectLeft: (
    width: number,
    height: number,
    topOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```

### Right Top

Connects from right edge to top edge

<DemoRightTop />

``` typescript
export declare const getEffectRightTop: (
    width: number,
    height: number,
    rightOffset: number,
    topOffset: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```

### Right Bottom

Connects from right edge to bottom edge

<DemoRightBottom />

``` typescript
export declare const getEffectRightBottom: (
    width: number,
    height: number,
    rightOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```

### Right

Connects from top edge to bottom edge (flip the whole right edge to left)

<DemoRight />

``` typescript
export declare const getEffectRight: (
    width: number,
    height: number,
    topOffset: number,
    bottomOffset: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```

## Full effect

High level api that auto select the proper effect with a center point and a tilting angle

### Left

Book page on left

\* The `angle` parameter will be capped to the max possible value.

<DemoEffectFull />


``` typescript
/**
 * @param width
 * @param height
 * @param centerX
 * @param centerY
 * @param angle tilting of the page flip, between `-Math.PI / 2` and `Math.PI / 2`.
 *              positive for clockwise, negative for counter clockwise
 * @param maxShadowWidth
 * @param unit base unit of all length value, defaults to `1px`
 */
export declare const createEffectLeft: (
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    angle: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```

### Right

Book page on right

\* The `angle` parameter will be capped to the max possible value.

<DemoEffectFull :onRight="true"/>

```typescript

/**
 * @param width
 * @param height
 * @param centerX
 * @param centerY
 * @param angle tilting of the page flip, between `-Math.PI / 2` and `Math.PI / 2`.
 *              positive for clockwise, negative for counter clockwise
 * @param maxShadowWidth
 * @param unit base unit of all length value, defaults to `1px`
 */
export declare const createEffectRight: (
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    angle: number,
    maxShadowWidth: number
    unit?: string,
) => EffectStyle;
```