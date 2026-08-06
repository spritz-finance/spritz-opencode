import { describe, expect, test } from "bun:test";
import { createSpritzMcpEntry } from "./mcp.js";

describe("Spritz MCP configuration", () => {
  test("uses the CLI credential broker without embedding a key", () => {
    const entry = createSpritzMcpEntry();

    expect(entry).toEqual({
      type: "local",
      command: ["spritz", "auth", "mcp", "--access", "user"],
    });
    expect(JSON.stringify(entry)).not.toContain("SPRITZ_API_KEY");
  });
});
