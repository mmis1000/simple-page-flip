import './style.css'
import { getEffectLeft, getEffectLeftBottom, getEffectLeftTop, getEffectRight, getEffectRightBottom, getEffectRightTop } from './utils/effects.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<button id="toggle">pause/play</button> <br>
<div class="wrap sample-book">
  <div class="item-mask">
    <div class="item-wrap">
      <div class="item" style="background: lightBlue">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-shadow">
    <div class="item-wrap transformed-front shadowed-front masked-shadow">
      <div class="item"></div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-effect">
    <div class="item-wrap transformed-effect masked-effect">
      <div class="item"></div>
    </div>
  </div>
</div>
<div class="wrap sample-book2">
  <div class="item-mask">
    <div class="item-wrap">
      <div class="item" style="background: lightBlue">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-shadow">
    <div class="item-wrap transformed-front shadowed-front masked-shadow">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)"></div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-effect">
    <div class="item-wrap transformed-effect masked-effect">
      <div class="item"></div>
    </div>
  </div>
</div>
<div class="wrap sample-book3">
  <div class="item-mask">
    <div class="item-wrap">
      <div class="item" style="background: lightBlue">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-shadow">
    <div class="item-wrap transformed-front shadowed-front masked-shadow">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)"></div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-effect">
    <div class="item-wrap transformed-effect masked-effect">
      <div class="item"></div>
    </div>
  </div>
</div>
<div class="wrap sample-book4">
  <div class="item-mask">
    <div class="item-wrap">
      <div class="item" style="background: lightBlue">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-shadow">
    <div class="item-wrap transformed-front shadowed-front masked-shadow">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)"></div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask layer-effect">
    <div class="item-wrap transformed-effect masked-effect">
      <div class="item"></div>
    </div>
  </div>
</div>
`

const updateDemoBook = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book";

  let clipPathRemain: any, clipPathFlip: any, clipPathFlipShadow: any, clipPathEffect: any, boxShadow: any, transform: any, transformEffect: any;

  // progress = 0.9999999925888101

  const points = [
    [0, 0.1, (_fullProgress: number) => {
      const top = 0;
      const left = 0;
      return getEffectLeftTop(
        WIDTH,
        HEIGHT,
        HEIGHT * left,
        WIDTH * top,
        SHADOW
      );
    }],
    [0.1, 0.3, (fullProgress: number) => {
      const top = fullProgress * 0.3;
      const left = fullProgress;
      return getEffectLeftTop(
        WIDTH,
        HEIGHT,
        HEIGHT * left,
        WIDTH * top,
        SHADOW
      );
    }],
    [0.3, 0.9, (fullProgress: number) => {
      const top = 0.3 + fullProgress * 0.7;
      const bottom = fullProgress * 1;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }],
    [0.9, 1, (_fullProgress: number) => {
      const top = 1;
      const bottom = 1;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }]
  ] as const
  
  // progress = 0.8
  
  for (let item of points) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0])
      ;({ clipPathRemain, clipPathFlip, clipPathFlipShadow, clipPathEffect, boxShadow, transform, transformEffect } = item[2](fullProgress))
      break
    }
  }

  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .shadowed-front")).forEach(
    (i) => {
      i.style.boxShadow = boxShadow;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-back")).forEach((i) => {
    i.style.clipPath = clipPathRemain;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-shadow")).forEach((i) => {
    i.style.clipPath = clipPathFlipShadow;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-effect")).forEach(
    (i) => {
      i.style.clipPath = clipPathEffect;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-effect")).forEach(
    (i) => {
      i.style.transform = transformEffect;
    }
  );
};

const updateDemoBook2 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book2";

  let clipPathRemain: any, clipPathFlip: any, clipPathFlipShadow: any, clipPathEffect: any, boxShadow: any, transform: any, transformEffect: any;

  // progress = 0.9999999925888101

  const points = [
    [0, 0.1, (_fullProgress: number) => {
      const top = 1;
      const right = 0;
      return getEffectRightTop(
        WIDTH,
        HEIGHT,
        HEIGHT * right,
        WIDTH * top,
        SHADOW
      );
    }],
    [0.1, 0.3, (fullProgress: number) => {
      const top = 1 - fullProgress * 0.3;
      const right = fullProgress;
      return getEffectRightTop(
        WIDTH,
        HEIGHT,
        HEIGHT * right,
        WIDTH * top,
        SHADOW
      );
    }],
    [0.3, 0.9, (fullProgress: number) => {
      const top = 1 - (0.3 + fullProgress * 0.7);
      const bottom = 1 - fullProgress * 1;

      return getEffectRight(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }],
    [0.9, 1, (_fullProgress: number) => {
      const top = 0;
      const bottom = 0;

      return getEffectRight(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }]
  ] as const
  
  // progress = 0.8
  
  for (let item of points) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0])
      ;({ clipPathRemain, clipPathFlip, clipPathFlipShadow, clipPathEffect, boxShadow, transform, transformEffect } = item[2](fullProgress))
      break
    }
  }

  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .shadowed-front")).forEach(
    (i) => {
      i.style.boxShadow = boxShadow;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-back")).forEach((i) => {
    i.style.clipPath = clipPathRemain;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-shadow")).forEach((i) => {
    i.style.clipPath = clipPathFlipShadow;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-effect")).forEach(
    (i) => {
      i.style.clipPath = clipPathEffect;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-effect")).forEach(
    (i) => {
      i.style.transform = transformEffect;
    }
  );
};

const updateDemoBook3 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book3";

  let clipPathRemain: any, clipPathFlip: any, clipPathFlipShadow: any, clipPathEffect: any, boxShadow: any, transform: any, transformEffect: any;

  // progress = 0.9999999925888101

  const points = [
    [0, 0.1, (_fullProgress: number) => {
      const bottom = 0;
      const left = 1;
      return getEffectLeftBottom(
        WIDTH,
        HEIGHT,
        HEIGHT * left,
        WIDTH * bottom,
        SHADOW
      );
    }],
    [0.1, 0.3, (fullProgress: number) => {
      const bottom = fullProgress * 0.3;
      const left = 1 - fullProgress;
      return getEffectLeftBottom(
        WIDTH,
        HEIGHT,
        HEIGHT * left,
        WIDTH * bottom,
        SHADOW
      );
    }],
    [0.3, 0.9, (fullProgress: number) => {
      const top = fullProgress * 1;
      const bottom = 0.3 + fullProgress * 0.7;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }],
    [0.9, 1, (_fullProgress: number) => {
      const top = 1;
      const bottom = 1;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }]
  ] as const
  
  // progress = 0.8
  
  for (let item of points) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0])
      ;({ clipPathRemain, clipPathFlip, clipPathFlipShadow, clipPathEffect, boxShadow, transform, transformEffect } = item[2](fullProgress))
      break
    }
  }

  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .shadowed-front")).forEach(
    (i) => {
      i.style.boxShadow = boxShadow;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-back")).forEach((i) => {
    i.style.clipPath = clipPathRemain;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-shadow")).forEach((i) => {
    i.style.clipPath = clipPathFlipShadow;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-effect")).forEach(
    (i) => {
      i.style.clipPath = clipPathEffect;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-effect")).forEach(
    (i) => {
      i.style.transform = transformEffect;
    }
  );
};

const updateDemoBook4 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book4";

  let clipPathRemain: any, clipPathFlip: any, clipPathFlipShadow: any, clipPathEffect: any, boxShadow: any, transform: any, transformEffect: any;

  // progress = 0.9999999925888101

  const points = [
    [0, 0.1, (_fullProgress: number) => {
      const top = 1;
      const right = 1;
      return getEffectRightBottom(
        WIDTH,
        HEIGHT,
        HEIGHT * right,
        WIDTH * top,
        SHADOW
      );
    }],
    [0.1, 0.3, (fullProgress: number) => {
      const top = 1 - fullProgress * 0.3;
      const right = 1 - fullProgress;
      return getEffectRightBottom(
        WIDTH,
        HEIGHT,
        HEIGHT * right,
        WIDTH * top,
        SHADOW
      );
    }],
    [0.3, 0.9, (fullProgress: number) => {
      const bottom = 1 - (0.3 + fullProgress * 0.7);
      const top = 1 - fullProgress * 1;

      return getEffectRight(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }],
    [0.9, 1, (_fullProgress: number) => {
      const bottom = 0;
      const top = 0;

      return getEffectRight(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * bottom,
        SHADOW
      );
    }]
  ] as const
  
  // progress = 0.8
  
  for (let item of points) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0])
      ;({ clipPathRemain, clipPathFlip, clipPathFlipShadow, clipPathEffect, boxShadow, transform, transformEffect } = item[2](fullProgress))
      break
    }
  }

  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .shadowed-front")).forEach(
    (i) => {
      i.style.boxShadow = boxShadow;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-back")).forEach((i) => {
    i.style.clipPath = clipPathRemain;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-shadow")).forEach((i) => {
    i.style.clipPath = clipPathFlipShadow;
  });
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-effect")).forEach(
    (i) => {
      i.style.clipPath = clipPathEffect;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-effect")).forEach(
    (i) => {
      i.style.transform = transformEffect;
    }
  );
};

const fpxRatio = 1;

const duration = 8000 * fpxRatio;
const start = Date.now();

let i = 0;

let id: ReturnType<typeof requestAnimationFrame> | null = null 

const tick = () => {
  i++;

  if (i % fpxRatio === 0) {
    const diff = Date.now() - start;
    const progress =
      (Math.sin((diff / duration) * 2 * Math.PI - Math.PI / 2) + 1) /
      2;
    updateDemoBook(progress);
    updateDemoBook2(progress)
    updateDemoBook3(progress)
    updateDemoBook4(progress)
  }
  id = requestAnimationFrame(tick);
};

id = requestAnimationFrame(tick);

document.getElementById('toggle')?.addEventListener('click', () => {
  if (id == null) {
    id = requestAnimationFrame(tick);
  } else {
    cancelAnimationFrame(id)
    id = null
  }
})