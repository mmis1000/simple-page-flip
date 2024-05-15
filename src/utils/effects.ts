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
  clipPathRemain: string;
  clipPathFlipShadow: string;
  clipPathFlip: string;
  clipPathEffect: string;
  boxShadow: string;
  transformFlip: string;
  transformEffect: string;
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
  const matrixRaw = genReflectMatrix(posTop, posLeft);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posTop,
    posLeft,
    pos(0, height),
    pos(width, height),
    pos(width, 0),
  ];

  const clipPathRemain = toClipPath(polygonRemain);

  const boxShadowWidth = Math.min(leftOffset, topOffset, maxShadowWidth);
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, posLeft, pos(0, 0)];

  const clipPathFlip = toClipPath(polygon);

  let newPolygon =
    leftOffset >= topOffset
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygon = insertLineToPolygon(
    newPolygon,
    line(
      polygon[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygon[0], matrixRaw), pos(10, 0)),
        matrixRaw
      )
    ),
    0
  );

  if (leftOffset >= topOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[1], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      2
    );
  } else {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[2], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      3
    );
  }

  const clipPathFlipShadow = toClipPath(newPolygon);

  const posVector = glMatrix.vec2.fromValues(-1, 0);

  glMatrix.vec2.normalize(posVector, posVector);
  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixRaw),
    applyTransform(posLeft, matrixRaw),
    applyTransform(posAdd(posTop, posVector as Pos), matrixRaw)
  );

  const transformEffect = toCSSMatrix(matrixEffect);

  const effectPolygon = polygon
    .map((i) => {
      return applyTransform(i, matrixRaw);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  const clipPathEffect = toClipPath(effectPolygon);

  return {
    clipPathRemain,
    clipPathFlipShadow,
    clipPathFlip,
    clipPathEffect,
    boxShadow,
    transformFlip: transform,
    transformEffect,
  };
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
  const matrixRaw = genReflectMatrix(posTop, posRight);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posTop,
    posRight,
    pos(width, height),
    pos(0, height),
    pos(0, 0),
  ];

  const clipPathRemain = toClipPath(polygonRemain);

  const boxShadowWidth = Math.min(
    rightOffset,
    width - topOffset,
    maxShadowWidth
  );
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, posRight, pos(width, 0)];

  const clipPathFlip = toClipPath(polygon);

  let newPolygon =
    rightOffset >= width - topOffset
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygon = insertLineToPolygon(
    newPolygon,
    line(
      polygon[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygon[0], matrixRaw), pos(10, 0)),
        matrixRaw
      )
    ),
    0
  );

  if (rightOffset >= width - topOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[1], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      2
    );
  } else {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[2], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      3
    );
  }

  const clipPathFlipShadow = toClipPath(newPolygon);

  const posVector = glMatrix.vec2.fromValues(1, 0);

  glMatrix.vec2.normalize(posVector, posVector);
  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixRaw),
    applyTransform(posRight, matrixRaw),
    applyTransform(posAdd(posTop, posVector as Pos), matrixRaw)
  );

  const transformEffect = toCSSMatrix(matrixEffect);

  const effectPolygon = polygon
    .map((i) => {
      return applyTransform(i, matrixRaw);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  const clipPathEffect = toClipPath(effectPolygon);

  return {
    clipPathRemain,
    clipPathFlip,
    clipPathFlipShadow,
    clipPathEffect,
    boxShadow,
    transformFlip: transform,
    transformEffect,
  };
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
  const matrixRaw = genReflectMatrix(posTop, posBottom);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [posTop, pos(width, 0), pos(width, height), posBottom];

  const clipPathRemain = toClipPath(polygonRemain);

  const boxShadowWidth = Math.min(
    Math.max(topOffset, bottomOffset),
    Math.max(width - topOffset, width - bottomOffset),
    maxShadowWidth
  );

  const boxShadow = `0px 0px ${toCSSNumber(
    boxShadowWidth
  )}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, pos(0, 0), pos(0, height), posBottom];
  const clipPathFlip = toClipPath(polygon);

  let newPolygon =
    topOffset > bottomOffset
      ? expandPolygon(polygon, [0, 1], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  if (topOffset > bottomOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[0],
        applyReverseTransform(pos(polygon[0][0] + 10, polygon[0][1]), matrixRaw)
      ),
      0
    );
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[2],
        applyReverseTransform(
          posAdd(applyTransform(polygon[2], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      3
    );
  } else if (topOffset < bottomOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[3],
        applyReverseTransform(pos(polygon[3][0] + 10, polygon[3][1]), matrixRaw)
      ),
      3
    );
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[1],
        applyReverseTransform(
          posAdd(applyTransform(polygon[1], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      1
    );
  }

  const clipPathFlipShadow = toClipPath(newPolygon);

  const posVector = glMatrix.vec2.fromValues(-1, 0);

  glMatrix.vec2.normalize(posVector, posVector);
  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixRaw),
    applyTransform(posBottom, matrixRaw),
    applyTransform(posAdd(posTop, posVector as Pos), matrixRaw)
  );

  const transformEffect = toCSSMatrix(matrixEffect);

  const effectPolygon = polygon
    .map((i) => {
      return applyTransform(i, matrixRaw);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  const clipPathEffect = toClipPath(effectPolygon);

  return {
    clipPathRemain,
    clipPathFlipShadow,
    clipPathFlip,
    clipPathEffect,
    boxShadow,
    transformFlip: transform,
    transformEffect,
  };
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
  const matrixRaw = genReflectMatrix(posTop, posBottom);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [posTop, pos(0, 0), pos(0, height), posBottom];

  const clipPathRemain = toClipPath(polygonRemain);

  const boxShadowWidth = Math.min(
    Math.max(width - topOffset, width - bottomOffset),
    Math.max(topOffset, bottomOffset),
    maxShadowWidth
  );

  const boxShadow = `0px 0px ${toCSSNumber(
    boxShadowWidth
  )}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, pos(width, 0), pos(width, height), posBottom];

  const clipPathFlip = toClipPath(polygon);

  let newPolygon =
    width - topOffset > width - bottomOffset
      ? expandPolygon(polygon, [0, 1], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  if (width - topOffset > width - bottomOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[0],
        applyReverseTransform(pos(polygon[0][0] + 10, polygon[0][1]), matrixRaw)
      ),
      0
    );
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[2],
        applyReverseTransform(
          posAdd(applyTransform(polygon[2], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      3
    );
  } else if (width - topOffset < width - bottomOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[3],
        applyReverseTransform(pos(polygon[3][0] + 10, polygon[3][1]), matrixRaw)
      ),
      3
    );
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[1],
        applyReverseTransform(
          posAdd(applyTransform(polygon[1], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      1
    );
  }

  const clipPathFlipShadow = toClipPath(newPolygon);

  const posVector = glMatrix.vec2.fromValues(1, 0);

  glMatrix.vec2.normalize(posVector, posVector);
  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, 0),
    applyTransform(posTop, matrixRaw),
    applyTransform(posBottom, matrixRaw),
    applyTransform(posAdd(posTop, posVector as Pos), matrixRaw)
  );

  const transformEffect = toCSSMatrix(matrixEffect);

  const effectPolygon = polygon
    .map((i) => {
      return applyTransform(i, matrixRaw);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  const clipPathEffect = toClipPath(effectPolygon);

  return {
    clipPathRemain,
    clipPathFlipShadow,
    clipPathFlip,
    clipPathEffect,
    boxShadow,
    transformFlip: transform,
    transformEffect,
  };
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
  const matrixRaw = genReflectMatrix(posBottom, posLeft);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posBottom,
    posLeft,
    pos(0, 0),
    pos(width, 0),
    pos(width, height),
  ];

  const clipPathRemain = toClipPath(polygonRemain);

  const boxShadowWidth = Math.min(
    height - leftOffset,
    bottomOffset,
    maxShadowWidth
  );
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posBottom, posLeft, pos(0, height)];

  const clipPathFlip = toClipPath(polygon);

  let newPolygon =
    height - leftOffset >= bottomOffset
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygon = insertLineToPolygon(
    newPolygon,
    line(
      polygon[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygon[0], matrixRaw), pos(10, 0)),
        matrixRaw
      )
    ),
    0
  );

  if (height - leftOffset >= bottomOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[1], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      2
    );
  } else {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[2], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      3
    );
  }

  const clipPathFlipShadow = toClipPath(newPolygon);

  const posVector = glMatrix.vec2.fromValues(-1, 0);

  glMatrix.vec2.normalize(posVector, posVector);
  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, height),
    applyTransform(posLeft, matrixRaw),
    applyTransform(posBottom, matrixRaw),
    applyTransform(posAdd(posBottom, posVector as Pos), matrixRaw)
  );

  const transformEffect = toCSSMatrix(matrixEffect);

  const effectPolygon = polygon
    .map((i) => {
      return applyTransform(i, matrixRaw);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  const clipPathEffect = toClipPath(effectPolygon);

  return {
    clipPathRemain,
    clipPathFlip,
    clipPathFlipShadow,
    clipPathEffect,
    boxShadow,
    transformFlip: transform,
    transformEffect,
  };
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
  const matrixRaw = genReflectMatrix(posBottom, posRight);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posBottom,
    posRight,
    pos(width, 0),
    pos(0, 0),
    pos(0, height),
  ];

  const clipPathRemain = toClipPath(polygonRemain);

  const boxShadowWidth = Math.min(
    height - rightOffset,
    width - bottomOffset,
    maxShadowWidth
  );
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posBottom, posRight, pos(width, height)];

  const clipPathFlip = toClipPath(polygon);

  let newPolygon =
    height - rightOffset >= width - bottomOffset
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygon = insertLineToPolygon(
    newPolygon,
    line(
      polygon[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygon[0], matrixRaw), pos(10, 0)),
        matrixRaw
      )
    ),
    0
  );

  if (height - rightOffset >= width - bottomOffset) {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[1],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[1], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      2
    );
  } else {
    newPolygon = insertLineToPolygon(
      newPolygon,
      line(
        polygon[2],
        applyReverseTransform(
          posAdd(applyReverseTransform(polygon[2], matrixRaw), pos(10, 0)),
          matrixRaw
        )
      ),
      3
    );
  }

  const clipPathFlipShadow = toClipPath(newPolygon);

  const posVector = glMatrix.vec2.fromValues(1, 0);

  glMatrix.vec2.normalize(posVector, posVector);
  glMatrix.vec2.scale(posVector, posVector, boxShadowWidth);

  const matrixEffect = genMatrix(
    pos(0, 0),
    pos(0, height),
    pos(width, height),
    applyTransform(posRight, matrixRaw),
    applyTransform(posBottom, matrixRaw),
    applyTransform(posAdd(posBottom, posVector as Pos), matrixRaw)
  );

  const transformEffect = toCSSMatrix(matrixEffect);

  const effectPolygon = polygon
    .map((i) => {
      return applyTransform(i, matrixRaw);
    })
    .map((i) => {
      return applyReverseTransform(i, matrixEffect);
    });

  const clipPathEffect = toClipPath(effectPolygon);

  return {
    clipPathRemain,
    clipPathFlip,
    clipPathFlipShadow,
    clipPathEffect,
    boxShadow,
    transformFlip: transform,
    transformEffect,
  };
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
  const angleLine = Math.PI / 2 + angle
  const vector = pos(Math.cos(angleLine), Math.sin(angleLine))
  const lineStart = pos(centerX, centerY)
  const lineTo = posAdd(lineStart, vector)
  const lineSplit = line(lineStart, lineTo)

  const leftTop = pos(0, 0)
  const leftBottom = pos(0, height)
  const rightTop = pos(width, 0)
  const rightBottom = pos(width, height)

  const lineTop = line(leftTop, rightTop)
  const lineRight = line(rightTop, rightBottom)
  const lineBottom = line(rightBottom, leftBottom)
  const lineLeft = line(leftBottom, leftTop)

  const resTop = intersection(lineTop, lineSplit)
  const resRight = intersection(lineRight, lineSplit)
  const resBottom = intersection(lineBottom, lineSplit)
  const resLeft = intersection(lineLeft, lineSplit)

  if (resTop?.hitLine1 && resLeft?.hitLine1) {
    return getEffectLeftTop(
      width,
      height,
      resLeft.pos[1],
      resTop.pos[0],
      maxShadowWidth
    )
  } else if (resTop?.hitLine1 && resBottom?.hitLine1) {
    return getEffectLeft(
      width,
      height,
      resTop.pos[0],
      resBottom.pos[0],
      maxShadowWidth
    )
  } else if (resLeft?.hitLine1 && resBottom?.hitLine1) {
    return getEffectLeftBottom(
      width,
      height,
      resLeft.pos[1],
      resBottom.pos[0],
      maxShadowWidth
    )
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
      )
    } else {
      return getEffectLeftBottom(
        width,
        height,
        resLeft.pos[1],
        width,
        maxShadowWidth
      )
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
                                  
    return getEffectLeft(
      width,
      height,
      resTop.pos[0],
      width,
      maxShadowWidth
    )
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
    )
  } else {
    console.warn('invalid style result')
    return {
      clipPathEffect: '',
      clipPathFlipShadow: '',
      clipPathFlip: '',
      clipPathRemain: '',
      boxShadow: '',
      transformFlip: '',
      transformEffect: ''
    } satisfies EffectStyle
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
  const angleLine = Math.PI / 2 + angle
  const vector = pos(Math.cos(angleLine), Math.sin(angleLine))
  const lineStart = pos(centerX, centerY)
  const lineTo = posAdd(lineStart, vector)
  const lineSplit = line(lineStart, lineTo)

  const leftTop = pos(0, 0)
  const leftBottom = pos(0, height)
  const rightTop = pos(width, 0)
  const rightBottom = pos(width, height)

  const lineTop = line(leftTop, rightTop)
  const lineRight = line(rightTop, rightBottom)
  const lineBottom = line(rightBottom, leftBottom)
  const lineLeft = line(leftBottom, leftTop)

  const resTop = intersection(lineTop, lineSplit)
  const resRight = intersection(lineRight, lineSplit)
  const resBottom = intersection(lineBottom, lineSplit)
  const resLeft = intersection(lineLeft, lineSplit)

  if (resTop?.hitLine1 && resRight?.hitLine1) {
    return getEffectRightTop(
      width,
      height,
      resRight.pos[1],
      resTop.pos[0],
      maxShadowWidth
    )
  } else if (resTop?.hitLine1 && resBottom?.hitLine1) {
    return getEffectRight(
      width,
      height,
      resTop.pos[0],
      resBottom.pos[0],
      maxShadowWidth
    )
  } else if (resRight?.hitLine1 && resBottom?.hitLine1) {
    return getEffectRightBottom(
      width,
      height,
      resRight.pos[1],
      resBottom.pos[0],
      maxShadowWidth
    )
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
      )
    } else {
      return getEffectRightTop(
        width,
        height,
        resRight.pos[1],
        width,
        maxShadowWidth
      )
    }
  } else if (resTop?.hitLine1 && resLeft?.hitLine1) {                  
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
                                  
    return getEffectRight(
      width,
      height,
      resTop.pos[0],
      0,
      maxShadowWidth
    )
  } else if (resBottom?.hitLine1 && resLeft?.hitLine1) {                    
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
                     
    return getEffectRight(
      width,
      height,
      0,
      resBottom.pos[0],
      maxShadowWidth
    )
  } else {
    console.warn('invalid style result')
    return {
      clipPathEffect: '',
      clipPathFlipShadow: '',
      clipPathFlip: '',
      clipPathRemain: '',
      boxShadow: '',
      transformFlip: '',
      transformEffect: ''
    } satisfies EffectStyle
  }
};
