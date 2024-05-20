import * as glMatrix from 'gl-matrix'

export type Pos = [number, number]
export type Line = [Pos, Pos]

export function toCSSNumber(v: number) {
  if (Math.abs(v) < 1e-6) {
    return "0.000000";
  }

  const res = v.toFixed(6);

  if (res.indexOf("e") >= 0) {
    throw new Error("eeeee");
  }

  return res;
}

export function pos(x: number, y: number) {
  return glMatrix.vec2.fromValues(x, y) as Pos;
}

export function posAdd(...poss: Pos[]) {
  return poss.reduce((p, c) => {
    p[0] += c[0];
    p[1] += c[1];
    return p;
  }, pos(0, 0));
}

export function equalF32(a: number, b: number) {
  const epsilon = 1.19e-7;
  const bigger = Math.max(Math.abs(a), Math.abs(b));
  const lesser = Math.min(Math.abs(a), Math.abs(b));
  return Math.abs(bigger - lesser) < Math.abs(bigger) * epsilon;
}

export function genMatrix(s1: Pos, s2: Pos, s3: Pos, t1: Pos, t2: Pos, t3: Pos) {
  const input = Float32Array.from([
    s1[0],
    s2[0],
    s3[0],
    s1[1],
    s2[1],
    s3[1],
    1,
    1,
    1
  ]);

  const inverted = glMatrix.mat3.create();
  glMatrix.mat3.invert(inverted, input);

  const target = Float32Array.from([
    t1[0],
    t2[0],
    t3[0],
    t1[1],
    t2[1],
    t3[1],
    1,
    1,
    1
  ]);

  const transformMatrix = glMatrix.mat3.create();
  glMatrix.mat3.mul(transformMatrix, inverted, target);

  return transformMatrix;
}

const zero = pos(0, 0);

export function genReflectMatrix(p1: Pos, p2: Pos) {
  const normal = glMatrix.vec2.create();
  glMatrix.vec2.subtract(normal, p1, p2);
  glMatrix.vec2.rotate(normal, normal, zero, Math.PI / 2);
  glMatrix.vec2.normalize(normal, normal);
  const center = glMatrix.vec2.create();
  glMatrix.vec2.lerp(center, p1, p2, 0.5);
  const p3 = glMatrix.vec2.clone(center);
  glMatrix.vec2.add(p3, p3, normal);
  const p3r = glMatrix.vec2.clone(center);
  glMatrix.vec2.subtract(p3r, p3r, normal);
  return genMatrix(p1, p2, p3 as Pos, p1, p2, p3r as Pos);
}

export function toCSSMatrix(transformMatrix: glMatrix.mat3) {
  const transposed2dMatrix = [
    transformMatrix[0],
    transformMatrix[3],
    transformMatrix[1],
    transformMatrix[4],
    transformMatrix[2],
    transformMatrix[5]
  ];

  const deform = `matrix(${[...transposed2dMatrix.slice(0, 4)]
    .map(toCSSNumber)
    .join(", ")},0,0)`


  const move = `translate(calc(var(--scale-px, 1px) * ${toCSSNumber(transposed2dMatrix[4])}), calc(var(--scale-px, 1px) * ${toCSSNumber(transposed2dMatrix[5])}))`

  const transform = `${move} ${deform}`;

  return transform;
}

export function genReflectCSSMatrix(p1: Pos, p2: Pos) {
  return toCSSMatrix(genReflectMatrix(p1, p2));
}

export const line = (p1: Pos, p2: Pos): Line => {
  return [p1, p2];
};

// https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
export function lineIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
  var ua,
    ub,
    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return [
    x1 + ua * (x2 - x1),
    y1 + ua * (y2 - y1),
    ua >= 0 && ua <= 1,
    ub >= 0 && ub <= 1
  ] as [number, number, boolean, boolean];
}

export function intersection(line1: Line, line2: Line): {
  pos: Pos
  hitLine1: boolean
  hitLine2: boolean

} | null {
  const res = lineIntersect(
    line1[0][0],
    line1[0][1],
    line1[1][0],
    line1[1][1],
    line2[0][0],
    line2[0][1],
    line2[1][0],
    line2[1][1]
  );

  if (res) {
    return {
      pos: pos(res[0], res[1]),
      hitLine1: res[2],
      hitLine2: res[3]
    }
  } else {
    return null
  }
}

export function expandPolygon(points: Pos[], edgeToExpand = [] as number[], amount = 1): Pos[] {
  if (amount === 0) {
    return points;
  }

  const edges: Line[] = [];
  for (let i = 0; i < points.length; i++) {
    edges.push(line(points[i], points[(i + 1) % points.length]));
  }
  // console.log(edges)
  const center = points.reduce((p, c) => {
    p[0] += c[0] / points.length;
    p[1] += c[1] / points.length;
    return p;
  }, glMatrix.vec2.create());
  // console.log(center)

  const edge0 = edges[0];
  const edge0Vec = Float32Array.from([
    edge0[1][0] - edge0[0][0],
    edge0[1][1] - edge0[0][1]
  ]);
  const edgeToCenterVec = Float32Array.from([
    center[0] - edge0[0][0],
    center[1] - edge0[0][1]
  ]);
  // console.log(edge0Vec, edgeToCenterVec)
  const isClockWise =
    edge0Vec[0] * edgeToCenterVec[1] - edgeToCenterVec[0] * edge0Vec[1] < 0;
  // console.log(isClockWise)

  const newEdges: Line[] = [];

  for (let i = 0; i < edges.length; i++) {
    const old = edges[i];

    if (!edgeToExpand.includes(i)) {
      newEdges.push(old);
    } else {
      const normal = Float32Array.from([
        old[1][1] - old[0][1],
        old[0][0] - old[1][0]
      ]);
      glMatrix.vec2.normalize(normal, normal);
      glMatrix.vec2.scale(normal, normal, isClockWise ? -amount : amount);
      newEdges.push(
        line(
          glMatrix.vec2.add(glMatrix.vec2.create(), old[0], normal) as Pos,
          glMatrix.vec2.add(glMatrix.vec2.create(), old[1], normal) as Pos
        )
      );
    }
  }

  // console.log(newEdges)

  const newPoints: Pos[] = [];

  for (let i = 0; i < newEdges.length; i++) {
    const prev = newEdges[(i - 1 + newEdges.length) % newEdges.length];
    const old = newEdges[i];
    const newPoint = intersection(prev, old);
    if (newPoint) {
      newPoints.push(newPoint.pos);
    } else {
      console.error('bad expand')
    }
  }
  // console.log(newPoints)

  return newPoints;
}

export function applyTransform(point: Pos, transformMatrix: glMatrix.mat3) {
  const transformInput = glMatrix.vec3.fromValues(...point, 1);
  const transformOutput = glMatrix.vec3.create();

  const flippedMatrix = glMatrix.mat3.create();
  glMatrix.mat3.transpose(flippedMatrix, transformMatrix);
  glMatrix.vec3.transformMat3(transformOutput, transformInput, flippedMatrix);
  return pos(transformOutput[0], transformOutput[1]);
}

export function applyReverseTransform(point: Pos, transformMatrix: glMatrix.mat3) {
  const transformInput = glMatrix.vec3.fromValues(...point, 1);
  const transformOutput = glMatrix.vec3.create();

  const flippedInvertedMatrix = glMatrix.mat3.create();
  glMatrix.mat3.transpose(flippedInvertedMatrix, transformMatrix);
  glMatrix.mat3.invert(flippedInvertedMatrix, flippedInvertedMatrix);

  glMatrix.vec3.transformMat3(
    transformOutput,
    transformInput,
    flippedInvertedMatrix
  );
  return pos(transformOutput[0], transformOutput[1]);
}

export function insertLineToPolygon(polygon: Pos[], newLine: Line, index: number) {
  const wrap = (i: number) =>
    (((i + polygon.length) % polygon.length) + polygon.length) % polygon.length;

  const replacePrev = []
  let prevPoint = wrap(index - 1)
  let newPointA: Pos | null = null
  while (true) {
    const lineBefore = line(
      polygon[wrap(prevPoint)],
      polygon[wrap(prevPoint + 1)]
    )
    const newPointARes = intersection(lineBefore, newLine);
    if (!newPointARes || !newPointARes.hitLine1) {
      if (prevPoint === index) {
        // no intersection
        break
      }
      // mark as point to remove
      replacePrev.unshift(wrap(prevPoint))
      prevPoint = wrap(prevPoint - 1)
    } else {
      newPointA = newPointARes.pos
      break
    }
  }

  const replaceNext = []
  let nextPoint = wrap(index + 1)
  let newPointB: Pos | null = null
  while (true) {
    const lineAfter = line(
      polygon[wrap(nextPoint - 1)],
      polygon[wrap(nextPoint)]
    )
    const newPointBRes = intersection(newLine, lineAfter);
    if (!newPointBRes || !newPointBRes.hitLine2) {
      if (nextPoint === index) {
        // no intersection
        break
      }
      // mark as point to remove
      replaceNext.push(wrap(nextPoint))
      nextPoint = wrap(nextPoint + 1)
    } else {
      newPointB = newPointBRes.pos
      break
    }
  }
  
  if (
    newPointA == null ||
    newPointB == null
  ) {
    newPointA = polygon[wrap(index - 1)];
    newPointB = polygon[wrap(index + 1)];
    // just dupe the point instead
    // return polygon;
  }
  
  const targetPoint = wrap(index);
  const result: Pos[] = [...polygon];
  for (const i of replacePrev) {
    result[i] = pos(newPointA[0], newPointA[1])
  }
  for (const i of replaceNext) {
    result[i] = pos(newPointB[0], newPointB[1])
  }
  result.splice(targetPoint, 1, pos(newPointA[0], newPointA[1]), pos(newPointB[0], newPointB[1]));
  return result;
}
export function toClipPath(poss: Pos[]) {
  return `polygon(${poss
    .map((i) => `calc(var(--scale-px) * ${toCSSNumber(i[0])}) calc(var(--scale-px) * ${toCSSNumber(i[1])})`)
    .join(", ")})`;
}