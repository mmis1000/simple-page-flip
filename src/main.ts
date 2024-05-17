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
<div class="desk">
  <div class="wrap ${className}">
    <div class="item-layer layer-under">
      <div class="item-wrap">
        <div class="item">
          <div class="text-placeholder"></div>
        </div>
      </div>
    </div>
    <div class="item-layer layer-flip-front">
      <div class="item-wrap">
        <div class="item">
          The<br>
          &nbsp&nbspBook Title
        </div>
      </div>
    </div>
    <div class="item-layer layer-shadow">
      <div class="item-wrap">
        <div class="item"></div>
      </div>
    </div>
    <div class="item-layer layer-flip-back">
      <div class="item-wrap">
        <div class="item"><div class="text-placeholder"></div></div>
      </div>
    </div>
    <div class="item-layer layer-effect">
      <div class="item-wrap">
        <div class="item"></div>
      </div>
    </div>
  </div>
</div>
`

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Flip effects</h1>
  <button class="toggle">Pause</button> <br>
  <h2>Left top to right bottom</h2>
  ${template('sample-book')}
  <h2>Right top to left bottom</h2>
  ${template('sample-book2')}
  <h2>Left bottom to right top</h2>
  ${template('sample-book3')}
  <h2>Right bottom to left top</h2>
  ${template('sample-book4')}
  <div>
    <button class="toggle">Pause</button> <br>
    <label>
      <input id="sample-book-initial-angle" type="range" max="90" min="0" value="45" />
      Initial angle
    </label> <br>
    <label>
      <input id="sample-book-target-angle" type="range" max="90" min="0" value="0" />
      Target angle
    </label> <br>
    <label>
      <input id="sample-book-y" type="range" max="100" min="0" value="100" />
      yPos
    </label> <br>
    <label>
      <input id="progress" type="range" max="100" min="0" value="0" />
      progress
    </label>
  </div>
  <h2>Integrated left to right</h2>
  ${template('sample-book5')}
  <h2>Integrated right to left</h2>
  ${template('sample-book6')}
`;

type EffectStep = [
  start: number,
  end: number,
  handler: (progress: number) => EffectStyle
];

const applyStyle = (rootSelector: string, style: EffectStyle) => {
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .layer-flip-front .item-wrap")
    .forEach((i) => {
      Object.assign(i.style, style.flipFront)
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .layer-flip-back .item-wrap")
    .forEach((i) => {
      Object.assign(i.style, style.flipBack)
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .layer-shadow .item-wrap")
    .forEach((i) => {
      Object.assign(i.style, style.flipShadow)
    });
  document
    .querySelectorAll<HTMLDivElement>(rootSelector + " .layer-effect .item-wrap")
    .forEach((i) => {
      Object.assign(i.style, style.flipEffect)
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

  const valueInitialAngle = Number(document.querySelector<HTMLInputElement>('#sample-book-initial-angle')?.value)
  const valueTargetAngle = Number(document.querySelector<HTMLInputElement>('#sample-book-target-angle')?.value)

  const valuePos = Number(document.querySelector<HTMLInputElement>('#sample-book-y')?.value)

  const ratio = (valuePos - 50) / 50 * -1

  const initialAngle = (Math.PI * 2) / 360 * valueInitialAngle * ratio
  const targetAngle = (Math.PI * 2) / 360 * -valueTargetAngle * ratio
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

  const valueInitialAngle = Number(document.querySelector<HTMLInputElement>('#sample-book-initial-angle')?.value)
  const valueTargetAngle = Number(document.querySelector<HTMLInputElement>('#sample-book-target-angle')?.value)

  const valuePos = Number(document.querySelector<HTMLInputElement>('#sample-book-y')?.value)

  const ratio = (valuePos - 50) / 50 * 1

  const initialAngle = (Math.PI * 2) / 360 * valueInitialAngle * ratio
  const targetAngle = (Math.PI * 2) / 360 * -valueTargetAngle * ratio
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
let pausedAt = 0
let timeOffset = 0

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
    const diff = (Date.now() + timeOffset) - start;
    const progress =
      (Math.sin((diff / duration) * 2 * Math.PI - Math.PI / 2) + 1) / 2;
    updateProgress(progress)
  }
  id = requestAnimationFrame(tick);
};

id = requestAnimationFrame(tick);

document.querySelectorAll(".toggle").forEach(e => e.addEventListener("click", () => {
  if (id == null) {
    document.querySelectorAll(".toggle").forEach(i => i.textContent = 'Pause')
    const continueAt = Date.now()
    const diff = pausedAt - continueAt
    timeOffset = diff
    id = requestAnimationFrame(tick);
  } else {
    document.querySelectorAll(".toggle").forEach(i => i.textContent = 'Play')
    pausedAt = (Date.now() + timeOffset)
    cancelAnimationFrame(id);
    id = null;
  }
}));

document.querySelectorAll('#progress, #sample-book-initial-angle, #sample-book-target-angle, #sample-book-y')
  .forEach(e => {
    e.addEventListener('input', () => {
      const progress = Number(document.querySelector<HTMLInputElement>('#progress')!.value) / 100
      updateProgress(progress)
    })
  })
