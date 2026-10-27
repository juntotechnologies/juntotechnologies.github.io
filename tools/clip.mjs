/** Pure steps of the clip command: the ffmpeg filter, the ffmpeg arguments and the size check. */

const HEAD = ["-y", "-loglevel", "error"]
const MP4_CODEC = ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
const WEBM_CODEC = ["-c:v", "libvpx-vp9", "-b:v", "0", "-pix_fmt", "yuv420p", "-row-mt", "1"]

/** Crops the recording to the area of the still, then scales it to the clip size at the clip frame rate. */
export function videoFilter(capture, clip) {
  const { x, y, width, height } = capture.clip
  return `crop=${width}:${height}:${x}:${y},scale=${clip.width}:${clip.height}:flags=lanczos,fps=${clip.fps}`
}

function trimArgs(source, trim, filter) {
  return [...HEAD, "-i", source, "-ss", String(trim.start), "-t", String(trim.seconds), "-vf", filter, "-an"]
}

/** The ffmpeg arguments for the H.264 file. The output path is relative to the repo root. */
export function mp4Args(source, trim, filter, clip) {
  return [...trimArgs(source, trim, filter), ...MP4_CODEC, "-crf", String(clip.quality.mp4Crf), clip.mp4]
}

/** The ffmpeg arguments for the VP9 file. The output path is relative to the repo root. */
export function webmArgs(source, trim, filter, clip) {
  return [...trimArgs(source, trim, filter), ...WEBM_CODEC, "-crf", String(clip.quality.webmCrf), clip.webm]
}

/** The most seconds to keep: the scene length, capped by the seconds the clip allows. */
export function keptSeconds(sceneSeconds, clip) {
  return Math.min(sceneSeconds, clip.seconds)
}

export function budgetBytes(clip) {
  return clip.maxKilobytes * 1000
}

export function isWithinBudget(bytes, clip) {
  return bytes <= budgetBytes(clip)
}
