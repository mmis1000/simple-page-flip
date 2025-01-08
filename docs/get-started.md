# Get started

<script setup>
import DemoSetupWithoutStyle from './components/DemoSetupWithoutStyle.vue'
import DemoSetupWithStyle from './components/DemoSetupWithStyle.vue'
</script>

## Pre-requirement

- None

Any frameworks should work with this library because it is just a style generator.

## Setup

All APIs in this library return `EffectStyle` which consists of 4 style objects.

```typescript
export declare interface EffectStyle {
    flipFront: Partial<CSSStyleDeclaration>;
    flipBack: Partial<CSSStyleDeclaration>;
    flipShadow: Partial<CSSStyleDeclaration>;
    flipEffect: Partial<CSSStyleDeclaration>;
}
```

To use these 4 style objects you need a stack of elements in this order.

```html
<div class="root" style="width: 200px; height: 250px; background: white; position: relative">
    <div class="layer-flip-front" style="position: absolute; left: 50px; top: 50px; width: 100px; height: 150px;">
        <div class="item" style="width: 100px; height: 150px; background: green">Front Front Front</div>
    </div>
    <div class="layer-shadow" style="position: absolute; left: 50px; top: 50px; width: 100px; height: 150px;">
        <div class="item" style="width: 100px; height: 150px"></div>
    </div>
    <div class="layer-flip-back" style="position: absolute; left: 50px; ; top: 50px; width: 100px; height: 150px;">
        <div class="item" style="width: 100px; height: 150px; background: blue">Back Back Back</div>
    </div>
    <div class="layer-effect" style="position: absolute; left: 50px; top: 50px; width: 100px; height: 150px;">
        <div class="item" style="width: 100px; height: 150px"></div>
    </div>
</div>
```

There will be 4 layers in this order.

1. front
    - the page front that is being folded, can have any content you want
2. shadow
    - a decoration layer with no default appearance
3. back
    - the page back that is folded to font, can have any content you want
4. effect
    - a decoration layer with no default appearance

Each of them should have the same height and width set and overlap on the same position.

<DemoSetupWithoutStyle/>

And then you apply styles in `EffectStyle` to each one with js,  
or pre-render using some frameworks,  
or copy the generated style into normal css stylesheet.

```typescript
const rootEl = document.querySelector('.root')!
const effect = getEffectLeftTop(100, 150, 100, 50, 10)
rootEl.querySelectorAll<HTMLDivElement>(':scope .layer-flip-front .item').forEach(el => {
    Object.assign(el.style, effect.flipFront)
})
rootEl.querySelectorAll<HTMLDivElement>(':scope .layer-shadow .item').forEach(el => {
    Object.assign(el.style, effect.flipShadow)
})
rootEl.querySelectorAll<HTMLDivElement>(':scope .layer-flip-back .item').forEach(el => {
    Object.assign(el.style, effect.flipBack)
})
rootEl.querySelectorAll<HTMLDivElement>(':scope .effect .item').forEach(el => {
    Object.assign(el.style, effect.flipEffect)
})
```

<DemoSetupWithStyle/>

Congratulations!  
The effect is now properly set up.
