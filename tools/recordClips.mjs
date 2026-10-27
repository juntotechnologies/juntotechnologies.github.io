/** Clip command: records a scripted run of each featured demo, then encodes an MP4 and a WebM file. Run it after a change to a demo or a scene. */
import { execFileSync } from "node:child_process"
import { mkdtempSync, rmSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright"
import { budgetBytes, isWithinBudget, keptSeconds, mp4Args, videoFilter, webmArgs } from "./clip.mjs"
import { runScene } from "./clipScene.mjs"
import { loadData } from "./data/load.mjs"
import { inRoot, ROOT } from "./paths.mjs"

const SETTLE_MS = 1500
const FFMPEG = "ffmpeg"

function isFeatured(project) {
  return project.tier === "featured"
}

function recordingOptions(scratch, capture) {
  const size = { width: capture.width, height: capture.height }
  return { viewport: size, recordVideo: { dir: scratch, size }, colorScheme: "light" }
}

async function openDemo(browser, scratch, capture) {
  const context = await browser.newContext(recordingOptions(scratch, capture))
  const page = await context.newPage()
  const opened = Date.now()
  await page.goto(capture.url, { waitUntil: "networkidle" })
  await page.waitForTimeout(SETTLE_MS)
  return { context, page, opened }
}

async function playScene(page, scene) {
  const started = Date.now()
  await runScene(page, scene)
  return { started, ended: Date.now() }
}

/** Records the scene. Returns the video file, the seconds before the scene began and the scene length. */
async function record(browser, scratch, project) {
  const { context, page, opened } = await openDemo(browser, scratch, project.capture)
  const { started, ended } = await playScene(page, project.clip.scene)
  await context.close()
  return { source: await page.video().path(), start: (started - opened) / 1000, scene: (ended - started) / 1000 }
}

function runFfmpeg(args) {
  execFileSync(FFMPEG, args, { cwd: ROOT })
}

function encode(project, recording) {
  const { capture, clip } = project
  const filter = videoFilter(capture, clip)
  const trim = { start: recording.start, seconds: keptSeconds(recording.scene, clip) }
  runFfmpeg(mp4Args(recording.source, trim, filter, clip))
  runFfmpeg(webmArgs(recording.source, trim, filter, clip))
}

function checkSize(clip, relative) {
  const bytes = statSync(inRoot(relative)).size
  if (!isWithinBudget(bytes, clip)) throw new Error(`${relative} is ${bytes} bytes. The budget is ${budgetBytes(clip)} bytes. Raise the CRF in data/projects.json.`)
  console.log(`wrote ${relative} (${bytes} bytes)`)
}

function checkSizes(clip) {
  checkSize(clip, clip.mp4)
  checkSize(clip, clip.webm)
}

async function makeClip(browser, scratch, project) {
  encode(project, await record(browser, scratch, project))
  checkSizes(project.clip)
}

async function main() {
  const scratch = mkdtempSync(join(tmpdir(), "junto-clips-"))
  const browser = await chromium.launch()
  for (const project of loadData().projects.projects.filter(isFeatured)) await makeClip(browser, scratch, project)
  await browser.close()
  rmSync(scratch, { recursive: true })
}

await main()
