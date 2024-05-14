import './style.css'
import { getEffectLeft, getEffectLeftBottom, getEffectLeftTop, getEffectRight, getEffectRightBottom, getEffectRightTop } from './utils/effects.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="wrap sample-book">
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front shadowed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
</div>
<div class="wrap sample-book2">
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front shadowed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
</div>
<div class="wrap sample-book3">
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front shadowed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
</div>
<div class="wrap sample-book4">
  <div class="item-mask">
    <div class="item-wrap masked-back">
      <div class="item">Text Text Text Text </div>
    </div>
  </div>
  <div class="item-mask">
    <div class="item-wrap transformed-front shadowed-front masked-front">
      <div class="item" style="background: lightBlue; transform: scaleX(-1)">Text Text Text Text </div>
    </div>
  </div>
</div>
`

const updateDemoBook = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book";

  let clipPathRemain: any, clipPathFlip: any, boxShadow: any, transform: any;

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
      const botton = fullProgress * 1;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * botton,
        SHADOW
      );
    }],
    [0.9, 1, (_fullProgress: number) => {
      const top = 1;
      const botton = 1;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * botton,
        SHADOW
      );
    }]
  ] as const
  
  // progress = 0.8
  
  for (let item of points) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0])
      ;({ clipPathRemain, clipPathFlip, boxShadow, transform } = item[2](fullProgress))
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
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
};

const updateDemoBook2 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book2";

  let clipPathRemain: any, clipPathFlip: any, boxShadow: any, transform: any;

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
      ;({ clipPathRemain, clipPathFlip, boxShadow, transform } = item[2](fullProgress))
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
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
};

const updateDemoBook3 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book3";

  let clipPathRemain: any, clipPathFlip: any, boxShadow: any, transform: any;

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
      const botton = 1;

      return getEffectLeft(
        WIDTH,
        HEIGHT,
        WIDTH * top,
        WIDTH * botton,
        SHADOW
      );
    }]
  ] as const
  
  // progress = 0.8
  
  for (let item of points) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0])
      ;({ clipPathRemain, clipPathFlip, boxShadow, transform } = item[2](fullProgress))
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
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
};

const updateDemoBook4 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30
  const ROOT = ".sample-book4";

  let clipPathRemain: any, clipPathFlip: any, boxShadow: any, transform: any;

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
      ;({ clipPathRemain, clipPathFlip, boxShadow, transform } = item[2](fullProgress))
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
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .masked-front")).forEach(
    (i) => {
      i.style.clipPath = clipPathFlip;
    }
  );
  Array.from(document.querySelectorAll<HTMLDivElement>(ROOT + " .transformed-front")).forEach(
    (i) => {
      i.style.transform = transform;
    }
  );
};

const fpxRatio = 1;

const duration = 40000 * fpxRatio;
const start = Date.now();

let i = 0;

const tick = () => {
  i++;

  if (i % fpxRatio === 0) {
    const diff = Date.now() - start;
    const progress =
      (Math.sin((diff / duration) * 2 * Math.PI + (Math.PI / 2) * 0.98) + 1) /
      2;
    updateDemoBook(progress);
    updateDemoBook2(progress)
    updateDemoBook3(progress)
    updateDemoBook4(progress)
  }
  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
