import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readConfig } from "./config.js";
import {
  addMcpServerToConfig,
  addPluginToConfig,
  createSpritzMcpEntry,
} from "./mcp.js";

const tempDirectories: string[] = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("Spritz MCP configuration", () => {
  test("registers the fail-closed CLI broker boundary without embedding a key", () => {
    const entry = createSpritzMcpEntry();

    expect(entry).toEqual({
      type: "local",
      command: ["spritz", "auth", "mcp", "--access", "user"],
    });
    expect(JSON.stringify(entry)).not.toContain("SPRITZ_API_KEY");
  });

  test("preserves JSONC comments while adding only Spritz entries", () => {
    const directory = mkdtempSync(join(tmpdir(), "spritz-opencode-"));
    tempDirectories.push(directory);
    const configPath = join(directory, "opencode.jsonc");
    writeFileSync(
      configPath,
      `{
  // Keep this user-owned comment.
  "theme": "system",
  "plugin": ["unrelated-plugin", "@spritz-finance/opencode@latest"],
  "mcp": {
    // Keep this unrelated server.
    "other": { "type": "remote", "url": "https://example.test/mcp" },
  },
}
`,
    );

    expect(addPluginToConfig(configPath)).toBe(true);
    expect(addMcpServerToConfig(configPath)).toBe(true);

    const content = readFileSync(configPath, "utf-8");
    expect(content).toContain("// Keep this user-owned comment.");
    expect(content).toContain("// Keep this unrelated server.");
    expect(readConfig(configPath)).toMatchObject({
      theme: "system",
      plugin: ["unrelated-plugin", "@spritz-finance/opencode@0.1.4"],
      mcp: {
        other: { type: "remote", url: "https://example.test/mcp" },
        spritz: createSpritzMcpEntry(),
      },
    });
  });
});
