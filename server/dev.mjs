/** Dev entry: serves the site on all interfaces and prints the one tailnet link. */
import { createServer } from "node:http"
import dev from "./dev.json" with { type: "json" }
import { serveFile } from "./static.mjs"
import { tailnetHost } from "./tailnet.mjs"

function listening(host) {
  console.log(`http://${host.name}:${dev.port}/`)
}

function main() {
  const host = tailnetHost()
  createServer(serveFile).listen(dev.port, "0.0.0.0", listening.bind(null, host))
}

main()
