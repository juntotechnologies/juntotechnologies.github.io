/** Pure geometry for the pointer glow: where a pointer sits inside a box. */

export function offsetIn(box, point) {
  return { x: point.clientX - box.left, y: point.clientY - box.top }
}

export function px(value) {
  return `${Math.round(value)}px`
}
