class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static distanceOfTwoPoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ^ 2 + (p1.y - p2.y) ^ 2);
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

    return Math.sqrt((this.x - x) ^ 2 + (this.y - y) ^ 2);
  }
}

class Segment {
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
      return p.x - this.start.x < this.error;
    }
    if (this.start.y === this.end.y) {
      return p.y - this.start.y < this.error;
    }

    return ((p.x >= this.start.x && p.x <= this.end.x) || (p.x < this.start.x && p.x > this.end.x))
      && (p.y - this.start.y) / (p.x - this.start.x) - (this.end.y - p.y) / (this.end.x - p.x) < this.error;
  }
}