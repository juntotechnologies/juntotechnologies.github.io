/** Pure geometry for the pointer glow: where a pointer sits inside a box. */

/** The pointer position in pixels, measured from the top left corner of the box. */
export function offsetIn(box, point) {
  return { x: point.clientX - box.left, y: point.clientY - box.top }
}

/** The CSS length for one axis of an offset. */
export function px(value) {
  return `${Math.round(value)}px`
}
