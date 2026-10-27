/** Plays a clip scene on a page: one named handler for each step type in data/schema/projects.schema.json. */

async function wait(page, step) {
  await page.waitForTimeout(step.ms)
}

async function click(page, step, selector) {
  await page.locator(selector).first().click()
}

async function type(page, step, selector) {
  await page.locator(selector).first().pressSequentially(step.text, { delay: step.delayMs })
}

async function clear(page, step, selector) {
  await page.locator(selector).first().fill("")
}

const HANDLERS = { wait, click, type, clear }

async function runStep(page, targets, step) {
  await HANDLERS[step.do](page, step, targets[step.target])
}

/** Runs each step in order. The scene says what to do. This file says how. */
export async function runScene(page, scene) {
  for (const step of scene.steps) await runStep(page, scene.targets, step)
}
