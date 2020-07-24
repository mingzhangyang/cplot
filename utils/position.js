class Point {
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

class Position {
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

class Triangle{
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
  let angle0 = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  let angle1 = Math.atan2(p3[1] - p1[1], p3[0] - p1[0]);
  let angle2 = Math.atan2(p4[1] - p1[1], p4[0] - p1[0]);
  let product = (angle1 - angle0) * (angle2 - angle0);
  if (product === 0) {
    return 0;
  }
  return product > 0 ? 1 : -1;
}