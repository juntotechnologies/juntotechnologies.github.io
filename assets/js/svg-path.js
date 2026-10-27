/** Small SVG path helpers. Pure, so the build and the page draw the same shapes. */

/** One decimal place keeps a path short and its shape the same. */
export function round(value) {
  return Math.round(value * 10) / 10
}

function pair(point) {
  return `${round(point[0])} ${round(point[1])}`
}

/** A path through the points. Each point is [x, y]. */
export function linePath(points) {
  return `M${points.map(pair).join("L")}`
}
