import "./style.css";
import { pos } from "./utils/coordinate-utils.ts";
import {
  EffectStyle,
  createEffectLeft,
  createEffectRight,
  getEffectLeft,
  getEffectLeftBottom,
  getEffectLeftTop,
  getEffectRight,
  getEffectRightBottom,
  getEffectRightTop,
} from "./utils/effects.ts";

const template = (className: string) => `
<div class="wrap ${className}">
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
`

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <button id="toggle">pause/play</button> <br>
  ${template('sample-book')}
  ${template('sample-book2')}
  ${template('sample-book3')}
  ${template('sample-book4')}
  <div>
    <label>
      <input id="sample-book5-max-angle" type="range" max="90" min="0" value="45" />
      Max angle
    </label> <br>
    <label>
      <input id="sample-book5-y" type="range" max="100" min="0" value="100" />
      yPos
    </label> <br>
    <label>
      <input id="progress" type="range" max="100" min="0" value="0" />
      progress
    </label>
  </div>
  ${template('sample-book5')}
  ${template('sample-book6')}
`;

type EffectStep = [
  start: number,
  end: number,
  handler: (progress: number) => EffectStyle
];

const applyStyle = (rootSelector: string, style: EffectStyle) => {
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .shadowed-front")
    .forEach((i) => {
      i.style.boxShadow = style.boxShadow;
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .masked-back")
    .forEach((i) => {
      i.style.clipPath = style.clipPathRemain;
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .masked-shadow")
    .forEach((i) => {
      i.style.clipPath = style.clipPathFlipShadow;
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .masked-front")
    .forEach((i) => {
      i.style.clipPath = style.clipPathFlip;
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .masked-effect")
    .forEach((i) => {
      i.style.clipPath = style.clipPathEffect;
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .transformed-front")
    .forEach((i) => {
      i.style.transform = style.transformFlip;
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .transformed-effect")
    .forEach((i) => {
      i.style.transform = style.transformEffect + ' translateZ(0px)';
    });
}

const updateBook = (root: string, progress: number, timeline: EffectStep[]) => {
  let style: EffectStyle | null = null

  for (let item of timeline) {
    if (item[0] <= progress && progress <= item[1]) {
      const fullProgress = (progress - item[0]) / (item[1] - item[0]);
      style = item[2](fullProgress);
      break;
    }
  }

  if (style != null) {
    applyStyle(root, style)
  }
};

const updateDemoBook = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30;
  const ROOT = ".sample-book";

  updateBook(ROOT, progress, [
    [
      0,
      0.1,
      (_fullProgress: number) => {
        const top = 0;
        const left = 0;
        return getEffectLeftTop(
          WIDTH,
          HEIGHT,
          HEIGHT * left,
          WIDTH * top,
          SHADOW
        );
      },
    ],
    [
      0.1,
      0.3,
      (fullProgress: number) => {
        const top = fullProgress * 0.3;
        const left = fullProgress;
        return getEffectLeftTop(
          WIDTH,
          HEIGHT,
          HEIGHT * left,
          WIDTH * top,
          SHADOW
        );
      },
    ],
    [
      0.3,
      0.9,
      (fullProgress: number) => {
        const top = 0.3 + fullProgress * 0.7;
        const bottom = fullProgress * 1;

        return getEffectLeft(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
    [
      0.9,
      1,
      (_fullProgress: number) => {
        const top = 1;
        const bottom = 1;

        return getEffectLeft(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
  ]);
};

const updateDemoBook2 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30;
  const ROOT = ".sample-book2";

  updateBook(ROOT, progress, [
    [
      0,
      0.1,
      (_fullProgress: number) => {
        const top = 1;
        const right = 0;
        return getEffectRightTop(
          WIDTH,
          HEIGHT,
          HEIGHT * right,
          WIDTH * top,
          SHADOW
        );
      },
    ],
    [
      0.1,
      0.3,
      (fullProgress: number) => {
        const top = 1 - fullProgress * 0.3;
        const right = fullProgress;
        return getEffectRightTop(
          WIDTH,
          HEIGHT,
          HEIGHT * right,
          WIDTH * top,
          SHADOW
        );
      },
    ],
    [
      0.3,
      0.9,
      (fullProgress: number) => {
        const top = 1 - (0.3 + fullProgress * 0.7);
        const bottom = 1 - fullProgress * 1;

        return getEffectRight(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
    [
      0.9,
      1,
      (_fullProgress: number) => {
        const top = 0;
        const bottom = 0;

        return getEffectRight(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
  ]);
};

const updateDemoBook3 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30;
  const ROOT = ".sample-book3";

  updateBook(ROOT, progress, [
    [
      0,
      0.1,
      (_fullProgress: number) => {
        const bottom = 0;
        const left = 1;
        return getEffectLeftBottom(
          WIDTH,
          HEIGHT,
          HEIGHT * left,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
    [
      0.1,
      0.3,
      (fullProgress: number) => {
        const bottom = fullProgress * 0.3;
        const left = 1 - fullProgress;
        return getEffectLeftBottom(
          WIDTH,
          HEIGHT,
          HEIGHT * left,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
    [
      0.3,
      0.9,
      (fullProgress: number) => {
        const top = fullProgress * 1;
        const bottom = 0.3 + fullProgress * 0.7;

        return getEffectLeft(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
    [
      0.9,
      1,
      (_fullProgress: number) => {
        const top = 1;
        const bottom = 1;

        return getEffectLeft(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
  ]);
};

const updateDemoBook4 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30;
  const ROOT = ".sample-book4";

  updateBook(ROOT, progress, [
    [
      0,
      0.1,
      (_fullProgress: number) => {
        const top = 1;
        const right = 1;
        return getEffectRightBottom(
          WIDTH,
          HEIGHT,
          HEIGHT * right,
          WIDTH * top,
          SHADOW
        );
      },
    ],
    [
      0.1,
      0.3,
      (fullProgress: number) => {
        const top = 1 - fullProgress * 0.3;
        const right = 1 - fullProgress;
        return getEffectRightBottom(
          WIDTH,
          HEIGHT,
          HEIGHT * right,
          WIDTH * top,
          SHADOW
        );
      },
    ],
    [
      0.3,
      0.9,
      (fullProgress: number) => {
        const bottom = 1 - (0.3 + fullProgress * 0.7);
        const top = 1 - fullProgress * 1;

        return getEffectRight(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
    [
      0.9,
      1,
      (_fullProgress: number) => {
        const bottom = 0;
        const top = 0;

        return getEffectRight(
          WIDTH,
          HEIGHT,
          WIDTH * top,
          WIDTH * bottom,
          SHADOW
        );
      },
    ],
  ]);
};

const updateDemoBook5 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30;
  const ROOT = ".sample-book5";

  const valueMaxAngle = Number(document.querySelector<HTMLInputElement>('#sample-book5-max-angle')?.value)


  const valuePos = Number(document.querySelector<HTMLInputElement>('#sample-book5-y')?.value)

  const ratio = (valuePos - 50) / 50 * -1

  const initialAngle = (Math.PI * 2) / 360 * valueMaxAngle * ratio
  const targetAngle = 0
  const currentAngle = targetAngle * progress + initialAngle * (1 - progress)
  const currentCenter = ratio < 0 
    ? pos(WIDTH * progress, HEIGHT)
    : pos(WIDTH * progress, 0)
  const effect = createEffectLeft(WIDTH, HEIGHT, currentCenter[0], currentCenter[1], currentAngle, SHADOW)
  applyStyle(ROOT, effect)

};

const updateDemoBook6 = (progress: number) => {
  const WIDTH = 300;
  const HEIGHT = 400;
  const SHADOW = 30;
  const ROOT = ".sample-book6";

  const valueMaxAngle = Number(document.querySelector<HTMLInputElement>('#sample-book5-max-angle')?.value)


  const valuePos = Number(document.querySelector<HTMLInputElement>('#sample-book5-y')?.value)

  const ratio = (valuePos - 50) / 50 * 1

  const initialAngle = (Math.PI * 2) / 360 * valueMaxAngle * ratio
  const targetAngle = 0
  const currentAngle = targetAngle * progress + initialAngle * (1 - progress)
  const currentCenter = ratio < 0 
    ? pos(WIDTH * (1 - progress), 0)
    : pos(WIDTH * (1 - progress), HEIGHT)
  const effect = createEffectRight(WIDTH, HEIGHT, currentCenter[0], currentCenter[1], currentAngle, SHADOW)
  applyStyle(ROOT, effect)

};
const fpxRatio = 1;

const duration = 16000 * fpxRatio;
const start = Date.now();

let i = 0;

let id: ReturnType<typeof requestAnimationFrame> | null = null;


const updateProgress = (progress: number) => {
  updateDemoBook(progress);
  updateDemoBook2(progress);
  updateDemoBook3(progress);
  updateDemoBook4(progress);
  updateDemoBook5(progress);
  updateDemoBook6(progress);
}
const tick = () => {
  i++;

  if (i % fpxRatio === 0) {
    const diff = Date.now() - start;
    const progress =
      (Math.sin((diff / duration) * 2 * Math.PI - Math.PI / 2) + 1) / 2;
      updateProgress(progress)
  }
  id = requestAnimationFrame(tick);
};

id = requestAnimationFrame(tick);

document.getElementById("toggle")?.addEventListener("click", () => {
  if (id == null) {
    id = requestAnimationFrame(tick);
  } else {
    cancelAnimationFrame(id);
    id = null;
  }
});

document.querySelector('#progress')?.addEventListener('input', (ev) => {
  const progress = Number((ev.currentTarget as HTMLInputElement).value) / 100
  updateProgress(progress)
})
