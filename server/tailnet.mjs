/** Reads this machine's tailnet name from Tailscale, so no host name is written in code. */
import { execFileSync } from "node:child_process"

export function parseSelf(raw) {
  const self = JSON.parse(raw).Self
  return { name: String(self.DNSName).replace(/\.$/, ""), ip: String(self.TailscaleIPs[0]) }
}

export function tailnetHost() {
  return parseSelf(execFileSync("tailscale", ["status", "--self", "--json"], { encoding: "utf8" }))
}
