export class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static distanceOfTwoPoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  distanceToSegment(seg) {
    if (seg.start.x === seg.end.x) {
      return Math.abs(this.x - seg.start.x);
    }
    if (seg.start.y === seg.end.y) {
      return Math.abs(this.y - seg.start.y);
    }

    let k = (seg.start.y - seg.end.y) / (seg.start.x - seg.end.x);
    let x = (this.y - seg.start.y + k * seg.start.x + this.x / k) / (k + 1 / k);
    let y = k * x - k * seg.start.x + seg.start.y;

    return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
  }
}

export class Segment {
  constructor(p1, p2, err = .005) {
    this.start = p1;
    this.end = p2;
    if (err < 0) {
      throw 'error should be a positive number';
    }
    this.error = err;
  }

  length() {
    return Math.sqrt((this.start.x - this.end.x) ** 2 + (this.start.y - this.end.y) ** 2);
  }

  formula() {
    if (this.start.x === this.end.x) {
      return [NaN, NaN];
    }
    if (this.start.y === this.end.y) {
      return [0, this.start.y];
    }
    return [
      (this.start.y - this.end.y) / (this.start.x - this.end.x),
      (this.start.x * this.end.y - this.start.y * this.end.x) / (this.start.x - this.end.x)
    ];
  }

  contains(p) {
    if (this.start.x === this.end.x) {
      return Math.abs(p.x - this.start.x) < this.error;
    }
    if (this.start.y === this.end.y) {
      return Math.abs(p.y - this.start.y) < this.error;
    }

    let k = (this.end.y - this.start.y) / (this.end.x - this.start.x);
    let x = (k * this.start.x + p.x / k - this.start.y + p.y) / (k + 1 / k);
    let y = k * x - k * this.start.x + this.start.y;

    return ((p.x >= this.start.x && p.x <= this.end.x) || (p.x < this.start.x && p.x > this.end.x))
      && Math.sqrt((p.x - x) ** 2 + (p.y -y) ** 2) < this.error;
  }
}

export class Triangle{
  constructor(p1, p2, p3) {
    this.vertexes = [p1, p2, p3];
  }

  contains(p) {
    for (let i = 0; i < 3; i++) {
      let j = (i + 1) % 3;
      let k = (i + 2) % 3;
      let t = onSameSide([this.vertexes[i].x, this.vertexes[i].y],
        [this.vertexes[j].x, this.vertexes[j].y],
        [this.vertexes[k].x, this.vertexes[k].y],
        [p.x, p.y]);
      if (t === -1) {
        return false;
      }
    }
    return true;
  }
}

class Polygon{

}

/**
 * Determine whether p3 and p4 are on the same side of the segment of p1-p2
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * returns -1 (not on the same side) | 0 (at least one is on the segment) | 1 (on the same side)
 */
function onSameSide(p1=[0,0], p2=[0,0], p3=[0,0], p4=[0,0]) {
  if (p1[0] === p2[0]) {
    let m = p3[0] - p1[0];
    let n = p4[0] - p1[0];
    if (m * n === 0) {
      return 0;
    }
    return m * n > 0 ? 1: -1;
  }
  let k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  let b0 = p2[1] - k * p2[0];
  let b1 = p3[1] - k * p3[0];
  let b2 = p4[1] - k * p4[0];
  let p = b1 - b0;
  let q = b2 - b0;
  if (p * q === 0) {
    return 0;
  } else {
    return p * q > 0 ? 1 : -1;
  }
}

/**
 * This is to determine whether a point p3 is on the segment starts from p1 and ends with p2
 * @param p1, start point of the segment
 * @param p2, end point of the segment
 * @param p3, the point to be examined
 * @param d, the largest distance to the segment within which a point can be accepted as on the line
 */
export function onLineOrNot(p1 = [0, 0], p2 = [0, 0], p3 = [0, 0], d = 2) {
  if (p1[0] === p2[0]) {
    return ((p3[1] >= p1[1] && p3[1] <= p2[1]) || (p3[1] <= p1[1] && p3[1] >= p2[1])) && Math.abs(p3[0] - p1[0]) <= d;
  }
  if (p1[1] === p2[1]) {
    return ((p3[0] >= p1[0] && p3[0] <= p2[0]) || (p3[0] <= p1[0] && p3[0] >= p2[0])) && Math.abs(p3[1] - p1[1]) <= d;
  }
  let k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  let x = (p3[1] - p1[1] + k * p1[0] + p3[0] / k) / (k + 1 / k);
  let y = k * (x - p1[0]) + p1[1];

  return ((x >= p1[0] && x <= p2[0]) || (x <= p1[0] && x >= p2[0])) && (Math.sqrt((p3[0] - x) ** 2 + (p3[1] - y) ** 2) < d);
}

/**
 * This method use coordinates system transformation
 * @param p1
 * @param p2
 * @param p3
 * @param d
 */
export function onLineOrNot2(p1 = [0, 0], p2 = [0, 0], p3 = [0, 0], d = 2) {
  // make sure p1 is on the left of p2
  if (p1[0] > p2[0]) {
    [p1, p2] = [p2, p1];
  }
  // translate(-p1[0], -p1[1]), then p1 -> [0, 0], p2 -> [p2[0]-p1[0], p2[1]-p1[1]], p3 -> [p3[0]-p1[0], p3[1]-p1[1]]
  let alpha = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  let beta = Math.atan2(p3[1] - p1[1], p3[0] - p1[0]);
  // rotate(-alpha) to make p2 is on x-axis, then tha angle of p3 with the new x-axis is beta - alpha
  // now p2 in the new coordinates system is [Math.sqrt((p2[0]-p1[0]) ** 2 + (p2[1]-p1[1]) ** 2), 0]
  let m = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
  // now p3 in the new coordinates system is [|p1p3| * cos(beta-alpha), |p1p3| * sin(beta-alpha)]
  let n = Math.sqrt((p3[0] - p1[0]) ** 2 + (p3[1] - p1[1]) ** 2);
  return n * Math.cos(beta - alpha) >= 0 && n * Math.cos(beta - alpha) <= m
    && Math.abs(n * Math.sin(beta - alpha)) <= d;
}