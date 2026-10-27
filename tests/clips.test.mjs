/** Tests for the demo clips: the ffmpeg steps, the scene wiring, the file sizes and the video markup. */
import assert from "node:assert/strict"
import { readFileSync, statSync } from "node:fs"
import { test } from "node:test"
import { budgetBytes, isWithinBudget, keptSeconds, mp4Args, videoFilter, webmArgs } from "../tools/clip.mjs"
import { inRoot } from "../tools/paths.mjs"
import { data, html } from "./built.mjs"

const MP4_MARK = "ftyp"
const WEBM_MARK = [0x1a, 0x45, 0xdf, 0xa3]

function isFeatured(project) {
  return project.tier === "featured"
}

const featured = data.projects.projects.filter(isFeatured)
const sample = featured[0]
const trim = { start: 1.2, seconds: 7 }

function sizeOf(relative) {
  return statSync(inRoot(relative)).size
}

function bytesOf(relative) {
  return readFileSync(inRoot(relative))
}

function assertSize(clip, relative) {
  assert.ok(isWithinBudget(sizeOf(relative), clip), `${relative} is ${sizeOf(relative)} bytes; the budget is ${budgetBytes(clip)} bytes`)
}

function assertFiles(project) {
  assertSize(project.clip, project.clip.mp4)
  assertSize(project.clip, project.clip.webm)
}

function assertMarks(project) {
  assert.equal(bytesOf(project.clip.mp4).subarray(4, 8).toString("latin1"), MP4_MARK)
  assert.deepEqual([...bytesOf(project.clip.webm).subarray(0, 4)], WEBM_MARK)
}

function assertTargets(project) {
  const { targets, steps } = project.clip.scene
  const named = steps.filter(hasTarget).map(targetOf)
  assert.ok(named.every(isDefined.bind(null, targets)), `${project.id} has a step with an unknown target`)
}

function hasTarget(step) {
  return step.do !== "wait"
}

function targetOf(step) {
  return step.target
}

function isDefined(targets, name) {
  return name in targets
}

function assertVideoTag(project) {
  const tag = html.match(new RegExp(`<video[^>]*poster="${project.preview.file}"[^>]*>[\\s\\S]*?</video>`))[0]
  for (const word of ["data-clip", "muted", "loop", "playsinline", 'preload="none"', 'role="img"', 'aria-label="']) assert.ok(tag.includes(word), `${project.id}: ${word}`)
  assert.ok(tag.indexOf(project.clip.mp4) < tag.indexOf(project.clip.webm), `${project.id}: the MP4 source comes first`)
  assert.doesNotMatch(tag, /\sautoplay\b|\scontrols\b/)
}

test("each clip file stays within its byte budget", () => {
  featured.forEach(assertFiles)
})

test("each clip file has the header of its format", () => {
  featured.forEach(assertMarks)
})

test("each scene step names a target that the scene defines", () => {
  featured.forEach(assertTargets)
})

test("each featured project has a clip", () => {
  assert.ok(featured.length >= 2)
  assert.ok(featured.every(hasClip))
})

function hasClip(project) {
  return Boolean(project.clip)
}

test("each featured card shows a muted looping video with the still as its poster", () => {
  featured.forEach(assertVideoTag)
})

test("the filter crops the still area, scales to the clip size and sets the frame rate", () => {
  const { capture, clip } = sample
  const { x, y, width, height } = capture.clip
  assert.equal(videoFilter(capture, clip), `crop=${width}:${height}:${x}:${y},scale=${clip.width}:${clip.height}:flags=lanczos,fps=${clip.fps}`)
})

test("the MP4 arguments make a silent, streamable, iOS-safe H.264 file", () => {
  const args = mp4Args("in.webm", trim, "f", sample.clip)
  for (const word of ["-an", "libx264", "yuv420p", "+faststart", "high"]) assert.ok(args.includes(word), word)
  assert.equal(args.at(-1), sample.clip.mp4)
})

test("the WebM arguments make a silent VP9 file", () => {
  const args = webmArgs("in.webm", trim, "f", sample.clip)
  for (const word of ["-an", "libvpx-vp9", "yuv420p"]) assert.ok(args.includes(word), word)
  assert.equal(args.at(-1), sample.clip.webm)
})

test("the kept length is the shorter of the scene and the clip limit", () => {
  assert.equal(keptSeconds(7.5, { seconds: 9 }), 7.5)
  assert.equal(keptSeconds(12, { seconds: 9 }), 9)
})

test("an equal size is within budget and one byte more is not", () => {
  const clip = { maxKilobytes: 450 }
  assert.ok(isWithinBudget(450000, clip))
  assert.ok(!isWithinBudget(450001, clip))
})

test("the clip script plays only on screen, honors reduced motion and saves data", () => {
  const script = readFileSync(inRoot("assets/js/clips.js"), "utf8")
  for (const word of ["IntersectionObserver", "visibilitychange", "prefers-reduced-motion: reduce", "saveData"]) assert.ok(script.includes(word), word)
})

test("the page loads the clip script", () => {
  assert.match(html, /<script type="module" src="assets\/js\/clips\.js"><\/script>/)
})
