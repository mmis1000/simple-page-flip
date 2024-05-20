import {
  pos,
  genReflectMatrix,
  toCSSMatrix,
  toCSSNumber,
  expandPolygon,
  insertLineToPolygon,
  line,
  applyReverseTransform,
  posAdd,
  applyTransform,
  genMatrix,
  Pos,
  toClipPath,
  intersection,
} from "./coordinate-utils";

import * as glMatrix from "gl-matrix";

const SHADOW_SIZE_TOLERANCE = 1.3;

export interface EffectStyle {
  flipFront: Partial<CSSStyleDeclaration>
  flipBack: Partial<CSSStyleDeclaration>
  flipShadow: Partial<CSSStyleDeclaration>
  flipEffect: Partial<CSSStyleDeclaration>
}

const formatStyle = (
  matrixFlip: glMatrix.mat3,
  polygonRemain: Pos[],
  boxShadowWidth: number,
  polygonFlip: Pos[],
  polygonFlipShadow: Pos[],
  matrixEffect: glMatrix.mat3,
  polygonEffect: Pos[],
): EffectStyle => {
  const transformFlip = toCSSMatrix(matrixFlip);
  const clipPathRemain = toClipPath(polygonRemain);
  const boxShadow = `0px 0px calc(var(--scale-px, 1px) * ${toCSSNumber(
    boxShadowWidth
  )}) 0px rgba(0, 0, 0, 1)`;
  const clipPathFlip = toClipPath(polygonFlip);
  const clipPathFlipShadow = toClipPath(polygonFlipShadow);
  const transformEffect = toCSSMatrix(matrixEffect);
  const clipPathEffect = toClipPath(polygonEffect);
  return {
    flipFront: {
      clipPath: clipPathRemain
    },
    flipBack: {
      transform: transformFlip,
      clipPath: clipPathFlip
    },
    flipEffect: matrixEffect.includes(NaN) ? {
      display: 'none'
    } : {
      display: '',
      transform: transformEffect,
      clipPath: clipPathEffect
    },
    flipShadow: {
      boxShadow: boxShadow,
      transform: transformFlip,
      clipPath: clipPathFlipShadow
    }
  };
}

export const getEffectLeftTop = (
  width: number,
  height: number,
  leftOffset: number,
  topOffset: number,
  maxShadowWidth: number
): EffectStyle => {
  const posTop = pos(topOffset, 0);
  const posLeft = pos(0, leftOffset);
  const matrixFlip = genReflectMatrix(posTop, posLeft);

  const polygonRemain = [
    posTop,
    posLeft,
    pos(0, height),
    pos(width, height),
    pos(width, 0),
  ];

  const boxShadowWidth = Math.min(leftOffset, topOffset, maxShadowWidth);

  const polygonFlip = [posTop, posLeft, pos(0, 0)];

  let polygonFlipShadow =
    leftOffset >= topOffset
      ? expandPolygon(polygonFlip, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygonFlip, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  polygonFlipShadow = insertLineToPolygon(
    polygonFlipShadow,
    line(
      polygonFlip[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygonFlip[0], matrixFlip), pos(10, 0)),
        matrixFlip
      )
    ),
    0
  );

  if (leftOffset >= topOffset) {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[1], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      2
    );
  } else {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[2], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      3
    );
  }

  const posVector = glMatrix.vec2.fromValues(-1, 0);

  glMatrix.vec2.normalize(posVector, posVector);

  const shadowDirection = pos(posTop[1] - posLeft[1], posLeft[0] - posTop[0]);

  glMatrix.vec2.normalize(shadowDirection, shadowDirection);
  const lengthRatio =
    1 /
    (Math.abs(
      shadowDirection[0] * posVector[0] + shadowDirection[1] * posVector[1]
    ) /
      (shadowDirection[0] * shadowDirection[0] +
        shadowDirection[1] * shadowDirection[1]) **
        0.5);

  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth * lengthRatio);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixFlip),
    applyTransform(posLeft, matrixFlip),
    applyTransform(posAdd(posTop, posVector as Pos), matrixFlip)
  );

  const polygonEffect = polygonFlip
    .map((i) => {
      return applyTransform(i, matrixFlip);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  return formatStyle(
    matrixFlip,
    polygonRemain,
    boxShadowWidth,
    polygonFlip,
    polygonFlipShadow,
    matrixEffect,
    polygonEffect,
  )
};
export const getEffectRightTop = (
  width: number,
  height: number,
  rightOffset: number,
  topOffset: number,
  maxShadowWidth: number
): EffectStyle => {
  const posTop = pos(topOffset, 0);
  const posRight = pos(width, rightOffset);
  const matrixFlip = genReflectMatrix(posTop, posRight);

  const polygonRemain = [
    posTop,
    posRight,
    pos(width, height),
    pos(0, height),
    pos(0, 0),
  ];

  const boxShadowWidth = Math.min(
    rightOffset,
    width - topOffset,
    maxShadowWidth
  );

  const polygonFlip = [posTop, posRight, pos(width, 0)];


  let polygonFlipShadow =
    rightOffset >= width - topOffset
      ? expandPolygon(polygonFlip, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygonFlip, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  polygonFlipShadow = insertLineToPolygon(
    polygonFlipShadow,
    line(
      polygonFlip[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygonFlip[0], matrixFlip), pos(10, 0)),
        matrixFlip
      )
    ),
    0
  );

  if (rightOffset >= width - topOffset) {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[1], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      2
    );
  } else {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[2], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      3
    );
  }


  const posVector = glMatrix.vec2.fromValues(1, 0);

  glMatrix.vec2.normalize(posVector, posVector);

  const shadowDirection = pos(posTop[1] - posRight[1], posRight[0] - posTop[0]);

  glMatrix.vec2.normalize(shadowDirection, shadowDirection);
  const lengthRatio =
    1 /
    (Math.abs(
      shadowDirection[0] * posVector[0] + shadowDirection[1] * posVector[1]
    ) /
      (shadowDirection[0] * shadowDirection[0] +
        shadowDirection[1] * shadowDirection[1]) **
        0.5);

  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth * lengthRatio);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixFlip),
    applyTransform(posRight, matrixFlip),
    applyTransform(posAdd(posTop, posVector as Pos), matrixFlip)
  );


  const polygonEffect = polygonFlip
    .map((i) => {
      return applyTransform(i, matrixFlip);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });


  return formatStyle(
    matrixFlip,
    polygonRemain,
    boxShadowWidth,
    polygonFlip,
    polygonFlipShadow,
    matrixEffect,
    polygonEffect,
  )
};
export const getEffectLeft = (
  width: number,
  height: number,
  topOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
): EffectStyle => {
  const posTop = pos(topOffset, 0);
  const posBottom = pos(bottomOffset, height);
  const matrixFlip = genReflectMatrix(posTop, posBottom);

  const polygonRemain = [posTop, pos(width, 0), pos(width, height), posBottom];


  const boxShadowWidth = Math.min(
    Math.max(topOffset, bottomOffset),
    Math.max(width - topOffset, width - bottomOffset),
    maxShadowWidth
  );


  const polygonFlip = [posTop, pos(0, 0), pos(0, height), posBottom];

  let polygonFlipShadow =
    topOffset > bottomOffset
      ? expandPolygon(polygonFlip, [0, 1], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygonFlip, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  if (topOffset > bottomOffset) {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[0],
        applyReverseTransform(pos(polygonFlip[0][0] + 10, polygonFlip[0][1]), matrixFlip)
      ),
      0
    );
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[2],
        applyReverseTransform(
          posAdd(applyTransform(polygonFlip[2], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      3
    );
  } else {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[3],
        applyReverseTransform(pos(polygonFlip[3][0] + 10, polygonFlip[3][1]), matrixFlip)
      ),
      3
    );
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[1],
        applyReverseTransform(
          posAdd(applyTransform(polygonFlip[1], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      1
    );
  }


  const posVector = glMatrix.vec2.fromValues(-1, 0);

  glMatrix.vec2.normalize(posVector, posVector);

  const shadowDirection = pos(
    posTop[1] - posBottom[1],
    posBottom[0] - posTop[0]
  );

  glMatrix.vec2.normalize(shadowDirection, shadowDirection);
  const lengthRatio =
    1 /
    (Math.abs(
      shadowDirection[0] * posVector[0] + shadowDirection[1] * posVector[1]
    ) /
      (shadowDirection[0] * shadowDirection[0] +
        shadowDirection[1] * shadowDirection[1]) **
        0.5);

  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth * lengthRatio);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixFlip),
    applyTransform(posBottom, matrixFlip),
    applyTransform(posAdd(posTop, posVector as Pos), matrixFlip)
  );


  const polygonEffect = polygonFlip
    .map((i) => {
      return applyTransform(i, matrixFlip);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });


  return formatStyle(
    matrixFlip,
    polygonRemain,
    boxShadowWidth,
    polygonFlip,
    polygonFlipShadow,
    matrixEffect,
    polygonEffect,
  )
};
export const getEffectRight = (
  width: number,
  height: number,
  topOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
): EffectStyle => {
  const posTop = pos(topOffset, 0);
  const posBottom = pos(bottomOffset, height);
  const matrixFlip = genReflectMatrix(posTop, posBottom);

  const polygonRemain = [posTop, pos(0, 0), pos(0, height), posBottom];


  const boxShadowWidth = Math.min(
    Math.max(width - topOffset, width - bottomOffset),
    Math.max(topOffset, bottomOffset),
    maxShadowWidth
  );


  const polygonFlip = [posTop, pos(width, 0), pos(width, height), posBottom];


  let polygonFlipShadow =
    width - topOffset > width - bottomOffset
      ? expandPolygon(polygonFlip, [0, 1], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygonFlip, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  if (width - topOffset > width - bottomOffset) {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[0],
        applyReverseTransform(pos(polygonFlip[0][0] + 10, polygonFlip[0][1]), matrixFlip)
      ),
      0
    );
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[2],
        applyReverseTransform(
          posAdd(applyTransform(polygonFlip[2], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      3
    );
  } else {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[3],
        applyReverseTransform(pos(polygonFlip[3][0] + 10, polygonFlip[3][1]), matrixFlip)
      ),
      3
    );
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[1],
        applyReverseTransform(
          posAdd(applyTransform(polygonFlip[1], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      1
    );
  }


  const posVector = glMatrix.vec2.fromValues(1, 0);

  glMatrix.vec2.normalize(posVector, posVector);

  const shadowDirection = pos(
    posTop[1] - posBottom[1],
    posBottom[0] - posTop[0]
  );

  glMatrix.vec2.normalize(shadowDirection, shadowDirection);
  const lengthRatio =
    1 /
    (Math.abs(
      shadowDirection[0] * posVector[0] + shadowDirection[1] * posVector[1]
    ) /
      (shadowDirection[0] * shadowDirection[0] +
        shadowDirection[1] * shadowDirection[1]) **
        0.5);

  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth * lengthRatio);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixFlip),
    applyTransform(posBottom, matrixFlip),
    applyTransform(posAdd(posTop, posVector as Pos), matrixFlip)
  );


  const polygonEffect = polygonFlip
    .map((i) => {
      return applyTransform(i, matrixFlip);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });


  return formatStyle(
    matrixFlip,
    polygonRemain,
    boxShadowWidth,
    polygonFlip,
    polygonFlipShadow,
    matrixEffect,
    polygonEffect,
  )
};
export const getEffectLeftBottom = (
  width: number,
  height: number,
  leftOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
): EffectStyle => {
  const posBottom = pos(bottomOffset, height);
  const posLeft = pos(0, leftOffset);
  const matrixFlip = genReflectMatrix(posBottom, posLeft);

  const polygonRemain = [
    posBottom,
    posLeft,
    pos(0, 0),
    pos(width, 0),
    pos(width, height),
  ];

  const boxShadowWidth = Math.min(
    height - leftOffset,
    bottomOffset,
    maxShadowWidth
  );

  const polygonFlip = [posBottom, posLeft, pos(0, height)];

  let polygonFlipShadow =
    height - leftOffset >= bottomOffset
      ? expandPolygon(polygonFlip, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygonFlip, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  polygonFlipShadow = insertLineToPolygon(
    polygonFlipShadow,
    line(
      polygonFlip[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygonFlip[0], matrixFlip), pos(10, 0)),
        matrixFlip
      )
    ),
    0
  );

  if (height - leftOffset >= bottomOffset) {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[1], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      2
    );
  } else {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[2], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      3
    );
  }


  const posVector = glMatrix.vec2.fromValues(-1, 0);

  glMatrix.vec2.normalize(posVector, posVector);

  const shadowDirection = pos(
    posLeft[1] - posBottom[1],
    posBottom[0] - posLeft[0]
  );

  glMatrix.vec2.normalize(shadowDirection, shadowDirection);
  const lengthRatio =
    1 /
    (Math.abs(
      shadowDirection[0] * posVector[0] + shadowDirection[1] * posVector[1]
    ) /
      (shadowDirection[0] * shadowDirection[0] +
        shadowDirection[1] * shadowDirection[1]) **
        0.5);

  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth * lengthRatio);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, height),
    applyTransform(posLeft, matrixFlip),
    applyTransform(posBottom, matrixFlip),
    applyTransform(posAdd(posBottom, posVector as Pos), matrixFlip)
  );


  const polygonEffect = polygonFlip
    .map((i) => {
      return applyTransform(i, matrixFlip);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });


  return formatStyle(
    matrixFlip,
    polygonRemain,
    boxShadowWidth,
    polygonFlip,
    polygonFlipShadow,
    matrixEffect,
    polygonEffect,
  )
};
export const getEffectRightBottom = (
  width: number,
  height: number,
  rightOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
): EffectStyle => {
  const posBottom = pos(bottomOffset, height);
  const posRight = pos(width, rightOffset);
  const matrixFlip = genReflectMatrix(posBottom, posRight);

  const polygonRemain = [
    posBottom,
    posRight,
    pos(width, 0),
    pos(0, 0),
    pos(0, height),
  ];


  const boxShadowWidth = Math.min(
    height - rightOffset,
    width - bottomOffset,
    maxShadowWidth
  );

  const polygonFlip = [posBottom, posRight, pos(width, height)];


  let polygonFlipShadow =
    height - rightOffset >= width - bottomOffset
      ? expandPolygon(polygonFlip, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygonFlip, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  polygonFlipShadow = insertLineToPolygon(
    polygonFlipShadow,
    line(
      polygonFlip[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygonFlip[0], matrixFlip), pos(10, 0)),
        matrixFlip
      )
    ),
    0
  );

  if (height - rightOffset >= width - bottomOffset) {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[1], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      2
    );
  } else {
    polygonFlipShadow = insertLineToPolygon(
      polygonFlipShadow,
      line(
        polygonFlip[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygonFlip[2], matrixFlip), pos(10, 0)),
          matrixFlip
        )
      ),
      3
    );
  }


  const posVector = glMatrix.vec2.fromValues(1, 0);

  glMatrix.vec2.normalize(posVector, posVector);

  const shadowDirection = pos(
    posRight[1] - posBottom[1],
    posBottom[0] - posRight[0]
  );

  glMatrix.vec2.normalize(shadowDirection, shadowDirection);
  const lengthRatio =
    1 /
    (Math.abs(
      shadowDirection[0] * posVector[0] + shadowDirection[1] * posVector[1]
    ) /
      (shadowDirection[0] * shadowDirection[0] +
        shadowDirection[1] * shadowDirection[1]) **
        0.5);

  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth * lengthRatio);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, height),
    applyTransform(posRight, matrixFlip),
    applyTransform(posBottom, matrixFlip),
    applyTransform(posAdd(posBottom, posVector as Pos), matrixFlip)
  );


  const polygonEffect = polygonFlip
    .map((i) => {
      return applyTransform(i, matrixFlip);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });


  return formatStyle(
    matrixFlip,
    polygonRemain,
    boxShadowWidth,
    polygonFlip,
    polygonFlipShadow,
    matrixEffect,
    polygonEffect,
  )
};

/**
 *
 * @param width
 * @param height
 * @param centerX
 * @param centerY
 * @param angle tilting of the page flip, between `-Math.PI / 2` and `Math.PI / 2`.
 *              positive for clockwise, negative for counter clockwise
 * @param maxShadowWidth
 */
export const createEffectLeft = (
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  angle: number,
  maxShadowWidth: number
) => {
  const angleLine = Math.PI / 2 + angle;
  const vector = pos(Math.cos(angleLine), Math.sin(angleLine));
  const lineStart = pos(centerX, centerY);
  const lineTo = posAdd(lineStart, vector);
  const lineSplit = line(lineStart, lineTo);

  const leftTop = pos(0, 0);
  const leftBottom = pos(0, height);
  const rightTop = pos(width, 0);
  const rightBottom = pos(width, height);

  const lineTop = line(leftTop, rightTop);
  const lineRight = line(rightTop, rightBottom);
  const lineBottom = line(rightBottom, leftBottom);
  const lineLeft = line(leftBottom, leftTop);

  const resTop = intersection(lineTop, lineSplit);
  const resRight = intersection(lineRight, lineSplit);
  const resBottom = intersection(lineBottom, lineSplit);
  const resLeft = intersection(lineLeft, lineSplit);

  if (resTop?.hitLine1 && resLeft?.hitLine1) {
    return getEffectLeftTop(
      width,
      height,
      resLeft.pos[1],
      resTop.pos[0],
      maxShadowWidth
    );
  } else if (resTop?.hitLine1 && resBottom?.hitLine1) {
    return getEffectLeft(
      width,
      height,
      resTop.pos[0],
      resBottom.pos[0],
      maxShadowWidth
    );
  } else if (resLeft?.hitLine1 && resBottom?.hitLine1) {
    return getEffectLeftBottom(
      width,
      height,
      resLeft.pos[1],
      resBottom.pos[0],
      maxShadowWidth
    );
  } else if (resLeft?.hitLine1 && resRight?.hitLine1) {
    // we clipped into from left to right incorrectly
    //   ┌─────────────┐
    //   │             │
    //   │             │
    //   │             xxxx
    //   │         xxxx│
    //   │     xxxx    │
    //   │ xxxx        │
    // xxxx            │
    //   │             │
    //   └─────────────┘

    // to decide how to fix it, we check which side is higher and move point in right edge to correspond position
    if (resLeft.pos[1] < resRight.pos[1]) {
      return getEffectLeftTop(
        width,
        height,
        resLeft.pos[1],
        width,
        maxShadowWidth
      );
    } else {
      return getEffectLeftBottom(
        width,
        height,
        resLeft.pos[1],
        width,
        maxShadowWidth
      );
    }
  } else if (resTop?.hitLine1 && resRight?.hitLine1) {
    //       x
    // ┌──────x──────┐
    // │       x     │
    // │        x    │
    // │         x   │
    // │          x  │
    // │           x │
    // │            x│
    // │             x
    // │             │x
    // └─────────────┘ x

    return getEffectLeft(width, height, resTop.pos[0], width, maxShadowWidth);
  } else if (resBottom?.hitLine1 && resRight?.hitLine1) {
    //  ┌────────────┐
    //  │            │
    //  │            │
    //  │            │
    //  │            │ x
    //  │            │x
    //  │            x
    //  │           x│
    //  │          x │
    //  └─────────x──┘
    //           x

    return getEffectLeft(
      width,
      height,
      width,
      resBottom.pos[0],
      maxShadowWidth
    );
  } else {
    console.warn("invalid style result");
    
    return {
      flipFront: {
      },
      flipBack: {
      },
      flipEffect: {
      },
      flipShadow: {
      }
    } satisfies EffectStyle;
  }
};

/**
 *
 * @param width
 * @param height
 * @param centerX
 * @param centerY
 * @param angle tilting of the page flip, between `-Math.PI / 2` and `Math.PI / 2`.
 *              positive for clockwise, negative for counter clockwise
 * @param maxShadowWidth
 */
export const createEffectRight = (
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  angle: number,
  maxShadowWidth: number
) => {
  const angleLine = Math.PI / 2 + angle;
  const vector = pos(Math.cos(angleLine), Math.sin(angleLine));
  const lineStart = pos(centerX, centerY);
  const lineTo = posAdd(lineStart, vector);
  const lineSplit = line(lineStart, lineTo);

  const leftTop = pos(0, 0);
  const leftBottom = pos(0, height);
  const rightTop = pos(width, 0);
  const rightBottom = pos(width, height);

  const lineTop = line(leftTop, rightTop);
  const lineRight = line(rightTop, rightBottom);
  const lineBottom = line(rightBottom, leftBottom);
  const lineLeft = line(leftBottom, leftTop);

  const resTop = intersection(lineTop, lineSplit);
  const resRight = intersection(lineRight, lineSplit);
  const resBottom = intersection(lineBottom, lineSplit);
  const resLeft = intersection(lineLeft, lineSplit);

  if (resTop?.hitLine1 && resRight?.hitLine1) {
    return getEffectRightTop(
      width,
      height,
      resRight.pos[1],
      resTop.pos[0],
      maxShadowWidth
    );
  } else if (resTop?.hitLine1 && resBottom?.hitLine1) {
    return getEffectRight(
      width,
      height,
      resTop.pos[0],
      resBottom.pos[0],
      maxShadowWidth
    );
  } else if (resRight?.hitLine1 && resBottom?.hitLine1) {
    return getEffectRightBottom(
      width,
      height,
      resRight.pos[1],
      resBottom.pos[0],
      maxShadowWidth
    );
  } else if (resLeft?.hitLine1 && resRight?.hitLine1) {
    // we clipped into from left to right incorrectly
    //   ┌─────────────┐
    //   │             │
    //   │             │
    //   │             xxxx
    //   │         xxxx│
    //   │     xxxx    │
    //   │ xxxx        │
    // xxxx            │
    //   │             │
    //   └─────────────┘

    // to decide how to fix it, we check which side is higher and move point in right edge to correspond position
    if (resLeft.pos[1] < resRight.pos[1]) {
      return getEffectRightBottom(
        width,
        height,
        resRight.pos[1],
        width,
        maxShadowWidth
      );
    } else {
      return getEffectRightTop(
        width,
        height,
        resRight.pos[1],
        width,
        maxShadowWidth
      );
    }
  } else if (resTop?.hitLine1 && resLeft?.hitLine1) {
    //       x
    // ┌────x────────┐
    // │   x         │
    // │  x          │
    // │ x           │
    // │x            │
    // x             │
    // │             │
    // │             │
    // │             │
    // └─────────────┘

    return getEffectRight(width, height, resTop.pos[0], 0, maxShadowWidth);
  } else if (resBottom?.hitLine1 && resLeft?.hitLine1) {
    //  ┌────────────┐
    //  │            │
    //  │            │
    //  │            │
    //  │            │
    // x│            │
    //  x            │
    //  │x           │
    //  │ x          │
    //  └──x─────────┘
    //      x

    return getEffectRight(width, height, 0, resBottom.pos[0], maxShadowWidth);
  } else {
    console.warn("invalid style result");
    return {
      flipFront: {
        clipPath: 'none'
      },
      flipBack: {
        transform: 'none',
        clipPath: 'none'
      },
      flipEffect: {
        transform: 'none',
        clipPath: 'none'
      },
      flipShadow: {
        boxShadow: 'none',
        transform: 'none',
        clipPath: 'none'
      }
    } satisfies EffectStyle;
  }
};
