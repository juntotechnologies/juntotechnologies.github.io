/** One handler for each upstream check. A handler compares what the hub states with the project's own source. */

const CHANNELS = /^(\d+) (\d+) (\d+)$/

function channelHex(part) {
  return Number(part).toString(16).padStart(2, "0")
}

function hex(channels) {
  const match = CHANNELS.exec(channels.trim())
  return `#${match.slice(1).map(channelHex).join("")}`
}

function differs(project, [key, actual]) {
  const stated = project.look[key]
  return stated === actual ? [] : [`${project.id} look.${key}: hub says ${stated}, project says ${actual}`]
}

function compareColors(project, actual) {
  return Object.entries(actual).flatMap(differs.bind(null, project))
}

function nameOf(device) {
  return device.name
}

function instrumentNames(project, text) {
  const names = JSON.parse(text).map(nameOf)
  const stated = project.instruments
  return JSON.stringify(names) === JSON.stringify(stated) ? [] : [`${project.id} instruments: hub says ${stated.join(", ")}; project says ${names.join(", ")}`]
}

function benchBridgeColors(project, text) {
  const color = JSON.parse(text).color
  return compareColors(project, { surface: color.paper.value, ink: color.ink.value, accent: color.accent.value })
}

function channelsOf(css, name) {
  return new RegExp(`--palette-${name}:\\s*([0-9 ]+);`).exec(css)[1]
}

function cimsColors(project, text) {
  return compareColors(project, { surface: hex(channelsOf(text, "blue-50")), ink: hex(channelsOf(text, "navy")), accent: hex(channelsOf(text, "blue")) })
}

export const HANDLERS = {
  "bench-bridge-instruments": instrumentNames,
  "bench-bridge-colors": benchBridgeColors,
  "cims-colors": cimsColors,
}
