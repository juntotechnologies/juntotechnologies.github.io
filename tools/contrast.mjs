/** WCAG contrast ratio between two #rrggbb colors. Pure. */

const WEIGHTS = [0.2126, 0.7152, 0.0722]
const SHIFTS = [16, 8, 0]
const OFFSET = 0.05

function linear(channel) {
  const value = channel / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function channelOf(packed, shift) {
  return linear((packed >> shift) & 255)
}

function weighted(sum, channel, index) {
  return sum + channel * WEIGHTS[index]
}

export function luminance(hex) {
  return SHIFTS.map(channelOf.bind(null, parseInt(hex.slice(1), 16))).reduce(weighted, 0)
}

function descending(a, b) {
  return b - a
}

/** The ratio, from 1 (no contrast) to 21 (black on white). */
export function contrast(first, second) {
  const [high, low] = [luminance(first), luminance(second)].sort(descending)
  return (high + OFFSET) / (low + OFFSET)
}
