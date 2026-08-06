import { describe, expect, test } from "bun:test";
import { sanitizeSpritzSettings } from "./settings.js";

describe("Spritz plugin settings", () => {
  test("preserves keyword preferences but strips legacy secrets", () => {
    expect(
      sanitizeSpritzSettings({
        apiKey: "must-not-survive",
        keywords: { enabled: false, patterns: ["invoice", 42] },
        arbitrary: { nested: true },
      }),
    ).toEqual({
      keywords: { enabled: false, patterns: ["invoice"] },
    });
  });
});
