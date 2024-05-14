import { pos, genReflectMatrix, toCSSMatrix, toCSSNumber, expandPolygon, insertLineToPolygin, line, applyReverseTransform, posAdd, applyTransform } from "./coordinate-utils";

const SHADOW_SIZE_TOLERANCE = 1.3

export const getEffectLeftTop = (
  width: number,
  height: number,
  leftOffset: number,
  topOffset: number,
  maxShadowWidth: number
) => {
  const posTop = pos(topOffset, 0);
  const posLeft = pos(0, leftOffset);
  const matrixRaw = genReflectMatrix(posTop, posLeft);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posTop,
    posLeft,
    pos(0, height),
    pos(width, height),
    pos(width, 0)
  ];

  const clipPathRemain = `polygon(${polygonRemain
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  const boxShadowWidth = Math.min(leftOffset, topOffset, maxShadowWidth);
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, posLeft, pos(0, 0)];

  let newPolygin =
    leftOffset >= topOffset
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygin = insertLineToPolygin(
    newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
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

  const clipPathFlip = `polygon(${newPolygin
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  return {
    clipPathRemain,
    clipPathFlip,
    boxShadow,
    transform
  };
};
export const getEffectRightTop = (
  width: number,
  height: number,
  rightOffset: number,
  topOffset: number,
  maxShadowWidth: number
) => {
  const posTop = pos(topOffset, 0);
  const posRight = pos(width, rightOffset);
  const matrixRaw = genReflectMatrix(posTop, posRight);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posTop,
    posRight,
    pos(width, height),
    pos(0, height),
    pos(0, 0)
  ];

  const clipPathRemain = `polygon(${polygonRemain
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  const boxShadowWidth = Math.min(rightOffset, width - topOffset, maxShadowWidth);
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, posRight, pos(width, 0)];

  let newPolygin =
    rightOffset >= (width - topOffset)
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygin = insertLineToPolygin(
    newPolygin,
    line(
      polygon[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygon[0], matrixRaw), pos(10, 0)),
        matrixRaw
      )
    ),
    0
  );

  if (rightOffset >= (width - topOffset)) {
    newPolygin = insertLineToPolygin(
      newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
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

  const clipPathFlip = `polygon(${newPolygin
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  return {
    clipPathRemain,
    clipPathFlip,
    boxShadow,
    transform
  };
};
export const getEffectLeft = (
  width: number,
  height: number,
  topOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
) => {
  const posTop = pos(topOffset, 0);
  const posBottom = pos(bottomOffset, height);
  const matrixRaw = genReflectMatrix(posTop, posBottom);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [posTop, pos(width, 0), pos(width, height), posBottom];

  const clipPathRemain = `polygon(${polygonRemain
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  const boxShadowWidth = Math.min(
    Math.max(topOffset, bottomOffset),
    Math.max(width - topOffset, width - bottomOffset),
    maxShadowWidth
  );

  const boxShadow = `0px 0px ${toCSSNumber(
    boxShadowWidth
  )}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, pos(0, 0), pos(0, height), posBottom];

  let newPolygin =
    topOffset > bottomOffset
      ? expandPolygon(polygon, [0, 1], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  if (topOffset > bottomOffset) {
    newPolygin = insertLineToPolygin(
      newPolygin,
      line(
        polygon[0],
        applyReverseTransform(pos(polygon[0][0] + 10, polygon[0][1]), matrixRaw)
      ),
      0
    );
    newPolygin = insertLineToPolygin(
      newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
      line(
        polygon[3],
        applyReverseTransform(pos(polygon[3][0] + 10, polygon[3][1]), matrixRaw)
      ),
      3
    );
    newPolygin = insertLineToPolygin(
      newPolygin,
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

  const clipPathFlip = `polygon(${newPolygin
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  return {
    clipPathRemain,
    clipPathFlip,
    boxShadow,
    transform
  };
};
export const getEffectRight = (
  width: number,
  height: number,
  topOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
) => {
  const posTop = pos(topOffset, 0);
  const posBottom = pos(bottomOffset, height);
  const matrixRaw = genReflectMatrix(posTop, posBottom);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [posTop, pos(0, 0), pos(0, height), posBottom];

  const clipPathRemain = `polygon(${polygonRemain
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  const boxShadowWidth = Math.min(
    Math.max(width - topOffset, width - bottomOffset),
    Math.max(topOffset, bottomOffset),
    maxShadowWidth
  );

  const boxShadow = `0px 0px ${toCSSNumber(
    boxShadowWidth
  )}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, pos(width, 0), pos(width, height), posBottom];

  let newPolygin =
    width - topOffset > width - bottomOffset
      ? expandPolygon(polygon, [0, 1], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  if (width - topOffset > width - bottomOffset) {
    newPolygin = insertLineToPolygin(
      newPolygin,
      line(
        polygon[0],
        applyReverseTransform(pos(polygon[0][0] + 10, polygon[0][1]), matrixRaw)
      ),
      0
    );
    newPolygin = insertLineToPolygin(
      newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
      line(
        polygon[3],
        applyReverseTransform(pos(polygon[3][0] + 10, polygon[3][1]), matrixRaw)
      ),
      3
    );
    newPolygin = insertLineToPolygin(
      newPolygin,
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

  const clipPathFlip = `polygon(${newPolygin
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  return {
    clipPathRemain,
    clipPathFlip,
    boxShadow,
    transform
  };
};
export const getEffectLeftBottom = (
  width: number,
  height: number,
  leftOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
) => {
  const posBottom = pos(bottomOffset, height);
  const posLeft = pos(0, leftOffset);
  const matrixRaw = genReflectMatrix(posBottom, posLeft);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posBottom,
    posLeft,
    pos(0, 0),
    pos(width, 0),
    pos(width, height)
  ];

  const clipPathRemain = `polygon(${polygonRemain
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  const boxShadowWidth = Math.min(height - leftOffset, bottomOffset, maxShadowWidth);
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posBottom, posLeft, pos(0, height)];

  let newPolygin =
    height - leftOffset >= bottomOffset
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygin = insertLineToPolygin(
    newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
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

  const clipPathFlip = `polygon(${newPolygin
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  return {
    clipPathRemain,
    clipPathFlip,
    boxShadow,
    transform
  };
};
export const getEffectRightBottom = (
  width: number,
  height: number,
  rightOffset: number,
  bottomOffset: number,
  maxShadowWidth: number
) => {
  const posTop = pos(bottomOffset, height);
  const posRight = pos(width, rightOffset);
  const matrixRaw = genReflectMatrix(posTop, posRight);
  const transform = toCSSMatrix(matrixRaw);

  const polygonRemain = [
    posTop,
    posRight,
    pos(width, 0),
    pos(0, 0),
    pos(0, height)
  ];

  const clipPathRemain = `polygon(${polygonRemain
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  const boxShadowWidth = Math.min(height - rightOffset, width - bottomOffset, maxShadowWidth);
  const boxShadow = `0px 0px ${boxShadowWidth}px 0px rgba(0, 0, 0, 1)`;

  const polygon = [posTop, posRight, pos(width, height)];

  let newPolygin =
    height - rightOffset >= (width - bottomOffset)
      ? expandPolygon(polygon, [1, 2], boxShadowWidth * SHADOW_SIZE_TOLERANCE)
      : expandPolygon(polygon, [2], boxShadowWidth * SHADOW_SIZE_TOLERANCE);

  newPolygin = insertLineToPolygin(
    newPolygin,
    line(
      polygon[0],
      applyReverseTransform(
        posAdd(applyReverseTransform(polygon[0], matrixRaw), pos(10, 0)),
        matrixRaw
      )
    ),
    0
  );

  if (height - rightOffset >= (width - bottomOffset)) {
    newPolygin = insertLineToPolygin(
      newPolygin,
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
    newPolygin = insertLineToPolygin(
      newPolygin,
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

  const clipPathFlip = `polygon(${newPolygin
    .map((i) => `${toCSSNumber(i[0])}px ${toCSSNumber(i[1])}px`)
    .join(", ")})`;

  return {
    clipPathRemain,
    clipPathFlip,
    boxShadow,
    transform
  };
};