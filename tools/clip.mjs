/** Pure steps of the clip command: the ffmpeg filter, the ffmpeg arguments and the size check. */

const HEAD = ["-y", "-loglevel", "error"]
const MP4_CODEC = ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
const WEBM_CODEC = ["-c:v", "libvpx-vp9", "-b:v", "0", "-pix_fmt", "yuv420p", "-row-mt", "1"]

export function videoFilter(capture, clip) {
  const { x, y, width, height } = capture.clip
  return `crop=${width}:${height}:${x}:${y},scale=${clip.width}:${clip.height}:flags=lanczos,fps=${clip.fps}`
}

function trimArgs(source, trim, filter) {
  return [...HEAD, "-i", source, "-ss", String(trim.start), "-t", String(trim.seconds), "-vf", filter, "-an"]
}

export function mp4Args(source, trim, filter, clip) {
  return [...trimArgs(source, trim, filter), ...MP4_CODEC, "-crf", String(clip.quality.mp4Crf), clip.mp4]
}

export function webmArgs(source, trim, filter, clip) {
  return [...trimArgs(source, trim, filter), ...WEBM_CODEC, "-crf", String(clip.quality.webmCrf), clip.webm]
}

export function keptSeconds(sceneSeconds, clip) {
  return Math.min(sceneSeconds, clip.seconds)
}

export function budgetBytes(clip) {
  return clip.maxKilobytes * 1000
}

export function isWithinBudget(bytes, clip) {
  return bytes <= budgetBytes(clip)
}
