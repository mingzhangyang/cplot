function d2Alpha(d, R, r) {
  return Math.acos((d * d + r * r - R * R) / (2 * d * r));
}

function d2Theta(d, R, r) {
  return Math.acos((d * d + R * R - r * r) / (2 * d * R));
}

function d2Area(d, R, r) {
  if (d > (R + r)) {
    return 0;
  }
  if (d < (R - r)) {
    return Math.PI * r * r;
  }
  let alpha = d2Alpha(d, R, r);
  let theta = d2Theta(d, R, r);
  let a = alpha * r * r - r * r * Math.sin(alpha) * Math.cos(alpha);
  let b = theta * R * R - R * R *  Math.sin(theta) * Math.cos(theta);
  return a + b;
}

/**
 * Calculate d given R, r and the expected percentage of the area of the intersection to the area of the smaller circle
 * @param R
 * @param r
 * @param percentage
 */
export function calcD(R, r, percentage) {
  if (percentage < 0 || percentage > 1) {
    console.error("percentage is invalid.");
    return NaN;
  }
  if (percentage < .005) {
    return R + r;
  }
  if (percentage > .995) {
    return R - r;
  }
  let start = R + r;
  let dd = r / 500; // 2 * r / 1000
  let aa = Math.PI * r * r;
  for (let i = 1; i < 1000; i++) {
    let d = start - dd * i;
    let a = d2Area(d, R, r);
    let ratio = a / aa;
    if (percentage - ratio < .005) {
      console.log(`expected: ${percentage}, got: ${ratio}`);
      return d;
    }
  }
}