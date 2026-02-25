import { execSync } from "node:child_process";

export function getOpencodeVersion(): string | null {
  try {
    const output = execSync("opencode --version", {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
    const match = output.match(/v?(\d+\.\d+\.\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
